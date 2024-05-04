#![cfg_attr(not(feature = "std"), no_std, no_main)]
/// SPDX-License-Identifier: MIT

/// # Marketplace contract
///
/// Contract that contains all the logic for the marketplace and auction.
///
/// ## Marketplace
///
/// The marketplace is a contract that allows users to list their NFTs for sale,
/// and then buy them in different ways.
///
/// ## Auction
///
/// The auction is a contract that allows users to list their NFTs for sale.
///
/// ### Auction implementation
///
/// - The auction is implemented using a modified version of the English auction.
/// - The auction is started by the seller, who sets the starting price, and the duration of the auction.
/// - The auction is then started, and users can bid on the NFT.
/// - The auction ends when the duration is over.
/// - The winner of the auction is the highest bidder.
/// - If the auction is won, the NFT is transferred to the winner, and the seller receives the bid amount.
/// - If the auction is not won, the NFT is transferred back to the seller.
///
/// ## Royalties
///
/// Royalties are a percentage of the sale price that is paid to the creator of the NFT.
/// They are paid to the creator of the NFT when the NFT is sold,
/// and stored directly in the NFT contract (see ArchNFT).
#[openbrush::implementation(Ownable, AccessControl, Upgradeable)]
#[openbrush::contract]
mod marketplace {
    use archisinal_lib::impls::admin_access::AdminAccessImpl;
    use archisinal_lib::impls::auction::*;
    use archisinal_lib::impls::collection_access;
    use archisinal_lib::impls::collection_access::CollectionAccess;
    use archisinal_lib::impls::marketplace::data::Listing;
    use archisinal_lib::impls::marketplace::*;
    use archisinal_lib::impls::shared::consts::ADMIN;
    use archisinal_lib::impls::shared::currency::Currency;
    use archisinal_lib::impls::timestamp_provider::TimestampProviderImpl;
    use archisinal_lib::impls::{auction, marketplace};
    use archisinal_lib::traits::admin_access::*;
    use archisinal_lib::traits::auction::*;
    use archisinal_lib::traits::events::admin_access::AdminAccessEvents;
    use archisinal_lib::traits::events::auction::AuctionEvents;
    use archisinal_lib::traits::events::marketplace::MarketplaceEvents;
    use archisinal_lib::traits::marketplace::*;
    use archisinal_lib::traits::timestamp_provider::*;
    use archisinal_lib::traits::ArchisinalError;
    use archisinal_lib::traits::ProjectResult;
    use ink::codegen::{EmitEvent, Env};
    use ink::prelude::vec::Vec;
    use openbrush::contracts::psp34::Id;
    use openbrush::traits::Storage;

    #[ink(event)]
    pub struct ListNFT {
        /// The account id of the listing.
        #[ink(topic)]
        listing_id: u128,
        /// The account id of the listing creator (anyone with access to the NFT).
        #[ink(topic)]
        creator: AccountId,
        /// Account id of the collection of the NFT.
        #[ink(topic)]
        collection: AccountId,
        token_id: Id,
        price: u128,
        /// The currency used for the listing (Native / Custom(PSP22)).
        currency: Currency,
    }

    #[ink(event)]
    pub struct CancelListing {
        /// The canceller.
        #[ink(topic)]
        caller: AccountId,
        /// Id of the listing.
        #[ink(topic)]
        listing_id: u128,
    }

    #[ink(event)]
    pub struct BuyNFT {
        #[ink(topic)]
        buyer: AccountId,
        #[ink(topic)]
        listing_id: u128,
    }

    #[ink(event)]
    pub struct BuyBatch {
        #[ink(topic)]
        buyer: AccountId,
        #[ink(topic)]
        listing_ids: Vec<u128>,
    }

    #[ink(event)]
    pub struct AuctionCreated {
        #[ink(topic)]
        auction_id: u128,
        /// The account id of the auction creator (anyone with access to the NFT).
        #[ink(topic)]
        creator: AccountId,
        #[ink(topic)]
        collection: AccountId,
        token_id: Id,
        start_price: u128,
        /// The minimum bid step.
        min_bid_step: u128,
        start_time: u64,
        end_time: u64,
        /// The currency used for the listing (Native / Custom(PSP22)).
        currency: Currency,
    }

    #[ink(event)]
    pub struct CancelAuction {
        /// The canceller.
        #[ink(topic)]
        caller: AccountId,
        /// Id of the auction.
        #[ink(topic)]
        auction_id: u128,
    }

    #[ink(event)]
    pub struct BidPlaced {
        #[ink(topic)]
        bidder: AccountId,
        #[ink(topic)]
        auction_id: u128,
        #[ink(topic)]
        bid: u128,
    }

    #[ink(event)]
    pub struct NFTClaimed {
        #[ink(topic)]
        caller: AccountId,
        #[ink(topic)]
        auction_id: u128,
    }

    #[ink(event)]
    pub struct NoBids {
        #[ink(topic)]
        caller: AccountId,
        #[ink(topic)]
        auction_id: u128,
    }

    #[ink(event)]
    pub struct StartAuction {
        #[ink(topic)]
        caller: AccountId,
        #[ink(topic)]
        auction_id: u128,
    }

    #[ink(event)]
    pub struct EndAuction {
        #[ink(topic)]
        caller: AccountId,
        #[ink(topic)]
        auction_id: u128,
    }

    #[ink(event)]
    pub struct AdminAdded {
        #[ink(topic)]
        pub caller: AccountId,
        /// The account id of the new admin.
        #[ink(topic)]
        pub account_id: AccountId,
    }

    #[ink(event)]
    pub struct AdminRemoved {
        #[ink(topic)]
        pub caller: AccountId,
        /// The account id of the removed admin.
        #[ink(topic)]
        pub account_id: AccountId,
    }

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct Contract {
        #[storage_field]
        ownable: ownable::Data,
        #[storage_field]
        access_control: access_control::Data,
        #[storage_field]
        marketplace: marketplace::data::Data,
        #[storage_field]
        auction: auction::data::Data,
        #[storage_field]
        c_timestamp: u64,
        #[storage_field]
        collection_access: collection_access::Data,
    }

    impl Contract {
        #[ink(constructor)]
        pub fn new(owner: AccountId, collection_fabric_address: AccountId) -> Self {
            let mut instance = Self::default();

            ownable::Internal::_init_with_owner(&mut instance, owner);
            access_control::Internal::_init_with_admin(&mut instance, Some(owner));
            access_control::AccessControl::grant_role(&mut instance, ADMIN, Some(owner))
                .expect("Failed to grant role");

            CollectionAccess::set_collection_fabric_address(
                &mut instance,
                collection_fabric_address,
            );

            instance
        }

        #[ink(message)]
        pub fn set_timestamp(&mut self, timestamp: u64) -> ProjectResult<()> {
            self.c_timestamp = timestamp;

            Ok(())
        }

        #[ink(message)]
        pub fn add_timestamp(&mut self, delta: i64) -> ProjectResult<()> {
            let current = self.c_timestamp;

            let new = current
                .checked_add(delta as u64)
                .ok_or(if delta.is_negative() {
                    ArchisinalError::IntegerUnderflow
                } else {
                    ArchisinalError::IntegerOverflow
                });

            self.c_timestamp = new?;

            Ok(())
        }
    }

    impl MarketplaceImpl for Contract {}

    impl AuctionImpl for Contract {}

    impl AdminAccessImpl for Contract {}

    impl CollectionAccess for Contract {}

    impl Marketplace for Contract {
        #[ink(message)]
        fn get_listing_count(&self) -> u128 {
            MarketplaceImpl::get_listing_count(self)
        }

        #[ink(message)]
        fn get_listing_by_index(&self, index: u128) -> Option<Listing> {
            MarketplaceImpl::get_listing_id_by_index(self, index)
        }

        #[ink(message)]
        fn list_nft_for_sale(
            &mut self,
            creator: AccountId,
            collection: AccountId,
            token_id: Id,
            price: u128,
            currency: Currency,
        ) -> ProjectResult<u128> {
            MarketplaceImpl::list_nft_for_sale(self, creator, collection, token_id, price, currency)
        }

        #[ink(message)]
        fn cancel_listing(&mut self, listing_id: u128) -> ProjectResult<()> {
            MarketplaceImpl::cancel_listing(self, listing_id)
        }

        #[ink(message, payable)]
        fn buy_nft(&mut self, listing_id: u128) -> ProjectResult<()> {
            MarketplaceImpl::buy_nft(self, listing_id)
        }

        #[ink(message, payable)]
        fn buy_batch(&mut self, ids: Vec<u128>) -> ProjectResult<()> {
            MarketplaceImpl::buy_batch(self, ids)
        }
    }

    impl Auction for Contract {
        #[ink(message)]
        fn get_auction_count(&self) -> u128 {
            AuctionImpl::get_auction_count(self)
        }

        #[ink(message)]
        fn get_auction_by_index(&self, index: u128) -> Option<auction::data::Auction> {
            AuctionImpl::get_auction_by_index(self, index)
        }

        #[ink(message)]
        fn list_nft_for_auction(&mut self, auction_info: AuctionInfo) -> ProjectResult<u128> {
            AuctionImpl::list_nft_for_auction(self, auction_info)
        }

        #[ink(message)]
        fn start_auction(&mut self, auction_id: u128) -> ProjectResult<()> {
            AuctionImpl::start_auction(self, auction_id)
        }

        #[ink(message)]
        fn cancel_auction(&mut self, auction_id: u128) -> ProjectResult<()> {
            AuctionImpl::cancel_auction(self, auction_id)
        }

        #[ink(message, payable)]
        fn bid_nft(&mut self, auction_id: u128, price: u128) -> ProjectResult<()> {
            AuctionImpl::bid_nft(self, auction_id, price)
        }

        #[ink(message)]
        fn claim_nft(&mut self, auction_id: u128) -> ProjectResult<()> {
            AuctionImpl::claim_nft(self, auction_id)
        }
    }

    impl AdminAccess for Contract {
        #[ink(message)]
        fn add_admin(&mut self, account_id: AccountId) -> ProjectResult<()> {
            AdminAccessImpl::add_admin(self, account_id)
        }

        #[ink(message)]
        fn remove_admin(&mut self, account_id: AccountId) -> ProjectResult<()> {
            AdminAccessImpl::remove_admin(self, account_id)
        }

        #[ink(message)]
        fn is_admin(&self, account_id: AccountId) -> bool {
            AdminAccessImpl::is_admin(self, account_id)
        }
    }

    impl MarketplaceEvents for Contract {
        fn emit_list_nft(
            &self,
            listing_id: u128,
            creator: AccountId,
            collection: AccountId,
            token_id: Id,
            price: u128,
            currency: Currency,
        ) {
            self.env().emit_event(ListNFT {
                listing_id,
                creator,
                collection,
                token_id,
                price,
                currency,
            });
        }

        fn emit_cancel_listing(&self, caller: AccountId, listing_id: u128) {
            self.env().emit_event(CancelListing { caller, listing_id });
        }

        fn emit_buy_nft(&self, buyer: AccountId, listing_id: u128) {
            self.env().emit_event(BuyNFT { buyer, listing_id });
        }

        fn emit_buy_batch(&self, buyer: AccountId, listing_ids: Vec<u128>) {
            self.env().emit_event(BuyBatch { buyer, listing_ids });
        }
    }

    impl AuctionEvents for Contract {
        fn emit_auction_created(
            &self,
            auction_id: u128,
            creator: AccountId,
            collection: AccountId,
            token_id: Id,
            start_price: u128,
            min_bid_step: u128,
            currency: Currency,
            start_time: u64,
            end_time: u64,
        ) {
            self.env().emit_event(AuctionCreated {
                auction_id,
                creator,
                collection,
                token_id,
                start_price,
                min_bid_step,
                currency,
                start_time,
                end_time,
            });
        }

        fn emit_auction_started(&self, caller: AccountId, auction_id: u128) {
            self.env().emit_event(StartAuction { caller, auction_id });
        }

        fn emit_auction_ended(&self, caller: AccountId, auction_id: u128) {
            self.env().emit_event(EndAuction { caller, auction_id });
        }

        fn emit_no_bids(&self, caller: AccountId, auction_id: u128) {
            self.env().emit_event(NoBids { caller, auction_id });
        }

        fn emit_auction_cancelled(&self, caller: AccountId, auction_id: u128) {
            self.env().emit_event(CancelAuction { caller, auction_id });
        }

        fn emit_bid_placed(&self, auction_id: u128, bidder: AccountId, bid: u128) {
            self.env().emit_event(BidPlaced {
                auction_id,
                bidder,
                bid,
            });
        }

        fn emit_nft_claimed(&self, caller: AccountId, auction_id: u128) {
            self.env().emit_event(NFTClaimed { caller, auction_id });
        }
    }

    impl AdminAccessEvents for Contract {
        fn emit_admin_added(&self, caller: AccountId, account_id: AccountId) {
            self.env().emit_event(AdminAdded { caller, account_id });
        }

        fn emit_admin_removed(&self, caller: AccountId, account_id: AccountId) {
            self.env().emit_event(AdminRemoved { caller, account_id });
        }
    }

    impl TimestampProviderImpl for Contract {
        fn timestamp(&self) -> u64 {
            self.c_timestamp
        }
    }

    impl TimestampProvider for Contract {
        #[ink(message)]
        fn timestamp(&self) -> u64 {
            TimestampProviderImpl::timestamp(self)
        }
    }
}

//! SPDX-License-Identifier: MIT
#![allow(clippy::too_many_arguments)]
use crate::impls::auction::data;
use crate::impls::shared::currency::Currency;
use crate::traits::ProjectResult;
use ink::primitives::AccountId;
use openbrush::contracts::psp34::Id;

/// Auction trait
///
/// This trait defines the methods that are available on the Auction contract.
///
/// # Note
///
/// This trait is implemented by the Marketplace contract.
#[openbrush::trait_definition]
pub trait Auction {
    /// Get the number of auctions
    ///
    /// # Note
    /// The auctions are indexed from 0 to `get_auction_count() - 1`
    ///
    /// # Returns
    ///
    /// * `u128` - The number of auctions
    #[ink(message)]
    fn get_auction_count(&self) -> u128;

    /// Get the auction by index
    ///
    /// # Note
    /// The auctions are indexed from 0 to `get_auction_count() - 1`
    ///
    /// # Arguments
    ///
    /// * `index` - The index of the auction
    ///
    /// # Returns
    ///
    /// * `Option<data::Auction>` - The auction, if it exists, otherwise None
    #[ink(message)]
    fn get_auction_by_index(&self, index: u128) -> Option<data::Auction>;

    /// List an NFT for auction
    ///
    /// # Note
    /// This function will transfer the NFT from the caller to the Auction contract.
    /// Sets the auction state to `WaitingAuction`. Needs to be started by the owner of the NFT.
    ///
    /// # Arguments (passed as `AuctionInfo`)
    ///
    /// * `creator` - The creator of the listing
    /// * `collection` - The collection of the listing
    /// * `token_id` - The token ID of the listing
    /// * `start_price` - The starting price of the listing
    /// * `min_bid_step` - The minimum bid step of the listing
    /// * `currency` - The currency of the listing, either `Currency::Native` or `Currency::Custom(AccountId)`
    /// * `start_time` - The start time of the listing
    /// * `end_time` - The end time of the listing
    ///
    /// # Returns
    ///
    /// * `ProjectResult<u128>` - The ID of the listing, if successful, otherwise an error
    ///
    /// # Errors
    ///
    /// * `ArchisinalError::CallerIsNotNFTOwner` - The caller is not the owner of the NFT
    /// * `ArchisinalError::PSP34Error(...)` - The PSP34 contract returned an error
    /// * `ArchisinalError::IntegerOverflow` - An integer overflow occurred
    /// * `ArchisinalError::AuctionPriceIsZero` - The auction price is zero
    /// * `ArchisinalError::AuctionEndTimeIsBeforeStartTime` - The end time of the auction is before the start time
    /// * `ArchisinalError::AuctionStartTimeIsBeforeNow` - The start time of the auction is before the current time
    /// * `ArchisinalError::AuctionMinBidStepIsZero` - The minimum bid step of the auction is zero
    ///
    /// # Emits
    ///
    /// * `AuctionCreated` - If the auction was listed successfully
    #[ink(message)]
    fn list_nft_for_auction(&mut self, auction_info: AuctionInfo) -> ProjectResult<u128>;

    /// Start an auction
    ///
    /// # Note
    ///
    /// The caller must be the creator of the auction.
    /// The auction should be in the `WaitingAuction` state, otherwise it cannot be started.
    ///
    /// # Arguments
    ///
    /// * `auction_id` - The ID of the auction
    ///
    /// # Returns
    ///
    /// * `ProjectResult<()>` - If successful, otherwise an error
    ///
    /// # Errors
    ///
    /// * `ArchisinalError::AuctionNotFound` - The auction was not found
    /// * `ArchisinalError::CallerIsNotAuctionOwner` - The caller is not the creator of the auction
    /// * `ArchisinalError::AuctionStartTimeIsBeforeNow` - The start time of the auction is before the current time
    /// * `ArchisinalError::AuctionNotWaiting` - The auction is not in the `WaitingAuction` state
    ///
    /// # Emits
    ///
    /// * `StartAuction` - If the auction was started successfully
    #[ink(message)]
    fn start_auction(&mut self, auction_id: u128) -> ProjectResult<()>;

    /// Cancel an auction
    ///
    /// # Note
    /// The caller must be the creator of the auction.
    /// Auction should be in the `WaitingAuction` state, otherwise it cannot be cancelled.
    /// Changes the state of the auction listing to `Cancelled`.
    ///
    /// # Arguments
    ///
    /// * `auction_id` - The ID of the auction
    ///
    /// # Returns
    ///
    /// * `ProjectResult<()>` - If successful, otherwise an error
    ///
    /// # Errors
    ///
    /// * `ArchisinalError::AuctionNotFound` - The auction was not found
    /// * `ArchisinalError::CallerIsNotAuctionCreator` - The caller is not the creator of the auction
    /// * `ArchisinalError::PSP34Error(...)` - The PSP34 contract returned an error
    /// * `ArchisinalError::AuctionNotWaiting` - The auction is not in the waiting state, so it cannot be cancelled
    ///
    /// # Emits
    ///
    /// * `CancelAuction` - If the auction was cancelled successfully
    #[ink(message)]
    fn cancel_auction(&mut self, auction_id: u128) -> ProjectResult<()>;

    /// Bid on an auction
    ///
    /// # Note
    ///
    /// This method is payable, so the caller must send the bid amount with the call.
    /// The bid amount must be greater than or equal to the current price of the auction + min step.
    /// Should be in the `InAuction` state.
    ///
    /// # Arguments
    ///
    /// * `auction_id` - The ID of the auction
    /// * `price` - The price to bid
    ///
    /// # Returns
    ///
    /// * `ProjectResult<()>` - If successful, otherwise an error
    ///
    /// # Errors
    ///
    /// * `ArchisinalError::AuctionNotFound` - The auction was not found
    /// * `ArchisinalError::AuctionNotInAuction` - The auction is not in the auction state, so it cannot be bid on
    /// * `ArchisinalError::BidPriceTooLow` - The bid amount is too low
    /// * `ArchisinalError::AuctionNotStarted` - The bid amount is too high
    /// * `ArchisinalError::AuctionEnded` - The auction has ended
    /// * `ArchisinalError::IntegerOverflow` - An integer overflow occurred
    /// * `ArchisinalError::PSP22Error(...)` - The PSP22 contract returned an error
    ///
    /// # Emits
    ///
    /// * `BidPlaced` - If the bid was successful
    #[ink(message, payable)]
    fn bid_nft(&mut self, auction_id: u128, price: u128) -> ProjectResult<()>;

    /// Claim an NFT from an auction
    ///
    /// # Note
    ///
    /// Should be in the `InAuction` state, but current time is greater than the end time.
    /// If successful, the NFT will be transferred to the highest bidder and listing will be switched to `Ended` state.
    ///
    /// # Arguments
    ///
    /// * `auction_id` - The ID of the auction
    ///
    /// # Returns
    ///
    /// * `ProjectResult<()>` - If successful, otherwise an error
    ///
    /// # Errors
    ///
    /// * `ArchisinalError::AuctionNotFound` - The auction was not found
    /// * `ArchisinalError::AuctionNotInAuction` - The auction is not in the auction state, so it cannot be claimed
    /// * `ArchisinalError::AuctionNotEnded` - The auction has not ended (current time is less than the end time)
    /// * `ArchisinalError::PSP34Error(...)` - The PSP34 contract returned an error (e.g. NFT transfer failed)
    ///
    /// # Emits
    ///
    /// * `NFTClaimed` - If the NFT was claimed successfully
    /// * `EndAuction` - If the auction was ended successfully
    /// * `NoBids` - If there were no bids on the auction
    #[ink(message)]
    fn claim_nft(&mut self, auction_id: u128) -> ProjectResult<()>;
}

#[openbrush::wrapper]
pub type AuctionRef = dyn Auction;

/// The auction info, used in args.
#[derive(Clone, Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(
    feature = "std",
    derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
)]
pub struct AuctionInfo {
    /// The id of the auction.
    pub creator: AccountId,
    /// The collection of the auction.
    pub collection: AccountId,
    /// The token id of the auction.
    pub token_id: Id,
    /// The start price of the auction.
    pub start_price: u128,
    /// The minimum bid step of the auction.
    pub min_bid_step: u128,
    /// The currency of the auction.
    pub currency: Currency,
    /// The start time of the auction.
    pub start_time: u64,
    /// The end time of the auction.
    pub end_time: u64,
}

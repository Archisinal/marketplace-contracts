//! SPDX-License-Identifier: MIT
use crate::impls::marketplace::data::Listing;
use crate::impls::shared::currency::Currency;
use crate::traits::ProjectResult;
use ink::prelude::vec::Vec;
use ink::primitives::AccountId;
use openbrush::contracts::psp34::Id;

/// Marketplace trait definition
///
/// # Note
///
/// This trait is used to create, read and manage listings
#[openbrush::trait_definition]
pub trait Marketplace {
    /// Get the number of listings
    ///
    /// # Note
    /// The listings are indexed from 0 to `get_listing_count() - 1`
    ///
    /// # Returns
    ///
    /// * `u128` - The number of listings
    #[ink(message)]
    fn get_listing_count(&self) -> u128;

    /// Get the listing by index
    ///
    /// # Note
    /// The listings are indexed from 0 to `get_listing_count() - 1`
    ///
    /// # Arguments
    ///
    /// * `index` - The index of the listing
    ///
    /// # Returns
    ///
    /// * `Option<Listing>` - The listing, if it exists, otherwise None
    #[ink(message)]
    fn get_listing_by_index(&self, index: u128) -> Option<Listing>;

    /// List a NFT for sale
    ///
    /// # Note
    /// This function will transfer the NFT from the caller to the Marketplace contract.
    /// Sets the listing state to `OnSale`
    ///
    /// # Arguments
    ///
    /// * `creator` - The creator of the listing
    /// * `collection` - The collection of the listing
    /// * `token_id` - The token ID of the listing
    /// * `price` - The price of the listing
    /// * `currency` - The currency of the listing, either `Currency::Native` or `Currency::Custom(AccountId)`
    ///
    /// # Returns
    ///
    /// * `ProjectRestul<u128>` - The ID of the listing that was created, if successful otherwise an error
    ///
    /// # Errors
    ///
    /// * `ArchisinalError::CallerIsNotNFTOwner` - If the caller is not the owner of the NFT
    /// * `ArchisinalError::PSP34Error(...)` - If the PSP34 contract returns an error
    /// * `ArchisinalError::IntegerOverflow` - If an integer overflow occurs
    ///
    /// # Emits
    ///
    /// * `ListNFT` - If the listing was created successfully
    #[ink(message)]
    fn list_nft_for_sale(
        &mut self,
        creator: AccountId,
        collection: AccountId,
        token_id: Id,
        price: u128,
        currency: Currency,
    ) -> ProjectResult<u128>;

    /// List a NFT for auction
    ///
    /// # Note
    /// This function will transfer the NFT from the Marketplace contract to creator back.
    /// The listing should be in `OnSale` state.
    ///
    /// # Arguments
    ///
    /// * `listing_id` - The ID of the listing
    ///
    /// # Returns
    ///
    /// * `ProjectResult<()>` - If successful, otherwise an error
    ///
    /// # Errors
    ///
    /// * `ArchisinalError::ListingNotFound` - If the listing does not exist
    /// * `ArchisinalError::ListingIsNotOnSale` - If the listing is not in `OnSale` state
    /// * `ArchisinalError::PSP34Error(...)` - If the PSP34 contract returns an error
    /// * `ArchisinalError::CallerIsNotListingOwner` - If the caller is not the owner of the listing
    ///
    /// # Emits
    ///
    /// * `CancelListing` - If the listing was cancelled successfully
    #[ink(message)]
    fn cancel_listing(&mut self, listing_id: u128) -> ProjectResult<()>;

    /// Buy a NFT
    ///
    /// # Note
    /// This function will transfer the NFT from the Marketplace contract to the buyer.
    ///
    /// # Arguments
    ///
    /// * `listing_id` - The ID of the listing
    ///
    /// # Returns
    ///
    /// * `ProjectResult<()>` - If successful, otherwise an error
    ///
    /// # Errors
    ///
    /// * `ArchisinalError::ListingNotFound` - If the listing does not exist
    /// * `ArchisinalError::ListingIsNotOnSale` - If the listing is not in `OnSale` state
    /// * `ArchisinalError::PSP34Error(...)` - If the PSP34 contract returns an error
    /// * `ArchisinalError::CallerIsNotListingOwner` - If the caller is not the owner of the listing
    /// * `ArchisinalError::IntegerOverflow` - If an integer overflow occurs
    /// * `ArchisinalError::TransferNativeError` - If the transfer of native currency fails
    /// * `ArchisinalError::PSP22(...)` - If the transfer of custom currency fails
    ///
    /// # Emits
    ///
    /// * `BuyNFT` - If the NFT was bought successfully
    #[ink(message, payable)]
    fn buy_nft(&mut self, listing_id: u128) -> ProjectResult<()>;

    /// Buy a batch of NFTs
    ///
    /// # Note
    ///
    /// This function will transfer the NFTs from the Marketplace contract to the buyer.
    ///
    /// # Arguments
    ///
    /// * `ids` - The IDs of the listings
    ///
    /// # Returns
    ///
    /// * `ProjectResult<()>` - If successful, otherwise an error
    ///
    /// # Errors
    ///
    /// * `ArchisinalError::ListingNotFound` - If the listing does not exist
    /// * `ArchisinalError::ListingIsNotOnSale` - If the listing is not in `OnSale` state
    /// * `ArchisinalError::PSP34Error(...)` - If the PSP34 contract returns an error
    /// * `ArchisinalError::CallerIsNotListingOwner` - If the caller is not the owner of the listing
    /// * `ArchisinalError::IntegerOverflow` - If an integer overflow occurs
    /// * `ArchisinalError::TransferNativeError` - If the transfer of native currency fails
    /// * `ArchisinalError::PSP22(...)` - If the transfer of custom currency fails
    ///
    /// # Emits
    ///
    /// * `BuyBatch` - If the NFTs were bought successfully
    #[ink(message, payable)]
    fn buy_batch(&mut self, ids: Vec<u128>) -> ProjectResult<()>;
}

#[openbrush::wrapper]
pub type MarketplaceRef = dyn Marketplace;

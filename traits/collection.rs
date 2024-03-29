//! SPDX-License-Identifier: MIT
use crate::impls::collection::data::NftMetadata;
use crate::traits::ProjectResult;
use openbrush::contracts::ownable::*;
use openbrush::contracts::psp34::extensions::burnable::*;
use openbrush::contracts::psp34::extensions::metadata::*;
use openbrush::contracts::psp34::extensions::mintable::*;
use openbrush::traits::AccountId;
use openbrush::traits::String;

/// ArchNFT trait
///
/// This trait defines the ArchNFT interface.
#[openbrush::trait_definition]
pub trait Collection {
    /// Collection name
    ///
    /// # Returns
    ///
    /// * `Option<String>` - The name of the collection, if it exists, otherwise None.
    #[ink(message)]
    fn collection_name(&self) -> Option<String>;

    /// Collection uri
    ///
    /// # Note
    /// Collection uri is a link to the collection's metadata, and it's used as a prefix for the token uri.
    /// For example, if the collection uri is `https://example.com/collections/1`, and the token uri is `1`, then the full token uri is `https://example.com/collections/1/1`.
    /// It's used to optimize the gas costs.
    ///
    /// # Returns
    ///
    /// * `Option<String>` - The uri of the collection, if it exists, otherwise None.
    #[ink(message)]
    fn collection_uri(&self) -> Option<String>;

    /// Collection royalty
    ///
    /// # Note
    ///
    /// The royalty is a percentage of the sale price that is paid to the collection owner.
    /// For example, if the royalty is 100, then 1% of the sale price is paid to the collection owner.
    ///
    /// # Returns
    ///
    /// * `u32` - The royalty of the collection (from 1 to 10'000).
    #[ink(message)]
    fn collection_royalty(&self) -> u32;

    /// Collection additional info
    ///
    /// # Note
    /// Additional info is a string that can be used to store additional information about the collection.
    /// For example, it can be used to store the collection's website or JSON blob.
    ///
    /// # Returns
    ///
    /// * `Option<String>` - The additional info of the collection, if it exists, otherwise None.
    #[ink(message)]
    fn collection_additional_info(&self) -> Option<String>;

    /// Set the name of the collection.
    ///
    /// # Arguments
    ///
    /// * `name` - The name of the collection.
    ///
    /// # Errors
    ///
    /// Returns `ProjectError::OwnableError` if the caller is not the owner.
    ///
    /// # Emits
    ///
    /// * `SetCollectionName` - Emits when the collection name is set.
    #[ink(message)]
    fn set_collection_name(&mut self, name: String) -> ProjectResult<()>;

    /// Set the uri of the collection.
    ///
    /// # Note
    ///
    /// Collection uri is a link to the collection's metadata, and it's used as a prefix for the token uri.
    /// Could be called only by the owner.
    ///
    /// # Arguments
    ///
    /// * `uri` - The uri of the collection.
    ///
    /// # Errors
    ///
    /// Returns `ProjectError::OwnableError` if the caller is not the owner.
    ///
    /// # Emits
    ///
    /// * `SetCollectionUri` - Emits when the collection uri is set.
    #[ink(message)]
    fn set_collection_uri(&mut self, uri: String) -> ProjectResult<()>;

    /// Set the additional info of the collection.
    ///
    /// # Note
    /// Additional info is a string that can be used to store additional information about the collection.
    ///
    /// # Arguments
    ///
    /// * `additional_info` - The additional info of the collection.
    ///
    /// # Returns
    ///
    /// * `ProjectResult<()>` - The result of the operation.
    ///
    /// # Errors
    ///
    /// Returns `ProjectError::OwnableError(...)` if the caller is not the owner.
    ///
    /// # Emits
    ///
    /// * `SetCollectionAdditionalInfo` - Emits when the collection additional info is set.
    #[ink(message)]
    fn set_collection_additional_info(&mut self, additional_info: String) -> ProjectResult<()>;

    /// Set the metadata of NFT
    ///
    /// # Arguments
    ///
    /// * `id` - The id of the NFT.
    /// * `metadata` - The metadata of the NFT.
    ///
    /// # Returns
    ///
    /// * `ProjectResult<()>` - The result of the operation.
    ///
    /// # Errors
    ///
    /// Returns `ProjectError::OwnableError(...)` if the caller is not the owner.
    ///
    /// # Emits
    ///
    /// * `NFTMetadataSet` - Emits when the NFT metadata is set.
    ///
    /// # Note
    ///
    /// This function is used to set the metadata of the NFT.
    #[ink(message)]
    fn update_nft_metadata(&mut self, id: Id, metadata: NftMetadata) -> ProjectResult<()>;

    /// Get the metadata of NFT
    ///
    /// # Arguments
    ///
    /// * `id` - The id of the NFT.
    ///
    /// # Returns
    ///
    /// * `Option<NftMetadata>` - The metadata of the NFT, if it exists, otherwise None.
    #[ink(message)]
    fn get_nft_metadata(&self, id: Id) -> Option<NftMetadata>;

    /// Mint NFT with metadata
    ///
    /// # Arguments
    ///
    /// * `to` - The account id of the receiver.
    /// * `id` - The id of the NFT.
    /// * `metadata` - The metadata of the NFT.
    ///
    /// # Returns
    ///
    /// * `ProjectResult<()>` - The result of the operation.
    #[ink(message)]
    fn mint_with_metadata(
        &mut self,
        to: AccountId,
        id: Id,
        metadata: NftMetadata,
    ) -> ProjectResult<()>;
}

/// ArchNFTRef type
#[openbrush::wrapper]
pub type CollectionRef =
    dyn Collection + PSP34 + PSP34Metadata + PSP34Mintable + PSP34Burnable + Ownable;

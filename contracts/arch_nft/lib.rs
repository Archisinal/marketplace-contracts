#![cfg_attr(not(feature = "std"), no_std, no_main)]
/// SPDX-License-Identifier: MIT
pub use crate::arch_nft::*;

/// # Archisinal NFT contract
///
/// ## Overview
///
/// This is used to create a new NFT collection, and consists of the following components:
/// - PSP34: The PSP34 contract is used to manage the NFTs.
/// - Collection: The Collection contract is used to manage the collection info such as uris, royalties etc.
#[openbrush::implementation(Ownable, PSP34, PSP34Mintable, PSP34Burnable, Upgradeable)]
#[openbrush::contract]
mod arch_nft {
    use archisinal_lib::impls::collection::data::Data;
    use archisinal_lib::impls::collection::data::NftMetadata;
    use archisinal_lib::impls::collection::impls::CollectionImpl;
    use archisinal_lib::traits::collection::*;
    use archisinal_lib::traits::events::collection::CollectionEvents;
    use archisinal_lib::traits::ProjectResult;
    use ink::codegen::{EmitEvent, Env};
    use openbrush::contracts::psp34::Id;
    use openbrush::modifiers;
    use openbrush::traits::{Storage, String};

    #[ink(event)]
    pub struct Transfer {
        /// The account id of sender.
        #[ink(topic)]
        from: Option<AccountId>,
        /// The account id of receiver.
        #[ink(topic)]
        to: Option<AccountId>,
        /// The token id of NFT transferring.
        #[ink(topic)]
        token_id: Id,
    }

    #[ink(event)]
    pub struct Approval {
        #[ink(topic)]
        owner: AccountId,
        #[ink(topic)]
        spender: AccountId,
        #[ink(topic)]
        token_id: Option<Id>,
        approved: bool,
    }

    #[ink(event)]
    pub struct SetCollectionName {
        /// The new name of the collection.
        #[ink(topic)]
        name: String,
    }

    #[ink(event)]
    pub struct SetCollectionUri {
        /// The new uri of the collection.
        uri: String,
    }

    #[ink(event)]
    pub struct SetCollectionAdditionalInfo {
        /// The new additional info of the collection.
        additional_info: String,
    }

    #[ink(event)]
    pub struct NFTMetadataSet {
        id: Id,
        value: NftMetadata,
    }

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct Contract {
        #[storage_field]
        psp34: psp34::Data,
        #[storage_field]
        ownable: ownable::Data,
        #[storage_field]
        arch_nft: Data,
    }

    impl Contract {
        #[ink(constructor)]
        pub fn new(
            royalty: u32,
            token_name: Option<String>,
            token_uri: Option<String>,
            additional_info: Option<String>,
        ) -> Self {
            let mut instance = Self::default();

            if royalty > 10000 {
                panic!("Royalty must be less than or equal to 10000");
            }

            ownable::Internal::_init_with_owner(&mut instance, Self::env().caller());

            CollectionImpl::set_collection_royalty(&mut instance, royalty).unwrap();

            if let Some(name) = token_name {
                CollectionImpl::set_collection_name(&mut instance, name).unwrap();
            }

            if let Some(uri) = token_uri {
                CollectionImpl::set_collection_uri(&mut instance, uri).unwrap();
            }

            if let Some(info) = additional_info {
                CollectionImpl::set_collection_additional_info(&mut instance, info).unwrap();
            }

            instance
        }

        #[ink(constructor, default)]
        pub fn new_default(
            owner: AccountId,
            royalty: u32,
            token_name: Option<String>,
            token_uri: Option<String>,
            additional_info: Option<String>,
        ) -> Self {
            let mut instance = Self::default();
            let caller = Self::env().caller();

            if royalty > 10000 {
                panic!("Royalty must be less than or equal to 10000");
            }

            ownable::Internal::_init_with_owner(&mut instance, caller);

            CollectionImpl::set_collection_royalty(&mut instance, royalty).unwrap();

            if let Some(name) = token_name {
                CollectionImpl::set_collection_name(&mut instance, name).unwrap();
            }

            if let Some(uri) = token_uri {
                CollectionImpl::set_collection_uri(&mut instance, uri).unwrap();
            }

            if let Some(info) = additional_info {
                CollectionImpl::set_collection_additional_info(&mut instance, info).unwrap();
            }

            ownable::Internal::_init_with_owner(&mut instance, owner);

            instance
        }
    }

    #[default_impl(PSP34Mintable)]
    #[modifiers(ownable::only_owner)]
    fn mint(&mut self) {}

    #[default_impl(PSP34Burnable)]
    #[modifiers(ownable::only_owner)]
    fn burn(&mut self) {}

    #[overrider(psp34::Internal)]
    fn _emit_transfer_event(&self, from: Option<AccountId>, to: Option<AccountId>, id: Id) {
        self.env().emit_event(Transfer {
            from,
            to,
            token_id: id,
        });
    }

    #[overrider(psp34::Internal)]
    fn _emit_approval_event(&self, from: AccountId, to: AccountId, id: Option<Id>, approved: bool) {
        self.env().emit_event(Approval {
            owner: from,
            spender: to,
            token_id: id,
            approved,
        });
    }

    impl CollectionImpl for Contract {}

    impl Collection for Contract {
        #[ink(message)]
        fn collection_name(&self) -> Option<String> {
            CollectionImpl::collection_name(self)
        }

        #[ink(message)]
        fn collection_uri(&self) -> Option<String> {
            CollectionImpl::collection_uri(self)
        }

        #[ink(message)]
        fn collection_royalty(&self) -> u32 {
            CollectionImpl::collection_royalty(self)
        }

        #[ink(message)]
        fn collection_additional_info(&self) -> Option<String> {
            CollectionImpl::collection_additional_info(self)
        }

        #[ink(message)]
        fn set_collection_name(&mut self, name: String) -> ProjectResult<()> {
            CollectionImpl::set_collection_name(self, name)
        }

        #[ink(message)]
        fn set_collection_uri(&mut self, uri: String) -> ProjectResult<()> {
            CollectionImpl::set_collection_uri(self, uri)
        }

        #[ink(message)]
        fn set_collection_additional_info(&mut self, additional_info: String) -> ProjectResult<()> {
            CollectionImpl::set_collection_additional_info(self, additional_info)
        }

        #[ink(message)]
        fn update_nft_metadata(&mut self, id: Id, metadata: NftMetadata) -> ProjectResult<()> {
            CollectionImpl::update_nft_metadata(self, id, metadata)
        }

        #[ink(message)]
        fn get_nft_metadata(&self, id: Id) -> Option<NftMetadata> {
            CollectionImpl::get_nft_metadata(self, id)
        }

        #[ink(message)]
        fn mint_with_metadata(
            &mut self,
            to: AccountId,
            id: Id,
            metadata: NftMetadata,
        ) -> ProjectResult<()> {
            CollectionImpl::mint_with_metadata(self, to, id, metadata)
        }
    }

    impl CollectionEvents for Contract {
        fn emit_collection_name_set(&self, name: String) {
            self.env().emit_event(SetCollectionName { name });
        }

        fn emit_collection_uri_set(&self, uri: String) {
            self.env().emit_event(SetCollectionUri { uri });
        }

        fn emit_collection_additional_info_set(&self, additional_info: String) {
            self.env()
                .emit_event(SetCollectionAdditionalInfo { additional_info });
        }

        fn emit_nft_metadata_set(&self, id: Id, value: NftMetadata) {
            self.env().emit_event(NFTMetadataSet { id, value });
        }
    }
}

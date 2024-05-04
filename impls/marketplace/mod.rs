/// SPDX-License-Identifier: MIT
pub mod data;

/// SPDX-License-Identifier: MIT
use crate::impls::admin_access::AdminAccessImpl;
use crate::impls::collection_access::CollectionAccess;
use ink::prelude::vec;
use ink::prelude::vec::Vec;
use openbrush::contracts::ownable;
use openbrush::contracts::ownable::{Ownable, OwnableRef};
use openbrush::contracts::psp34::{Id, PSP34Ref};
use openbrush::traits::{AccountId, DefaultEnv, Storage};

use crate::impls::marketplace::data::{Data, Listing, ListingStatus};
use crate::impls::shared::currency::Currency;
use crate::impls::shared::utils::apply_fee;
use crate::traits::collection::CollectionRef;
use crate::traits::events::marketplace::MarketplaceEvents;
use crate::traits::{ArchisinalError, ProjectResult};

/// The marketplace implementation.
///
/// # Note
///
/// See `crate::traits::Marketplace` for more information.
pub trait MarketplaceImpl:
    Storage<Data>
    + Storage<ownable::Data>
    + Ownable
    + AdminAccessImpl
    + MarketplaceEvents
    + CollectionAccess
{
    fn get_listing_count(&self) -> u128 {
        self.data::<Data>().listing_count.get_or_default()
    }

    fn get_listing_id_by_index(&self, index: u128) -> Option<Listing> {
        self.data::<Data>().listings.get(&index)
    }

    fn list_nft_for_sale(
        &mut self,
        creator: AccountId,
        collection: AccountId,
        token_id: Id,
        price: u128,
        currency: Currency,
    ) -> ProjectResult<u128> {
        let contract_address: AccountId = <Self as DefaultEnv>::env().account_id();
        let caller = <Self as DefaultEnv>::env().caller();

        if PSP34Ref::owner_of(&collection, token_id.clone()) != Some(creator) || creator != caller {
            return Err(ArchisinalError::CallerIsNotNFTOwner);
        }

        self.check_collection(collection)?;

        PSP34Ref::transfer(&collection, contract_address, token_id.clone(), vec![])?;

        let listing_id = self.data::<Data>().listing_count.get_or_default();

        let royalty = CollectionRef::collection_royalty(&collection);

        let listing = Listing {
            id: listing_id,
            creator,
            collection,
            token_id: token_id.clone(),
            price,
            currency: currency.clone(),
            status: ListingStatus::OnSale,
            royalty,
        };

        self.data::<Data>().listings.insert(&listing_id, &listing);
        self.data::<Data>().listing_count.set(
            &listing_id
                .checked_add(1)
                .ok_or(ArchisinalError::IntegerOverflow)?,
        );

        self.emit_list_nft(listing_id, creator, collection, token_id, price, currency);

        Ok(listing_id)
    }

    fn cancel_listing(&mut self, listing_id: u128) -> ProjectResult<()> {
        let caller = <Self as DefaultEnv>::env().caller();
        let listing = self
            .data::<Data>()
            .listings
            .get(&listing_id)
            .ok_or(ArchisinalError::ListingNotFound)?;

        if listing.creator != caller && !self.is_admin(caller) {
            return Err(ArchisinalError::CallerIsNotListingOwner);
        }

        if listing.status != ListingStatus::OnSale {
            return Err(ArchisinalError::ListingNotOnSale);
        }

        self.data::<Data>().listings.insert(
            &listing_id,
            &Listing {
                status: ListingStatus::Cancelled,
                ..listing.clone()
            },
        );

        PSP34Ref::transfer(
            &listing.collection,
            listing.creator,
            listing.token_id.clone(),
            vec![],
        )?;

        self.emit_cancel_listing(caller, listing_id);

        Ok(())
    }

    fn buy_nft(&mut self, listing_id: u128) -> ProjectResult<()> {
        let caller = <Self as DefaultEnv>::env().caller();
        let mut listing = self
            .data::<Data>()
            .listings
            .get(&listing_id)
            .ok_or(ArchisinalError::ListingNotFound)?;

        if listing.status != ListingStatus::OnSale {
            return Err(ArchisinalError::ListingNotOnSale);
        }

        if caller == listing.creator {
            return Err(ArchisinalError::CallerIsListingOwner);
        }

        let currency = &mut listing.currency;

        let price = listing.price;
        let price_without_fee = apply_fee(&listing.price, listing.royalty)?;
        let fee = price
            .checked_sub(price_without_fee)
            .ok_or(ArchisinalError::IntegerUnderflow)?;

        // Check if the caller has enough balance to buy the NFT (in case of Native)
        currency.assure_transfer(price)?;

        PSP34Ref::transfer(
            &listing.collection,
            caller,
            listing.token_id.clone(),
            vec![],
        )?;

        currency.transfer_from(caller, listing.creator, price_without_fee)?;

        let collection_owner = OwnableRef::owner(&listing.collection)
            .unwrap_or(listing.creator);

        currency.transfer_from(caller, collection_owner, fee)?;

        self.data::<Data>().listings.insert(
            &listing_id,
            &Listing {
                status: ListingStatus::Sold,
                ..listing
            },
        );

        self.emit_buy_nft(caller, listing_id);

        Ok(())
    }

    fn buy_batch(&mut self, ids: Vec<u128>) -> ProjectResult<()> {
        let caller = <Self as DefaultEnv>::env().caller();

        let mut listings = ids.into_iter().try_fold(Vec::new(), |mut acc, id| {
            let listing = self
                .data::<Data>()
                .listings
                .get(&id)
                .ok_or(ArchisinalError::ListingNotFound)?;

            if listing.status != ListingStatus::OnSale {
                return Err(ArchisinalError::ListingNotOnSale);
            }

            if caller == listing.creator {
                return Err(ArchisinalError::CallerIsListingOwner);
            }

            acc.push(listing);

            Ok(acc)
        })?;

        let total_price_native =
            listings
                .clone()
                .into_iter()
                .try_fold(0u128, |mut acc, listing| {
                    acc += if listing.currency.is_native() {
                        listing.price
                    } else {
                        0
                    };

                    Ok::<u128, ArchisinalError>(acc)
                })?;

        if Self::env().transferred_value() < total_price_native {
            return Err(ArchisinalError::InsufficientFunds);
        }

        listings.iter_mut().try_for_each(|listing| {
            let collection = &mut listing.collection;
            let currency = &mut listing.currency;
            let token_id = &listing.token_id;
            let creator = &listing.creator;

            let royalty = listing.royalty;
            let price = &listing.price;
            let price_without_fee = apply_fee(price, royalty)?;
            let fee = price
                .checked_sub(price_without_fee)
                .ok_or(ArchisinalError::IntegerUnderflow)?;

            PSP34Ref::transfer(collection, caller, token_id.clone(), vec![])?;

            currency.transfer_from(caller, *creator, price_without_fee)?;

            let collection_owner = OwnableRef::owner(&listing.collection)
                .ok_or(ArchisinalError::CollectionOwnerNotFound)?;

            currency.transfer_from(caller, collection_owner, fee)?;

            self.data::<Data>().listings.insert(
                &listing.id,
                &Listing {
                    status: ListingStatus::Sold,
                    ..listing.clone()
                },
            );

            Ok::<(), ArchisinalError>(())
        })?;

        self.emit_buy_batch(
            caller,
            listings.into_iter().map(|listing| listing.id).collect(),
        );

        Ok(())
    }
}

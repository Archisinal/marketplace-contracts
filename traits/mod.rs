//! SPDX-License-Identifier: MIT
use openbrush::contracts::traits::{access_control, psp22};
use openbrush::contracts::{ownable, psp34};
use openbrush::traits::String;

pub mod account_manager;
pub mod admin_access;
pub mod auction;
pub mod collection;
pub mod collection_fabric;
pub mod creator;
pub mod events;
pub mod marketplace;
pub mod timestamp_provider;
pub mod user;

pub type ProjectResult<T> = Result<T, ArchisinalError>;

#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum ArchisinalError {
    NoOwner,
    AdminAccessError,
    AuctionMinBidStepIsZero,
    CodehashIsBanned,
    AuctionStartTimeIsBeforeNow,
    AccountAlreadyExists,
    InsufficientFunds,
    AuctionPriceIsZero,
    AuctionEndTimeIsBeforeStartTime,
    CollectionOwnerNotFound,
    AuctionNotEnded,
    BidPriceTooLow,
    AuctionEnded,
    AuctionNotStarted,
    AuctionNotInAuction,
    ListingNotOnSale,
    AuctionNotWaiting,
    CallerIsNotAuctionOwner,
    CallerIsListingOwner,
    CallerIsNotListingOwner,
    AuctionNotFound,
    ListingNotFound,
    IntegerOverflow,
    IntegerUnderflow,
    CollectionNotFound,
    CollectionIsBanned,
    CollectionIsNotWhitelisted,
    CallerIsNotNFTOwner,
    TransferNativeError,
    Ownable(ownable::OwnableError),
    AccessControl(access_control::AccessControlError),
    PSP34(psp34::PSP34Error),
    PSP22(psp22::PSP22Error),
    Other(String),
}

impl From<ownable::OwnableError> for ArchisinalError {
    fn from(error: ownable::OwnableError) -> Self {
        Self::Ownable(error)
    }
}

impl From<psp34::PSP34Error> for ArchisinalError {
    fn from(error: psp34::PSP34Error) -> Self {
        Self::PSP34(error)
    }
}

impl From<psp22::PSP22Error> for ArchisinalError {
    fn from(error: psp22::PSP22Error) -> Self {
        Self::PSP22(error)
    }
}

impl From<access_control::AccessControlError> for ArchisinalError {
    fn from(error: access_control::AccessControlError) -> Self {
        Self::AccessControl(error)
    }
}

/// SPDX-License-Identifier: MIT
use ink::prelude::vec;
use openbrush::contracts::traits::psp22::PSP22Ref;
use openbrush::traits::{AccountId, DefaultEnv};

use crate::traits::{ArchisinalError, ProjectResult};

/// The currency of a listing
///
/// # Note
///
/// The currency can either be the native token or a custom token, specified by the `AccountId` (PSP22 contract address)
///
/// # Example
///
/// ```
/// use archisinal_lib::impls::shared::currency::Currency;
/// // Account Id
/// use ink::primitives::AccountId;
///
/// let account_id = AccountId::from([0x0; 32]);
///
/// let native_currency = Currency::Native;
/// let custom_currency = Currency::Custom(account_id);
///
/// assert!(native_currency.is_native());
/// assert!(custom_currency.is_custom());
/// ```
#[derive(Clone, Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(
    feature = "std",
    derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
)]
pub enum Currency {
    Native,
    Custom(AccountId),
}

impl Currency {
    /// Checks if the currency is native.
    ///
    /// # Example
    ///
    /// ```
    /// use archisinal_lib::impls::shared::currency::Currency;
    ///
    /// let native_currency = Currency::Native;
    ///
    /// assert!(native_currency.is_native());
    /// ```
    pub fn is_native(&self) -> bool {
        matches!(self, Currency::Native)
    }

    /// Checks if the currency is custom.
    ///
    /// # Example
    ///
    /// ```
    /// use archisinal_lib::impls::shared::currency::Currency;
    /// use ink::primitives::AccountId;
    ///
    /// let account_id = AccountId::from([0x0; 32]);
    /// let custom_currency = Currency::Custom(account_id);
    ///
    /// assert!(custom_currency.is_custom());
    pub fn is_custom(&self) -> bool {
        matches!(self, Currency::Custom(_))
    }

    /// Transfers funds from the contract to the given account.
    ///
    /// # Example
    ///
    /// ```no_run
    /// use archisinal_lib::impls::shared::currency::Currency;
    /// use ink::primitives::AccountId;
    ///
    /// let account_id = AccountId::from([0x0; 32]);
    /// let mut native_currency = Currency::Native;
    ///
    /// native_currency.transfer(account_id, 100).unwrap();
    ///
    /// ```
    pub fn transfer(&mut self, to: AccountId, amount: u128) -> ProjectResult<()> {
        match self {
            Currency::Native => Self::env()
                .transfer(to, amount)
                .map_err(|_| ArchisinalError::TransferNativeError),
            Currency::Custom(address) => {
                PSP22Ref::transfer(address, to, amount, vec![]).map_err(ArchisinalError::PSP22)
            }
        }
    }

    /// Checks if the caller has enough funds to transfer.
    ///
    /// # Example
    ///
    /// ```no_run
    /// use archisinal_lib::impls::shared::currency::Currency;
    /// use ink::primitives::AccountId;
    ///
    /// let account_id = AccountId::from([0x0; 32]);
    /// let mut native_currency = Currency::Native;
    ///
    /// native_currency.assure_transfer(100).unwrap();
    /// ```
    ///
    /// # Arguments
    ///
    /// * `amount` - The amount to check if the caller has enough funds to transfer
    ///
    /// # Returns
    ///
    /// * `ProjectResult<()>` - If the caller has enough funds to transfer, otherwise an error
    ///
    /// # Errors
    ///
    /// * `ArchisinalError::TransferNativeError` - If the caller does not have enough funds to transfer
    ///
    /// # Note
    ///
    /// This function is only used for native currency, if the currency is custom, it will always return `Ok(())`,
    /// since the PSP22 contract will handle the transfer checks.
    pub fn assure_transfer(&self, amount: u128) -> ProjectResult<()> {
        match self {
            Currency::Native => {
                match Self::env().transferred_value().cmp(&amount) {
                    std::cmp::Ordering::Less => {
                        Err(ArchisinalError::TransferNativeError)
                    }
                    std::cmp::Ordering::Greater => {
                        let refund_amount = Self::env().transferred_value() - amount;
                        Self::env()
                            .transfer(Self::env().caller(), refund_amount)
                            .map_err(|_| ArchisinalError::TransferNativeError)
                    }
                    std::cmp::Ordering::Equal => Ok(())

                }
            }
            Currency::Custom(_) => Ok(()),
        }
    }

    /// Transfers funds from the given account to the contract.
    ///
    /// # Example
    ///
    /// ```no_run
    ///
    /// use archisinal_lib::impls::shared::currency::Currency;
    /// use ink::primitives::AccountId;
    ///
    /// let account_id = AccountId::from([0x0; 32]);
    /// let mut native_currency = Currency::Native;
    ///
    /// native_currency.transfer_from(account_id, account_id, 100).unwrap();
    /// ```
    ///
    /// # Arguments
    ///
    /// * `from` - The account to transfer from
    /// * `to` - The account to transfer to
    /// * `amount` - The amount to transfer
    ///
    /// # Returns
    ///
    /// * `ProjectResult<()>` - If the transfer was successful, otherwise an error
    ///
    /// # Errors
    ///
    /// * `ArchisinalError::TransferNativeError` - If the caller does not have enough funds to transfer
    /// * `ArchisinalError::PSP22` - If the PSP22 contract returns an error
    ///
    /// # Note
    ///
    /// If the currency is native, it will assure that the caller transferred enough funds to the contract, and then transfer to receiver.
    /// If the currency is custom, it will call the PSP22 contract to transfer the funds.
    pub fn transfer_from(
        &mut self,
        from: AccountId,
        to: AccountId,
        amount: u128,
    ) -> ProjectResult<()> {
        match self {
            Currency::Native => Self::env()
                .transfer(to, amount)
                .map_err(|_| ArchisinalError::TransferNativeError),
            Currency::Custom(address) => PSP22Ref::transfer_from(address, from, to, amount, vec![])
                .map_err(ArchisinalError::PSP22),
        }
    }
}

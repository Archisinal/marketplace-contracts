#![cfg_attr(not(feature = "std"), no_std, no_main)]
/// SPDX-License-Identifier: MIT
pub use crate::creator::*;

/// This is the implementation of the creator contract.
///
/// The creator contract is responsible for creating collections,
/// and managing the creator metadata. Designed to be extensible in the future.
#[openbrush::implementation(Upgradeable)]
#[openbrush::contract]
mod creator {

    use archisinal_lib::impls::user;
    use archisinal_lib::impls::user::data::UserData;
    use archisinal_lib::impls::user::impls::UserImpl;

    use archisinal_lib::traits::events::user::UserEvents;
    use archisinal_lib::traits::user::*;
    use archisinal_lib::traits::ProjectResult;
    use ink::codegen::{EmitEvent, Env};
    use ink::env::DefaultEnvironment;
    use ink::EnvAccess;
    use openbrush::contracts::ownable;
    use openbrush::traits::Storage;

    #[ink(event)]
    pub struct UserDataSet {
        /// New user_data.
        pub user_data: UserData,
    }

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct Contract {
        #[storage_field]
        pub ownable: ownable::Data,
        #[storage_field]
        pub user_data: user::data::Data,
    }

    impl Contract {
        #[ink(constructor)]
        pub fn new(owner: AccountId) -> Self {
            let mut instance = Self::default();

            ownable::Internal::_init_with_owner(&mut instance, owner);

            instance
        }

        #[ink(constructor, default)]
        pub fn default_constructor() -> Self {
            let mut instance = Self::default();

            ownable::Internal::_init_with_owner(&mut instance, Self::env().caller());

            instance
        }

        #[ink(constructor)]
        pub fn new_with_data(owner: AccountId, data: UserData) -> Self {
            let mut instance = Self::default();

            ownable::Internal::_init_with_owner(&mut instance, owner);

            UserImpl::set_user_data(&mut instance, data).unwrap();

            instance
        }
    }

    impl ownable::InternalImpl for Contract {}

    impl ownable::Internal for Contract {
        fn _emit_ownership_transferred_event(&self, _previous: Option<AccountId>, _new: Option<AccountId>) {}

        fn _init_with_owner(&mut self, owner: AccountId) {
            ownable::InternalImpl::_init_with_owner(self, owner)
        }
    }

    impl OwnableImpl for Contract {}

    impl Ownable for Contract {
        #[ink(message)]
        fn owner(&self) -> Option<AccountId> {
            OwnableImpl::owner(self)
        }

        #[ink(message)]
        fn renounce_ownership(&mut self) -> Result<(), OwnableError> {
            panic!("Renounce ownership is not allowed for this contract")
        }

        #[ink(message)]
        fn transfer_ownership(&mut self, _new_owner: AccountId) -> Result<(), OwnableError> {
            panic!("Transfer ownership is not allowed for this contract")
        }
    }

    impl UserImpl for Contract {}

    impl User for Contract {
        #[ink(message)]
        fn get_user_data(&self) -> UserData {
            UserImpl::get_user_data(self)
        }

        #[ink(message)]
        fn set_user_data(&mut self, user_data: UserData) -> ProjectResult<()> {
            UserImpl::set_user_data(self, user_data)
        }
    }

    impl UserEvents for Contract {
        fn emit_user_data_set(&self, user_data: UserData) {
            <EnvAccess<'_, DefaultEnvironment> as EmitEvent<Self>>::emit_event::<UserDataSet>(
                self.env(),
                UserDataSet { user_data },
            );
        }
    }
}

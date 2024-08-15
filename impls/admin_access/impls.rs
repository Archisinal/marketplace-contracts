/// SPDX-License-Identifier: MIT
use crate::impls::shared::consts::ADMIN;
use crate::traits::events::admin_access::AdminAccessEvents;
use crate::traits::{ArchisinalError, ProjectResult};
use ink::primitives::AccountId;
use openbrush::contracts::access_control::AccessControl;
use openbrush::contracts::ownable;
use openbrush::contracts::ownable::Ownable;
use openbrush::traits::Storage;

/// The admin access implementation.
///
/// # Note
///
/// See `crate::traits::AdminAccess` for more information.
pub trait AdminAccessImpl:
    AccessControl + Ownable + AdminAccessEvents + Storage<ownable::Data> + Sized
{
    #[openbrush::modifiers(ownable::only_owner)]
    fn add_admin(&mut self, account_id: AccountId) -> ProjectResult<()> {
        // Emit the event for the admin added
        self.emit_admin_added(Self::env().caller(), account_id);

        // Grant the admin role in the access control trait
        AccessControl::grant_role(self, ADMIN, Some(account_id))
            .map_err(|_| ArchisinalError::AdminAccessError)
    }

    #[openbrush::modifiers(ownable::only_owner)]
    fn remove_admin(&mut self, account_id: AccountId) -> ProjectResult<()> {
        // Emit the event for the admin removed
        self.emit_admin_removed(Self::env().caller(), account_id);

        // Revoke the admin role in the access control trait
        AccessControl::revoke_role(self, ADMIN, Some(account_id))
            .map_err(|_| ArchisinalError::AdminAccessError)
    }

    fn is_admin(&self, account_id: AccountId) -> bool {
        AccessControl::has_role(self, ADMIN, Some(account_id))
    }

    fn _admin_or_owner(&self) -> ProjectResult<()> {
        let caller = Self::env().caller();

        // Check if the caller is an admin or the owner
        if !self.is_admin(caller) && self.owner() != Some(caller) {
            return Err(ArchisinalError::AdminAccessError);
        }

        Ok(())
    }
}

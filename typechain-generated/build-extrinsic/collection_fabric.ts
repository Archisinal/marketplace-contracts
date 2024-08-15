/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { GasLimit, GasLimitAndRequiredValue } from '@archisinal/typechain-types';
import { buildSubmittableExtrinsic } from '@archisinal/typechain-types';
import type * as ArgumentTypes from '../types-arguments/collection_fabric';
import type BN from 'bn.js';
import type { ApiPromise } from '@polkadot/api';



export default class Methods {
	readonly __nativeContract : ContractPromise;
	readonly __apiPromise: ApiPromise;

	constructor(
		nativeContract : ContractPromise,
		apiPromise: ApiPromise,
	) {
		this.__nativeContract = nativeContract;
		this.__apiPromise = apiPromise;
	}
	/**
	 * collection
	 *
	 * @param { (string | number | BN) } index,
	*/
	"collection" (
		index: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "collectionFabric::collection", [index], __options);
	}

	/**
	 * isBanned
	 *
	 * @param { ArgumentTypes.AccountId } collection,
	*/
	"isBanned" (
		collection: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "collectionFabric::isBanned", [collection], __options);
	}

	/**
	 * setWhitelistEnabled
	 *
	 * @param { boolean } enabled,
	*/
	"setWhitelistEnabled" (
		enabled: boolean,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "collectionFabric::setWhitelistEnabled", [enabled], __options);
	}

	/**
	 * collectionCount
	 *
	*/
	"collectionCount" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "collectionFabric::collectionCount", [], __options);
	}

	/**
	 * isWhitelistEnabled
	 *
	*/
	"isWhitelistEnabled" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "collectionFabric::isWhitelistEnabled", [], __options);
	}

	/**
	 * isWhitelisted
	 *
	 * @param { ArgumentTypes.AccountId } collection,
	*/
	"isWhitelisted" (
		collection: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "collectionFabric::isWhitelisted", [collection], __options);
	}

	/**
	 * banCollection
	 *
	 * @param { ArgumentTypes.AccountId } collection,
	*/
	"banCollection" (
		collection: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "collectionFabric::banCollection", [collection], __options);
	}

	/**
	 * unbanCollection
	 *
	 * @param { ArgumentTypes.AccountId } collection,
	*/
	"unbanCollection" (
		collection: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "collectionFabric::unbanCollection", [collection], __options);
	}

	/**
	 * isCodehashBanned
	 *
	 * @param { ArgumentTypes.Hash } codeHash,
	*/
	"isCodehashBanned" (
		codeHash: ArgumentTypes.Hash,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "collectionFabric::isCodehashBanned", [codeHash], __options);
	}

	/**
	 * banCodehash
	 *
	 * @param { ArgumentTypes.Hash } codeHash,
	*/
	"banCodehash" (
		codeHash: ArgumentTypes.Hash,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "collectionFabric::banCodehash", [codeHash], __options);
	}

	/**
	 * whitelistCollection
	 *
	 * @param { ArgumentTypes.AccountId } collection,
	*/
	"whitelistCollection" (
		collection: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "collectionFabric::whitelistCollection", [collection], __options);
	}

	/**
	 * instantiateCollection
	 *
	 * @param { ArgumentTypes.CollectionInfo } collectionInfo,
	 * @param { ArgumentTypes.Hash } codeHash,
	*/
	"instantiateCollection" (
		collectionInfo: ArgumentTypes.CollectionInfo,
		codeHash: ArgumentTypes.Hash,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "collectionFabric::instantiateCollection", [collectionInfo, codeHash], __options);
	}

	/**
	 * unbanCodehash
	 *
	 * @param { ArgumentTypes.Hash } codeHash,
	*/
	"unbanCodehash" (
		codeHash: ArgumentTypes.Hash,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "collectionFabric::unbanCodehash", [codeHash], __options);
	}

	/**
	 * isCollectionDeployed
	 *
	 * @param { ArgumentTypes.AccountId } collection,
	*/
	"isCollectionDeployed" (
		collection: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "collectionFabric::isCollectionDeployed", [collection], __options);
	}

	/**
	 * removeAdmin
	 *
	 * @param { ArgumentTypes.AccountId } accountId,
	*/
	"removeAdmin" (
		accountId: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "adminAccess::removeAdmin", [accountId], __options);
	}

	/**
	 * addAdmin
	 *
	 * @param { ArgumentTypes.AccountId } accountId,
	*/
	"addAdmin" (
		accountId: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "adminAccess::addAdmin", [accountId], __options);
	}

	/**
	 * isAdmin
	 *
	 * @param { ArgumentTypes.AccountId } accountId,
	*/
	"isAdmin" (
		accountId: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "adminAccess::isAdmin", [accountId], __options);
	}

	/**
	 * owner
	 *
	*/
	"owner" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "ownable::owner", [], __options);
	}

	/**
	 * transferOwnership
	 *
	 * @param { ArgumentTypes.AccountId } newOwner,
	*/
	"transferOwnership" (
		newOwner: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "ownable::transferOwnership", [newOwner], __options);
	}

	/**
	 * renounceOwnership
	 *
	*/
	"renounceOwnership" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "ownable::renounceOwnership", [], __options);
	}

	/**
	 * revokeRole
	 *
	 * @param { (number | string | BN) } role,
	 * @param { ArgumentTypes.AccountId | null } account,
	*/
	"revokeRole" (
		role: (number | string | BN),
		account: ArgumentTypes.AccountId | null,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "accessControl::revokeRole", [role, account], __options);
	}

	/**
	 * renounceRole
	 *
	 * @param { (number | string | BN) } role,
	 * @param { ArgumentTypes.AccountId | null } account,
	*/
	"renounceRole" (
		role: (number | string | BN),
		account: ArgumentTypes.AccountId | null,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "accessControl::renounceRole", [role, account], __options);
	}

	/**
	 * grantRole
	 *
	 * @param { (number | string | BN) } role,
	 * @param { ArgumentTypes.AccountId | null } account,
	*/
	"grantRole" (
		role: (number | string | BN),
		account: ArgumentTypes.AccountId | null,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "accessControl::grantRole", [role, account], __options);
	}

	/**
	 * hasRole
	 *
	 * @param { (number | string | BN) } role,
	 * @param { ArgumentTypes.AccountId | null } address,
	*/
	"hasRole" (
		role: (number | string | BN),
		address: ArgumentTypes.AccountId | null,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "accessControl::hasRole", [role, address], __options);
	}

	/**
	 * getRoleAdmin
	 *
	 * @param { (number | string | BN) } role,
	*/
	"getRoleAdmin" (
		role: (number | string | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "accessControl::getRoleAdmin", [role], __options);
	}

	/**
	 * setCodeHash
	 *
	 * @param { ArgumentTypes.Hash } newCodeHash,
	*/
	"setCodeHash" (
		newCodeHash: ArgumentTypes.Hash,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "upgradeable::setCodeHash", [newCodeHash], __options);
	}

}
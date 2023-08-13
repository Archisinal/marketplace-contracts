/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { GasLimit, GasLimitAndRequiredValue } from '@727-ventures/typechain-types';
import { buildSubmittableExtrinsic } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/marketplace';
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
	 * buyNft
	 *
	 * @param { (string | number | BN) } listingId,
	*/
	"buyNft" (
		listingId: (string | number | BN),
		__options: GasLimitAndRequiredValue,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "marketplace::buyNft", [listingId], __options);
	}

	/**
	 * cancelListing
	 *
	 * @param { (string | number | BN) } listingId,
	*/
	"cancelListing" (
		listingId: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "marketplace::cancelListing", [listingId], __options);
	}

	/**
	 * getListingCount
	 *
	*/
	"getListingCount" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "marketplace::getListingCount", [], __options);
	}

	/**
	 * getListingByIndex
	 *
	 * @param { (string | number | BN) } index,
	*/
	"getListingByIndex" (
		index: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "marketplace::getListingByIndex", [index], __options);
	}

	/**
	 * buyBatch
	 *
	 * @param { Array<(string | number | BN)> } ids,
	*/
	"buyBatch" (
		ids: Array<(string | number | BN)>,
		__options: GasLimitAndRequiredValue,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "marketplace::buyBatch", [ids], __options);
	}

	/**
	 * listNftForSale
	 *
	 * @param { ArgumentTypes.AccountId } creator,
	 * @param { ArgumentTypes.AccountId } collection,
	 * @param { ArgumentTypes.Id } tokenId,
	 * @param { (string | number | BN) } price,
	 * @param { ArgumentTypes.Currency } currency,
	*/
	"listNftForSale" (
		creator: ArgumentTypes.AccountId,
		collection: ArgumentTypes.AccountId,
		tokenId: ArgumentTypes.Id,
		price: (string | number | BN),
		currency: ArgumentTypes.Currency,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "marketplace::listNftForSale", [creator, collection, tokenId, price, currency], __options);
	}

	/**
	 * cancelAuction
	 *
	 * @param { (string | number | BN) } auctionId,
	*/
	"cancelAuction" (
		auctionId: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "auction::cancelAuction", [auctionId], __options);
	}

	/**
	 * bidNft
	 *
	 * @param { (string | number | BN) } auctionId,
	 * @param { (string | number | BN) } price,
	*/
	"bidNft" (
		auctionId: (string | number | BN),
		price: (string | number | BN),
		__options: GasLimitAndRequiredValue,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "auction::bidNft", [auctionId, price], __options);
	}

	/**
	 * getAuctionCount
	 *
	*/
	"getAuctionCount" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "auction::getAuctionCount", [], __options);
	}

	/**
	 * claimNft
	 *
	 * @param { (string | number | BN) } auctionId,
	*/
	"claimNft" (
		auctionId: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "auction::claimNft", [auctionId], __options);
	}

	/**
	 * startAuction
	 *
	 * @param { (string | number | BN) } auctionId,
	*/
	"startAuction" (
		auctionId: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "auction::startAuction", [auctionId], __options);
	}

	/**
	 * listNftForAuction
	 *
	 * @param { ArgumentTypes.AccountId } creator,
	 * @param { ArgumentTypes.AccountId } collection,
	 * @param { ArgumentTypes.Id } tokenId,
	 * @param { (string | number | BN) } startPrice,
	 * @param { (string | number | BN) } minBidStep,
	 * @param { ArgumentTypes.Currency } currency,
	 * @param { (number | string | BN) } startTime,
	 * @param { (number | string | BN) } endTime,
	*/
	"listNftForAuction" (
		creator: ArgumentTypes.AccountId,
		collection: ArgumentTypes.AccountId,
		tokenId: ArgumentTypes.Id,
		startPrice: (string | number | BN),
		minBidStep: (string | number | BN),
		currency: ArgumentTypes.Currency,
		startTime: (number | string | BN),
		endTime: (number | string | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "auction::listNftForAuction", [creator, collection, tokenId, startPrice, minBidStep, currency, startTime, endTime], __options);
	}

	/**
	 * getAuctionByIndex
	 *
	 * @param { (string | number | BN) } index,
	*/
	"getAuctionByIndex" (
		index: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "auction::getAuctionByIndex", [index], __options);
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
	 * owner
	 *
	*/
	"owner" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "ownable::owner", [], __options);
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
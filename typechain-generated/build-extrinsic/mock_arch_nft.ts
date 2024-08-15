/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { GasLimit, GasLimitAndRequiredValue } from '@archisinal/typechain-types';
import { buildSubmittableExtrinsic } from '@archisinal/typechain-types';
import type * as ArgumentTypes from '../types-arguments/mock_arch_nft';
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
	 * balanceOf
	 *
	 * @param { ArgumentTypes.AccountId } owner,
	*/
	"balanceOf" (
		owner: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "balanceOf", [owner], __options);
	}

	/**
	 * ownerOf
	 *
	 * @param { (number | string | BN) } id,
	*/
	"ownerOf" (
		id: (number | string | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "ownerOf", [id], __options);
	}

	/**
	 * getApproved
	 *
	 * @param { (number | string | BN) } id,
	*/
	"getApproved" (
		id: (number | string | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "getApproved", [id], __options);
	}

	/**
	 * isApprovedForAll
	 *
	 * @param { ArgumentTypes.AccountId } owner,
	 * @param { ArgumentTypes.AccountId } operator,
	*/
	"isApprovedForAll" (
		owner: ArgumentTypes.AccountId,
		operator: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "isApprovedForAll", [owner, operator], __options);
	}

	/**
	 * setApprovalForAll
	 *
	 * @param { ArgumentTypes.AccountId } to,
	 * @param { boolean } approved,
	*/
	"setApprovalForAll" (
		to: ArgumentTypes.AccountId,
		approved: boolean,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "setApprovalForAll", [to, approved], __options);
	}

	/**
	 * approve
	 *
	 * @param { ArgumentTypes.AccountId } to,
	 * @param { (number | string | BN) } id,
	*/
	"approve" (
		to: ArgumentTypes.AccountId,
		id: (number | string | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "approve", [to, id], __options);
	}

	/**
	 * transfer
	 *
	 * @param { ArgumentTypes.AccountId } destination,
	 * @param { (number | string | BN) } id,
	*/
	"transfer" (
		destination: ArgumentTypes.AccountId,
		id: (number | string | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "transfer", [destination, id], __options);
	}

	/**
	 * transferFrom
	 *
	 * @param { ArgumentTypes.AccountId } from,
	 * @param { ArgumentTypes.AccountId } to,
	 * @param { (number | string | BN) } id,
	*/
	"transferFrom" (
		from: ArgumentTypes.AccountId,
		to: ArgumentTypes.AccountId,
		id: (number | string | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "transferFrom", [from, to, id], __options);
	}

	/**
	 * mint
	 *
	 * @param { (number | string | BN) } id,
	*/
	"mint" (
		id: (number | string | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "mint", [id], __options);
	}

	/**
	 * burn
	 *
	 * @param { (number | string | BN) } id,
	*/
	"burn" (
		id: (number | string | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "burn", [id], __options);
	}

}
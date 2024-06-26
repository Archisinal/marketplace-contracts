/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { ApiPromise } from '@polkadot/api';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { GasLimit, GasLimitAndRequiredValue, Result, ExternalSigner } from '@archisinal/typechain-types';
import type { QueryReturnType } from '@archisinal/typechain-types';
import { queryOkJSON, queryJSON, handleReturnType } from '@archisinal/typechain-types';
import { txSignAndSend } from '@archisinal/typechain-types';
import type * as ArgumentTypes from '../types-arguments/arch_nft';
import type * as ReturnTypes from '../types-returns/arch_nft';
import type BN from 'bn.js';
//@ts-ignore
import {ReturnNumber} from '@archisinal/typechain-types';
import {getTypeDescription} from './../shared/utils';
// @ts-ignore
import type {EventRecord} from "@polkadot/api/submittable";
import {decodeEvents} from "../shared/utils";
import DATA_TYPE_DESCRIPTIONS from '../data/arch_nft.json';
import EVENT_DATA_TYPE_DESCRIPTIONS from '../event-data/arch_nft.json';


export default class Methods {
	readonly __nativeContract : ContractPromise;
	readonly __keyringPair : KeyringPair | ExternalSigner;
	readonly __callerAddress : string;
	readonly __apiPromise: ApiPromise;

	constructor(
		apiPromise : ApiPromise,
		nativeContract : ContractPromise,
		keyringPair : KeyringPair | ExternalSigner,
	) {
		this.__apiPromise = apiPromise;
		this.__nativeContract = nativeContract;
		this.__keyringPair = keyringPair;
		this.__callerAddress = keyringPair.address;
	}

	/**
	* setCollectionAdditionalInfo
	*
	* @param { string } additionalInfo,
	* @returns { void }
	*/
	"setCollectionAdditionalInfo" (
		additionalInfo: string,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "collection::setCollectionAdditionalInfo", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [additionalInfo], __options);
	}

	/**
	* collectionAdditionalInfo
	*
	* @returns { Result<string | null, ReturnTypes.LangError> }
	*/
	"collectionAdditionalInfo" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<string | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "collection::collectionAdditionalInfo", [], __options, (result) => { return handleReturnType(result, getTypeDescription(18, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* collectionUri
	*
	* @returns { Result<string | null, ReturnTypes.LangError> }
	*/
	"collectionUri" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<string | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "collection::collectionUri", [], __options, (result) => { return handleReturnType(result, getTypeDescription(18, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* setCollectionUri
	*
	* @param { string } uri,
	* @returns { void }
	*/
	"setCollectionUri" (
		uri: string,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "collection::setCollectionUri", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [uri], __options);
	}

	/**
	* getNftMetadata
	*
	* @param { ArgumentTypes.Id } id,
	* @returns { Result<ReturnTypes.NftMetadata | null, ReturnTypes.LangError> }
	*/
	"getNftMetadata" (
		id: ArgumentTypes.Id,
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnTypes.NftMetadata | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "collection::getNftMetadata", [id], __options, (result) => { return handleReturnType(result, getTypeDescription(23, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* mintWithMetadata
	*
	* @param { ArgumentTypes.AccountId } to,
	* @param { ArgumentTypes.Id } id,
	* @param { ArgumentTypes.NftMetadata } metadata,
	* @returns { void }
	*/
	"mintWithMetadata" (
		to: ArgumentTypes.AccountId,
		id: ArgumentTypes.Id,
		metadata: ArgumentTypes.NftMetadata,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "collection::mintWithMetadata", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [to, id, metadata], __options);
	}

	/**
	* setCollectionName
	*
	* @param { string } name,
	* @returns { void }
	*/
	"setCollectionName" (
		name: string,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "collection::setCollectionName", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [name], __options);
	}

	/**
	* collectionRoyalty
	*
	* @returns { Result<number, ReturnTypes.LangError> }
	*/
	"collectionRoyalty" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<number, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "collection::collectionRoyalty", [], __options, (result) => { return handleReturnType(result, getTypeDescription(26, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* collectionName
	*
	* @returns { Result<string | null, ReturnTypes.LangError> }
	*/
	"collectionName" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<string | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "collection::collectionName", [], __options, (result) => { return handleReturnType(result, getTypeDescription(18, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* updateNftMetadata
	*
	* @param { ArgumentTypes.Id } id,
	* @param { ArgumentTypes.NftMetadata } metadata,
	* @returns { void }
	*/
	"updateNftMetadata" (
		id: ArgumentTypes.Id,
		metadata: ArgumentTypes.NftMetadata,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "collection::updateNftMetadata", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [id, metadata], __options);
	}

	/**
	* renounceOwnership
	*
	* @returns { void }
	*/
	"renounceOwnership" (
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "ownable::renounceOwnership", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* transferOwnership
	*
	* @param { ArgumentTypes.AccountId } newOwner,
	* @returns { void }
	*/
	"transferOwnership" (
		newOwner: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "ownable::transferOwnership", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [newOwner], __options);
	}

	/**
	* owner
	*
	* @returns { Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> }
	*/
	"owner" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "ownable::owner", [], __options, (result) => { return handleReturnType(result, getTypeDescription(29, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* transfer
	*
	* @param { ArgumentTypes.AccountId } to,
	* @param { ArgumentTypes.Id } id,
	* @param { Array<(number | string | BN)> } data,
	* @returns { void }
	*/
	"transfer" (
		to: ArgumentTypes.AccountId,
		id: ArgumentTypes.Id,
		data: Array<(number | string | BN)>,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "psp34::transfer", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [to, id, data], __options);
	}

	/**
	* ownerOf
	*
	* @param { ArgumentTypes.Id } id,
	* @returns { Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> }
	*/
	"ownerOf" (
		id: ArgumentTypes.Id,
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp34::ownerOf", [id], __options, (result) => { return handleReturnType(result, getTypeDescription(29, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* totalSupply
	*
	* @returns { Result<ReturnNumber, ReturnTypes.LangError> }
	*/
	"totalSupply" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnNumber, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp34::totalSupply", [], __options, (result) => { return handleReturnType(result, getTypeDescription(33, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* balanceOf
	*
	* @param { ArgumentTypes.AccountId } owner,
	* @returns { Result<number, ReturnTypes.LangError> }
	*/
	"balanceOf" (
		owner: ArgumentTypes.AccountId,
		__options: GasLimit,
	): Promise< QueryReturnType< Result<number, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp34::balanceOf", [owner], __options, (result) => { return handleReturnType(result, getTypeDescription(26, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* collectionId
	*
	* @returns { Result<ReturnTypes.Id, ReturnTypes.LangError> }
	*/
	"collectionId" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnTypes.Id, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp34::collectionId", [], __options, (result) => { return handleReturnType(result, getTypeDescription(34, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* allowance
	*
	* @param { ArgumentTypes.AccountId } owner,
	* @param { ArgumentTypes.AccountId } operator,
	* @param { ArgumentTypes.Id | null } id,
	* @returns { Result<boolean, ReturnTypes.LangError> }
	*/
	"allowance" (
		owner: ArgumentTypes.AccountId,
		operator: ArgumentTypes.AccountId,
		id: ArgumentTypes.Id | null,
		__options: GasLimit,
	): Promise< QueryReturnType< Result<boolean, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp34::allowance", [owner, operator, id], __options, (result) => { return handleReturnType(result, getTypeDescription(36, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* approve
	*
	* @param { ArgumentTypes.AccountId } operator,
	* @param { ArgumentTypes.Id | null } id,
	* @param { boolean } approved,
	* @returns { void }
	*/
	"approve" (
		operator: ArgumentTypes.AccountId,
		id: ArgumentTypes.Id | null,
		approved: boolean,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "psp34::approve", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [operator, id, approved], __options);
	}

	/**
	* mint
	*
	* @param { ArgumentTypes.AccountId } account,
	* @param { ArgumentTypes.Id } id,
	* @returns { void }
	*/
	"mint" (
		account: ArgumentTypes.AccountId,
		id: ArgumentTypes.Id,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "psp34Mintable::mint", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [account, id], __options);
	}

	/**
	* burn
	*
	* @param { ArgumentTypes.AccountId } account,
	* @param { ArgumentTypes.Id } id,
	* @returns { void }
	*/
	"burn" (
		account: ArgumentTypes.AccountId,
		id: ArgumentTypes.Id,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "psp34Burnable::burn", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [account, id], __options);
	}

	/**
	* setCodeHash
	*
	* @param { ArgumentTypes.Hash } newCodeHash,
	* @returns { void }
	*/
	"setCodeHash" (
		newCodeHash: ArgumentTypes.Hash,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "upgradeable::setCodeHash", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [newCodeHash], __options);
	}

}
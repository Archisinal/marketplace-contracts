import type BN from 'bn.js';

export type AccountId = string | number[]

export enum LangError {
	couldNotReadInput = 'CouldNotReadInput'
}

export enum Error {
	notOwner = 'NotOwner',
	notApproved = 'NotApproved',
	tokenExists = 'TokenExists',
	tokenNotFound = 'TokenNotFound',
	cannotInsert = 'CannotInsert',
	cannotFetchValue = 'CannotFetchValue',
	notAllowed = 'NotAllowed'
}


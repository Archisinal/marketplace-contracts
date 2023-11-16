"use strict";
/* This file is auto-generated */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typechain_types_1 = require("@727-ventures/typechain-types");
const typechain_types_2 = require("@727-ventures/typechain-types");
const utils_1 = require("./../shared/utils");
const utils_2 = require("../shared/utils");
const marketplace_json_1 = __importDefault(require("../data/marketplace.json"));
const marketplace_json_2 = __importDefault(require("../event-data/marketplace.json"));
class Methods {
    constructor(apiPromise, nativeContract, keyringPair) {
        this.__apiPromise = apiPromise;
        this.__nativeContract = nativeContract;
        this.__keyringPair = keyringPair;
        this.__callerAddress = keyringPair.address;
    }
    /**
    * getListingCount
    *
    * @returns { Result<ReturnNumber, ReturnTypes.LangError> }
    */
    "getListingCount"(__options) {
        return (0, typechain_types_1.queryOkJSON)(this.__apiPromise, this.__nativeContract, this.__callerAddress, "marketplace::getListingCount", [], __options, (result) => { return (0, typechain_types_1.handleReturnType)(result, (0, utils_1.getTypeDescription)(11, marketplace_json_1.default)); });
    }
    /**
    * getListingByIndex
    *
    * @param { (string | number | BN) } index,
    * @returns { Result<ReturnTypes.Listing | null, ReturnTypes.LangError> }
    */
    "getListingByIndex"(index, __options) {
        return (0, typechain_types_1.queryOkJSON)(this.__apiPromise, this.__nativeContract, this.__callerAddress, "marketplace::getListingByIndex", [index], __options, (result) => { return (0, typechain_types_1.handleReturnType)(result, (0, utils_1.getTypeDescription)(12, marketplace_json_1.default)); });
    }
    /**
    * cancelListing
    *
    * @param { (string | number | BN) } listingId,
    * @returns { void }
    */
    "cancelListing"(listingId, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "marketplace::cancelListing", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [listingId], __options);
    }
    /**
    * buyNft
    *
    * @param { (string | number | BN) } listingId,
    * @returns { void }
    */
    "buyNft"(listingId, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "marketplace::buyNft", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [listingId], __options);
    }
    /**
    * buyBatch
    *
    * @param { Array<(string | number | BN)> } ids,
    * @returns { void }
    */
    "buyBatch"(ids, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "marketplace::buyBatch", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [ids], __options);
    }
    /**
    * listNftForSale
    *
    * @param { ArgumentTypes.AccountId } creator,
    * @param { ArgumentTypes.AccountId } collection,
    * @param { ArgumentTypes.Id } tokenId,
    * @param { (string | number | BN) } price,
    * @param { ArgumentTypes.Currency } currency,
    * @returns { void }
    */
    "listNftForSale"(creator, collection, tokenId, price, currency, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "marketplace::listNftForSale", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [creator, collection, tokenId, price, currency], __options);
    }
    /**
    * startAuction
    *
    * @param { (string | number | BN) } auctionId,
    * @returns { void }
    */
    "startAuction"(auctionId, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "auction::startAuction", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [auctionId], __options);
    }
    /**
    * listNftForAuction
    *
    * @param { ArgumentTypes.AuctionInfo } auctionInfo,
    * @returns { void }
    */
    "listNftForAuction"(auctionInfo, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "auction::listNftForAuction", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [auctionInfo], __options);
    }
    /**
    * getAuctionByIndex
    *
    * @param { (string | number | BN) } index,
    * @returns { Result<ReturnTypes.Auction | null, ReturnTypes.LangError> }
    */
    "getAuctionByIndex"(index, __options) {
        return (0, typechain_types_1.queryOkJSON)(this.__apiPromise, this.__nativeContract, this.__callerAddress, "auction::getAuctionByIndex", [index], __options, (result) => { return (0, typechain_types_1.handleReturnType)(result, (0, utils_1.getTypeDescription)(30, marketplace_json_1.default)); });
    }
    /**
    * getAuctionCount
    *
    * @returns { Result<ReturnNumber, ReturnTypes.LangError> }
    */
    "getAuctionCount"(__options) {
        return (0, typechain_types_1.queryOkJSON)(this.__apiPromise, this.__nativeContract, this.__callerAddress, "auction::getAuctionCount", [], __options, (result) => { return (0, typechain_types_1.handleReturnType)(result, (0, utils_1.getTypeDescription)(11, marketplace_json_1.default)); });
    }
    /**
    * cancelAuction
    *
    * @param { (string | number | BN) } auctionId,
    * @returns { void }
    */
    "cancelAuction"(auctionId, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "auction::cancelAuction", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [auctionId], __options);
    }
    /**
    * bidNft
    *
    * @param { (string | number | BN) } auctionId,
    * @param { (string | number | BN) } price,
    * @returns { void }
    */
    "bidNft"(auctionId, price, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "auction::bidNft", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [auctionId, price], __options);
    }
    /**
    * claimNft
    *
    * @param { (string | number | BN) } auctionId,
    * @returns { void }
    */
    "claimNft"(auctionId, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "auction::claimNft", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [auctionId], __options);
    }
    /**
    * isAdmin
    *
    * @param { ArgumentTypes.AccountId } accountId,
    * @returns { Result<boolean, ReturnTypes.LangError> }
    */
    "isAdmin"(accountId, __options) {
        return (0, typechain_types_1.queryOkJSON)(this.__apiPromise, this.__nativeContract, this.__callerAddress, "adminAccess::isAdmin", [accountId], __options, (result) => { return (0, typechain_types_1.handleReturnType)(result, (0, utils_1.getTypeDescription)(35, marketplace_json_1.default)); });
    }
    /**
    * addAdmin
    *
    * @param { ArgumentTypes.AccountId } accountId,
    * @returns { void }
    */
    "addAdmin"(accountId, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "adminAccess::addAdmin", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [accountId], __options);
    }
    /**
    * removeAdmin
    *
    * @param { ArgumentTypes.AccountId } accountId,
    * @returns { void }
    */
    "removeAdmin"(accountId, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "adminAccess::removeAdmin", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [accountId], __options);
    }
    /**
    * timestamp
    *
    * @returns { Result<number, ReturnTypes.LangError> }
    */
    "timestamp"(__options) {
        return (0, typechain_types_1.queryOkJSON)(this.__apiPromise, this.__nativeContract, this.__callerAddress, "timestampProvider::timestamp", [], __options, (result) => { return (0, typechain_types_1.handleReturnType)(result, (0, utils_1.getTypeDescription)(37, marketplace_json_1.default)); });
    }
    /**
    * owner
    *
    * @returns { Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> }
    */
    "owner"(__options) {
        return (0, typechain_types_1.queryOkJSON)(this.__apiPromise, this.__nativeContract, this.__callerAddress, "ownable::owner", [], __options, (result) => { return (0, typechain_types_1.handleReturnType)(result, (0, utils_1.getTypeDescription)(38, marketplace_json_1.default)); });
    }
    /**
    * renounceOwnership
    *
    * @returns { void }
    */
    "renounceOwnership"(__options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "ownable::renounceOwnership", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [], __options);
    }
    /**
    * transferOwnership
    *
    * @param { ArgumentTypes.AccountId } newOwner,
    * @returns { void }
    */
    "transferOwnership"(newOwner, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "ownable::transferOwnership", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [newOwner], __options);
    }
    /**
    * getRoleAdmin
    *
    * @param { (number | string | BN) } role,
    * @returns { Result<number, ReturnTypes.LangError> }
    */
    "getRoleAdmin"(role, __options) {
        return (0, typechain_types_1.queryOkJSON)(this.__apiPromise, this.__nativeContract, this.__callerAddress, "accessControl::getRoleAdmin", [role], __options, (result) => { return (0, typechain_types_1.handleReturnType)(result, (0, utils_1.getTypeDescription)(41, marketplace_json_1.default)); });
    }
    /**
    * hasRole
    *
    * @param { (number | string | BN) } role,
    * @param { ArgumentTypes.AccountId | null } address,
    * @returns { Result<boolean, ReturnTypes.LangError> }
    */
    "hasRole"(role, address, __options) {
        return (0, typechain_types_1.queryOkJSON)(this.__apiPromise, this.__nativeContract, this.__callerAddress, "accessControl::hasRole", [role, address], __options, (result) => { return (0, typechain_types_1.handleReturnType)(result, (0, utils_1.getTypeDescription)(35, marketplace_json_1.default)); });
    }
    /**
    * grantRole
    *
    * @param { (number | string | BN) } role,
    * @param { ArgumentTypes.AccountId | null } account,
    * @returns { void }
    */
    "grantRole"(role, account, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "accessControl::grantRole", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [role, account], __options);
    }
    /**
    * renounceRole
    *
    * @param { (number | string | BN) } role,
    * @param { ArgumentTypes.AccountId | null } account,
    * @returns { void }
    */
    "renounceRole"(role, account, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "accessControl::renounceRole", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [role, account], __options);
    }
    /**
    * revokeRole
    *
    * @param { (number | string | BN) } role,
    * @param { ArgumentTypes.AccountId | null } account,
    * @returns { void }
    */
    "revokeRole"(role, account, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "accessControl::revokeRole", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [role, account], __options);
    }
    /**
    * setCodeHash
    *
    * @param { ArgumentTypes.Hash } newCodeHash,
    * @returns { void }
    */
    "setCodeHash"(newCodeHash, __options) {
        return (0, typechain_types_2.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "upgradeable::setCodeHash", (events) => {
            return (0, utils_2.decodeEvents)(events, this.__nativeContract, marketplace_json_2.default);
        }, [newCodeHash], __options);
    }
}
exports.default = Methods;
//# sourceMappingURL=marketplace.js.map
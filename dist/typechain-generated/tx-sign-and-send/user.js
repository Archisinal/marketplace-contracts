"use strict";
/* This file is auto-generated */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typechain_types_1 = require("@727-ventures/typechain-types");
const utils_1 = require("../shared/utils");
const user_json_1 = __importDefault(require("../event-data/user.json"));
class Methods {
    constructor(apiPromise, nativeContract, keyringPair) {
        this.__apiPromise = apiPromise;
        this.__nativeContract = nativeContract;
        this.__keyringPair = keyringPair;
    }
    /**
    * getUserData
    *
    */
    "getUserData"(__options) {
        return (0, typechain_types_1.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "user::getUserData", (events) => {
            return (0, utils_1.decodeEvents)(events, this.__nativeContract, user_json_1.default);
        }, [], __options);
    }
    /**
    * setUserData
    *
    * @param { ArgumentTypes.UserData } userInfo,
    */
    "setUserData"(userInfo, __options) {
        return (0, typechain_types_1.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "user::setUserData", (events) => {
            return (0, utils_1.decodeEvents)(events, this.__nativeContract, user_json_1.default);
        }, [userInfo], __options);
    }
    /**
    * transferOwnership
    *
    * @param { ArgumentTypes.AccountId } newOwner,
    */
    "transferOwnership"(newOwner, __options) {
        return (0, typechain_types_1.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "ownable::transferOwnership", (events) => {
            return (0, utils_1.decodeEvents)(events, this.__nativeContract, user_json_1.default);
        }, [newOwner], __options);
    }
    /**
    * renounceOwnership
    *
    */
    "renounceOwnership"(__options) {
        return (0, typechain_types_1.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "ownable::renounceOwnership", (events) => {
            return (0, utils_1.decodeEvents)(events, this.__nativeContract, user_json_1.default);
        }, [], __options);
    }
    /**
    * owner
    *
    */
    "owner"(__options) {
        return (0, typechain_types_1.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "ownable::owner", (events) => {
            return (0, utils_1.decodeEvents)(events, this.__nativeContract, user_json_1.default);
        }, [], __options);
    }
    /**
    * setCodeHash
    *
    * @param { ArgumentTypes.Hash } newCodeHash,
    */
    "setCodeHash"(newCodeHash, __options) {
        return (0, typechain_types_1.txSignAndSend)(this.__apiPromise, this.__nativeContract, this.__keyringPair, "upgradeable::setCodeHash", (events) => {
            return (0, utils_1.decodeEvents)(events, this.__nativeContract, user_json_1.default);
        }, [newCodeHash], __options);
    }
}
exports.default = Methods;
//# sourceMappingURL=user.js.map
"use strict";
/* This file is auto-generated */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_contract_1 = require("@polkadot/api-contract");
const api_contract_2 = require("@polkadot/api-contract");
const mock_auction_1 = require("../contract-info/mock_auction");
const mock_auction_2 = __importDefault(require("../query/mock_auction"));
const mock_auction_3 = __importDefault(require("../build-extrinsic/mock_auction"));
const mock_auction_4 = __importDefault(require("../tx-sign-and-send/mock_auction"));
const mock_auction_5 = __importDefault(require("../mixed-methods/mock_auction"));
const mock_auction_6 = __importDefault(require("../events/mock_auction"));
class Contract {
    /**
     * @constructor

     * @param address - The address of the contract.
     * @param signer - The signer to use for signing transactions.
     * @param nativeAPI - The API instance to use for queries.
    */
    constructor(address, signer, nativeAPI) {
        this.address = address;
        this.nativeContract = new api_contract_2.ContractPromise(nativeAPI, mock_auction_1.ContractAbi, address);
        this.nativeAPI = nativeAPI;
        this.signer = signer;
        this.contractAbi = new api_contract_1.Abi(mock_auction_1.ContractAbi);
        this.query = new mock_auction_2.default(this.nativeContract, this.nativeAPI, signer.address);
        this.buildExtrinsic = new mock_auction_3.default(this.nativeContract, this.nativeAPI);
        this.tx = new mock_auction_4.default(nativeAPI, this.nativeContract, signer);
        this.methods = new mock_auction_5.default(nativeAPI, this.nativeContract, signer);
        this.events = new mock_auction_6.default(this.nativeContract, nativeAPI);
    }
    /**
     * name
     *
     * @returns The name of the contract.
    */
    get name() {
        return this.nativeContract.abi.info.contract.name.toString();
    }
    /**
     * abi
     *
     * @returns The abi of the contract.
    */
    get abi() {
        return this.contractAbi;
    }
    /**
     * withSigner
     *
     * @param signer - The signer to use for signing transactions.
     * @returns New instance of the contract class with new signer.
     * @example
     * ```typescript
     * const contract = new Contract(address, signerAlice, api);
     * await contract.mint(signerBob.address, 100);
     * await contract.withSigner(signerBob).transfer(signerAlice.address, 100);
     * ```
    */
    withSigner(signer) {
        return new Contract(this.address, signer, this.nativeAPI);
    }
    /**
    * withAddress
    *
    * @param address - The address of the contract.
    * @returns New instance of the contract class to interact with new contract.
    */
    withAddress(address) {
        return new Contract(address, this.signer, this.nativeAPI);
    }
    /**
     * withAPI
     *
     * @param api - The API instance to use for queries.
     * @returns New instance of the contract class to interact with new API.
    */
    withAPI(api) {
        return new Contract(this.address, this.signer, api);
    }
}
exports.default = Contract;
//# sourceMappingURL=mock_auction.js.map
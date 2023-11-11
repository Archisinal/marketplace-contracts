"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// SPDX-License-Identifier: MIT
require("dotenv/config");
const api_1 = require("@polkadot/api");
const api_singleton_1 = __importDefault(require("../test/shared/api_singleton"));
const account_manager_1 = require("../test/shared/release-setups/account_manager");
const arch_nft_1 = require("../test/shared/release-setups/arch_nft");
const creator_1 = require("../test/shared/release-setups/creator");
const marketplace_1 = require("../test/shared/release-setups/marketplace");
const my_psp22_1 = require("../test/shared/release-setups/my_psp22");
const user_1 = require("../test/shared/release-setups/user");
const signers_1 = require("../test/shared/signers");
async function shibuya() {
    const wsProvider = new api_1.WsProvider('wss://rpc.shibuya.astar.network');
    const api = await api_1.ApiPromise.create({
        provider: wsProvider,
    });
    await api_singleton_1.default.initWithApi(api);
    const mnemonic = process.env.MNEMONIC;
    if (!mnemonic) {
        throw new Error('MNEMONIC env variable is not set');
    }
    signers_1.Signers.setDefaultSigner(mnemonic);
    const psp22 = await (0, my_psp22_1.setupPSP22)();
    // eslint-disable-next-line no-console
    console.log(`PSP22 deployed at ${psp22.address}`);
    const archNft = await (0, arch_nft_1.setupArchNFT)();
    // eslint-disable-next-line no-console
    console.log(`ArchNFT deployed at ${archNft.address}`);
    const user = await (0, user_1.setupUser)();
    // eslint-disable-next-line no-console
    console.log(`User deployed at ${user.address}`);
    const creator = await (0, creator_1.setupCreator)();
    // eslint-disable-next-line no-console
    console.log(`Creator deployed at ${creator.address}`);
    const marketplace = await (0, marketplace_1.setupMarketplace)();
    // eslint-disable-next-line no-console
    console.log(`Marketplace deployed at ${marketplace.address}`);
    const accountManager = await (0, account_manager_1.setupAccountManager)();
    // eslint-disable-next-line no-console
    console.log(`AccountManager deployed at ${accountManager.address}`);
    await api_singleton_1.default.disconnect();
}
shibuya()
    .then(() => process.exit(0))
    .catch((error) => {
    /* eslint-disable no-console */
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=shibuya.js.map
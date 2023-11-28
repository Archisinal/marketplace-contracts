import type { KeyringPair } from "@polkadot/keyring/types";
import type { ApiPromise } from "@polkadot/api";
import { SignAndSendSuccessResponse } from "@727-ventures/typechain-types";
import type { ConstructorOptions } from "@727-ventures/typechain-types";
export default class Constructors {
    readonly nativeAPI: ApiPromise;
    readonly signer: KeyringPair;
    constructor(nativeAPI: ApiPromise, signer: KeyringPair);
    /**
    * new
    *
    */
    "new"(__options?: ConstructorOptions): Promise<{
        result: SignAndSendSuccessResponse;
        address: any;
    }>;
}
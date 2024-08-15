// SPDX-License-Identifier: MIT
import { KeyringPair } from '@polkadot/keyring/types'

import ArchNFTContract from '../../typechain-generated/contracts/arch_nft'
import MockAuctionContract from '../../typechain-generated/contracts/mock_auction'
import PSP22Contract from '../../typechain-generated/contracts/my_psp22'
import {CurrencyBuilder, Id} from '../../typechain-generated/types-arguments/mock_auction'
import { AuctionInfo } from "../../typechain-generated/types-arguments/mock_auction";
import { AuctionStatus } from '../../typechain-generated/types-returns/mock_auction'
import { expect } from './chai'
import { Signers } from './signers'
import {COLLECTION_ROYALTY} from "./test-setups/creator";

export function genTime(currentTime: number, fromStart: number, duration: number): { START_TIME: number; END_TIME: number } {
    const START_TIME = currentTime + fromStart
    const END_TIME = START_TIME + duration

    return { START_TIME, END_TIME }
}

export async function mintAndApprove(
    contract: MockAuctionContract,
    nft: ArchNFTContract,
    tokenId: Id,
    minter: KeyringPair,
): Promise<void> {
    await expect(nft.tx.mint(minter.address, tokenId)).to.eventually.be.fulfilled
    await expect(nft.withSigner(minter).tx.approve(contract.address, tokenId, true)).to.eventually.be.fulfilled
}

export async function mintAndListAuction(
    contract: MockAuctionContract,
    nft: ArchNFTContract,
    psp22: PSP22Contract,
    tokenId: Id,
    price: number,
    minBidStep: number,
    isNative = false,
    duration = 5000,
    fromStart = 3000,
): Promise<{ START_TIME: number; END_TIME: number }> {
    const bob = Signers.Bob

    await mintAndApprove(contract, nft, tokenId, bob)

    const currentTime = (await contract.query.timestamp()).value.unwrapRecursively()

    const { START_TIME, END_TIME } = genTime(currentTime, fromStart, duration)

    const indexBefore = (await contract.query.getAuctionCount()).value.unwrapRecursively().toNumber()

    if (!isNative) {
        await expect(
            contract
                .withSigner(bob)
                .tx.listNftForAuction(
                {
                    creator: bob.address,
                    collection: nft.address,
                    tokenId,
                    startPrice: price,
                    minBidStep,
                    currency: CurrencyBuilder.Custom(psp22.address),
                    startTime: START_TIME,
                    endTime: END_TIME
                } as AuctionInfo
            )
        ).to.eventually.be.fulfilled

        await expect(contract.query.getAuctionByIndex(indexBefore)).to.be.deepReturnValue({
          id: indexBefore,
          creator: Signers.Bob.address,
          collection: nft.address,
          tokenId: tokenId,
          startPrice: price,
          minBidStep: minBidStep,
          currency: CurrencyBuilder.Custom(psp22.address),
          startTime: START_TIME,
          endTime: END_TIME,
          currentPrice: 0,
          currentBidder: null,
          status: AuctionStatus.waitingAuction,
          royalty: COLLECTION_ROYALTY,
        })
    } else {
        await expect(
            contract
                .withSigner(bob)
                .tx.listNftForAuction(
                {
                    creator: bob.address,
                    collection: nft.address,
                    tokenId,
                    startPrice: price,
                    minBidStep,
                    currency: CurrencyBuilder.Native(),
                    startTime: START_TIME,
                    endTime: END_TIME
                }
            ),
        ).to.eventually.be.fulfilled

        await expect(contract.query.getAuctionByIndex(indexBefore)).to.be.deepReturnValue({
          id: indexBefore,
          creator: Signers.Bob.address,
          collection: nft.address,
          tokenId: tokenId,
          startPrice: price,
          minBidStep: minBidStep,
          currency: CurrencyBuilder.Native(),
          startTime: START_TIME,
          endTime: END_TIME,
          currentPrice: 0,
          currentBidder: null,
          status: AuctionStatus.waitingAuction,
          royalty: COLLECTION_ROYALTY,
        })
    }

    await expect(contract.query.getAuctionCount()).to.have.returnNumber(indexBefore + 1)

    return { START_TIME, END_TIME }
}

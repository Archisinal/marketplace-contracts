// SPDX-License-Identifier: MIT
import { after, describe } from 'mocha'

import ArchNFTContract from '../../typechain-generated/contracts/arch_nft'
import MarketplaceContract from '../../typechain-generated/contracts/mock_auction'
import PSP22Contract from '../../typechain-generated/contracts/my_psp22'
import { CurrencyBuilder } from '../../typechain-generated/types-arguments/mock_auction'
import { AuctionStatus } from '../../typechain-generated/types-returns/mock_auction'
import ApiSingleton from '../shared/api_singleton'
import { expect } from '../shared/chai'
import {E2E_PREFIX, TOKEN_ID, TOKEN_ID_1, TOKEN_ID_2, TOKEN_ID_3} from '../shared/consts'
import {mintAndListAuction} from "../shared/mock_auction";
import { Signers } from '../shared/signers'
import { setupArchNFT } from '../shared/test-setups/arch_nft'
import {COLLECTION_ROYALTY} from "../shared/test-setups/creator";
import { setupMockAuction as setup } from '../shared/test-setups/mock_auction'
import { setupPSP22 } from '../shared/test-setups/my_psp22'

describe(E2E_PREFIX + 'Auction', () => {
  let contract: MarketplaceContract
  let nft: ArchNFTContract
  let psp22: PSP22Contract

  beforeEach(async () => {
    contract = await setup()
    nft = await setupArchNFT()
    psp22 = await setupPSP22()
  })

  after(async () => {
    await ApiSingleton.disconnect()
  })

  it('Can create auction', async () => {
    const contract = await setup()
    const nft = await setupArchNFT()
    const psp22 = await setupPSP22()

    await expect(contract.query.getAuctionCount()).to.have.returnNumber(0)

    await mintAndListAuction(contract, nft, psp22, TOKEN_ID, 100, 1)
  })

  describe('Get Auction Count', () => {
    it('should return 0 when no auctions exist', async () => {
      await expect(contract.query.getAuctionCount()).to.have.returnNumber(0)
    })

    it('should correctly count the number of auctions', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1)
      await expect(contract.query.getAuctionCount()).to.have.returnNumber(1)
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_2, 100, 1)
      await expect(contract.query.getAuctionCount()).to.have.returnNumber(2)
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_3, 100, 1)
      await expect(contract.query.getAuctionCount()).to.have.returnNumber(3)
    })
  })

  describe('Get Auction by Index', () => {
    it('should return None when no auctions exist', async () => {
      await expect(contract.query.getAuctionByIndex(0)).to.be.returnValue(null)
    })

    it('should return None when index is out of range', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1)
      await expect(contract.query.getAuctionByIndex(1)).to.be.returnValue(null)
    })

    it('should return an auction when given a valid index', async () => {
      const { START_TIME, END_TIME } = await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1)
      await expect(contract.query.getAuctionByIndex(0)).to.be.deepReturnValue({
        id: 0,
        creator: Signers.Bob.address,
        collection: nft.address,
        tokenId: TOKEN_ID_1,
        startPrice: 100,
        minBidStep: 1,
        currency: CurrencyBuilder.Custom(psp22.address),
        startTime: START_TIME,
        endTime: END_TIME,
        currentPrice: 0,
        currentBidder: null,
        status: AuctionStatus.waitingAuction,
        royalty: COLLECTION_ROYALTY,
      })
    })
  })

  describe('List NFT for Auction', () => {
    it('should list a NFT for auction under normal circumstances', async () => {
      await expect(mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1)).to.eventually.be.fulfilled
    })
  })

  describe('Start Auction', () => {
    it('should start an auction under normal circumstances', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1)

      await contract.tx.addTimestamp(3100)

      await expect(contract.withSigner(Signers.Bob).tx.startAuction(0)).to.eventually.be.fulfilled

      const auction = (await contract.query.getAuctionByIndex(0)).value.unwrapRecursively()

      expect(auction?.status).to.equal(AuctionStatus.inAuction)
    })
  })

  describe('Cancel Auction', () => {
    it('should cancel an auction under normal circumstances', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1)

      await expect(contract.withSigner(Signers.Bob).tx.cancelAuction(0)).to.eventually.be.fulfilled
    })
  })

  describe('Bid NFT', () => {
    it('should bid on an auction under normal circumstances', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1, false, 100000000, 1000)

      await contract.tx.addTimestamp(1100);

      await expect(contract.withSigner(Signers.Bob).tx.startAuction(0)).to.eventually.be.fulfilled

      await expect(psp22.withSigner(Signers.Alice).tx.approve(contract.address, 100)).to.eventually.be.fulfilled

      await expect(contract.withSigner(Signers.Alice).tx.bidNft(0, 100)).to.eventually.be.fulfilled
    })

    it('should bid twice', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1, false, 100000000, 1000)

      await contract.tx.addTimestamp(1100);

      await expect(contract.withSigner(Signers.Bob).tx.startAuction(0)).to.eventually.be.fulfilled

      await expect(psp22.withSigner(Signers.Alice).tx.approve(contract.address, 100)).to.eventually.be.fulfilled
      await expect(contract.withSigner(Signers.Alice).tx.bidNft(0, 100)).to.eventually.be.fulfilled

      await expect(psp22.withSigner(Signers.Charlie).tx.approve(contract.address, 101)).to.eventually.be.fulfilled
      await expect(contract.withSigner(Signers.Charlie).tx.bidNft(0, 101)).to.eventually.be.fulfilled
    })
  })

  describe('Claim NFT', () => {
    it('should claim a NFT from an auction under normal circumstances', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1, false, 300, 100)

      await contract.tx.addTimestamp(110);

      await expect(contract.withSigner(Signers.Bob).tx.startAuction(0)).to.eventually.be.fulfilled

      const balanceBefore = (await psp22.query.balanceOf(Signers.Alice.address)).value.unwrapRecursively().toNumber()

      await psp22.withSigner(Signers.Alice).tx.approve(contract.address, 200)

      await expect(contract.withSigner(Signers.Alice).tx.bidNft(0, 100)).to.eventually.be.fulfilled

      await contract.tx.addTimestamp(310);

      await expect(contract.withSigner(Signers.Alice).tx.claimNft(0)).to.eventually.be.fulfilled

      await expect(psp22.query.balanceOf(Signers.Alice.address)).to.have.returnNumber(balanceBefore - 100);
      await expect(nft.withSigner(Signers.Alice).query.ownerOf(TOKEN_ID_1)).to.have.returnValue(Signers.Alice.address)

      const auction = (await contract.query.getAuctionByIndex(0)).value.unwrapRecursively()!

      expect(auction.status).to.deep.equal(AuctionStatus.ended)
    })
  })
})

// SPDX-License-Identifier: MIT
import { after, describe } from 'mocha'

import ArchNFTContract from '../../typechain-generated/contracts/arch_nft'
import MockAuctionContract from '../../typechain-generated/contracts/mock_auction'
import PSP22Contract from '../../typechain-generated/contracts/my_psp22'
import {AuctionStatus} from "../../typechain-generated/types-returns/mock_auction";
import ApiSingleton from '../shared/api_singleton'
import { expect } from '../shared/chai'
import {SECURITY_PREFIX, TOKEN_ID_1} from '../shared/consts'
import {mintAndListAuction} from "../shared/mock_auction";
import { Signers } from '../shared/signers'
import { setupArchNFT } from '../shared/test-setups/arch_nft'
import { setupMockAuction as setup } from '../shared/test-setups/mock_auction'
import { setupPSP22 } from '../shared/test-setups/my_psp22'
import { getBalance } from '../shared/marketplace'
import BN from 'bn.js'

describe(SECURITY_PREFIX + 'Auction', () => {
  let contract: MockAuctionContract
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

  describe('Get Auction by Index', () => {
    it('should return None when index is out of range', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1)
      await expect(contract.query.getAuctionByIndex(1)).to.be.returnValue(null)
    })
  })

  describe('List NFT for Auction', () => {
    it('should return an error if auction price is zero', async () => {
      await expect(mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 0, 1)).to.eventually.be.rejected
    })

    it('should return an error if the min bid step is zero', async () => {
      await expect(mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 0)).to.eventually.be.rejected
    })

    it('should return an error if the end time is before the start time', async () => {
      await expect(mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1, false, -5000, 5000)).to.eventually.be
        .rejected
    })
  })

  describe('Start Auction', () => {
    it('should return an error when the auction was not found', async () => {
      await expect(contract.withSigner(Signers.Bob).tx.startAuction(0)).to.eventually.be.rejected
    })

    it('should return an error if the auction is not in the waiting state', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1)

      await expect(contract.withSigner(Signers.Bob).tx.cancelAuction(0)).to.eventually.be.fulfilled

      await expect(contract.withSigner(Signers.Bob).tx.startAuction(0)).to.eventually.be.rejected
    })

    it('should return an error if the caller is not the auction creator', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1)

      await expect(contract.withSigner(Signers.Alice).tx.startAuction(0)).to.eventually.be.rejected
    })
  })

  describe('Cancel Auction', () => {
    it('should return an error when the auction was not found', async () => {
      await expect(contract.withSigner(Signers.Bob).tx.cancelAuction(0)).to.eventually.be.rejected
    })

    it('should return an error if the auction is not in the waiting state', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1)

      await contract.tx.addTimestamp(3010)

      await expect(contract.withSigner(Signers.Bob).tx.startAuction(0)).to.eventually.be.fulfilled

      await expect(contract.withSigner(Signers.Bob).tx.cancelAuction(0)).to.eventually.be.rejected
    })

    it('should return an error if the caller is not the auction creator', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1)

      await expect(contract.withSigner(Signers.Alice).tx.cancelAuction(0)).to.eventually.be.rejected
    })
  })

  describe('Bid NFT', () => {
    it('should return an error when the auction was not found', async () => {
      await expect(contract.withSigner(Signers.Bob).tx.bidNft(0, 100)).to.eventually.be.rejected
    })

    it('should return an error if the auction is not in the auction state', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1)

      await expect(contract.withSigner(Signers.Bob).tx.bidNft(0, 100)).to.eventually.be.rejected
    })

    it('should return an error if the bid price is too low', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1)

      await contract.tx.addTimestamp(3010)

      await expect(contract.withSigner(Signers.Bob).tx.startAuction(0)).to.eventually.be.fulfilled

      await expect(contract.withSigner(Signers.Alice).tx.bidNft(0, 99)).to.eventually.be.rejected
    })

    it('should return an error if the caller is the auction creator', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1)

      await contract.tx.addTimestamp(3010)

      await expect(contract.withSigner(Signers.Bob).tx.startAuction(0)).to.eventually.be.fulfilled

      await expect(contract.withSigner(Signers.Bob).tx.bidNft(0, 100)).to.eventually.be.rejected
    })

    it(`can't bid twice with the low bid step`, async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 5, false, 100000000, 1000)

      await contract.tx.addTimestamp(1100)

      await expect(contract.withSigner(Signers.Bob).tx.startAuction(0)).to.eventually.be.fulfilled

      await expect(psp22.withSigner(Signers.Alice).tx.approve(contract.address, 101)).to.eventually.be.fulfilled
      await expect(contract.withSigner(Signers.Alice).tx.bidNft(0, 100)).to.eventually.be.fulfilled

      await expect(psp22.withSigner(Signers.Charlie).tx.approve(contract.address, 102)).to.eventually.be.fulfilled
      await expect(contract.withSigner(Signers.Charlie).tx.bidNft(0, 101)).to.eventually.be.rejected
    })

    it(`can't bid if auction is ended`, async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1, false, 300, 100)

      await contract.tx.addTimestamp(110)

      await expect(contract.withSigner(Signers.Bob).tx.startAuction(0)).to.eventually.be.fulfilled

      await psp22.withSigner(Signers.Alice).tx.approve(contract.address, 101)

      await expect(contract.withSigner(Signers.Alice).tx.bidNft(0, 100)).to.eventually.be.fulfilled

      await contract.tx.addTimestamp(310)

      await expect(contract.withSigner(Signers.Alice).tx.claimNft(0)).to.eventually.be.fulfilled

      await expect(nft.withSigner(Signers.Alice).query.ownerOf(TOKEN_ID_1)).to.have.returnValue(Signers.Alice.address)

      const auction = (await contract.query.getAuctionByIndex(0)).value.unwrapRecursively()!

      expect(auction.status).to.deep.equal(AuctionStatus.ended)

      await psp22.withSigner(Signers.Charlie).tx.approve(contract.address, 105)

      await expect(contract.withSigner(Signers.Charlie).tx.bidNft(0, 101)).to.eventually.be.rejected
    })

    it('should return previous bid if there is a new bid (native funds)', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1, true)

      await contract.tx.addTimestamp(3010)

      await expect(contract.withSigner(Signers.Bob).tx.startAuction(0)).to.eventually.be.fulfilled

      await expect(contract.withSigner(Signers.Charlie).tx.bidNft(0, 100, { value: 100 })).to.eventually.be.fulfilled

      const balanceBefore = await getBalance(Signers.Charlie);

      await expect(contract.withSigner(Signers.Alice).tx.bidNft(0, 101, { value: 101 })).to.eventually.be.fulfilled

      const balanceAfter = await getBalance(Signers.Charlie);

      expect(balanceAfter.toString()).to.be.equal(balanceBefore.add(new BN(100)).toString())
    })
  })

  describe('Claim NFT', () => {
    it('should return an error when the auction was not found', async () => {
      await expect(contract.withSigner(Signers.Bob).tx.claimNft(0)).to.eventually.be.rejected
    })

    it('should return an error if the auction is not in the auction state', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1)

      await expect(contract.withSigner(Signers.Bob).tx.claimNft(0)).to.eventually.be.rejected
    })

    it('should return an error if the auction has not ended', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1, false, 100000000, 100)

      await contract.tx.addTimestamp(110)

      await expect(contract.withSigner(Signers.Bob).tx.startAuction(0)).to.eventually.be.fulfilled

      await expect(contract.withSigner(Signers.Alice).tx.claimNft(0)).to.eventually.be.rejected
    })

    it('should return NFT to the creator if no one bids', async () => {
      await mintAndListAuction(contract, nft, psp22, TOKEN_ID_1, 100, 1, false, 300, 100)

      await contract.tx.addTimestamp(310)

      await expect(contract.withSigner(Signers.Bob).tx.startAuction(0)).to.eventually.be.fulfilled

      await expect(nft.withSigner(Signers.Bob).query.ownerOf(TOKEN_ID_1)).to.have.returnValue(contract.address)

      await contract.tx.addTimestamp(610)

      await expect(contract.withSigner(Signers.Bob).tx.claimNft(0)).to.eventually.be.fulfilled

      await expect(nft.withSigner(Signers.Bob).query.ownerOf(TOKEN_ID_1)).to.have.returnValue(Signers.Bob.address)
    })
  })
})

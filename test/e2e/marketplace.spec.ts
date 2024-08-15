// SPDX-License-Identifier: MIT
import { KeyringPair } from '@polkadot/keyring/types'
import BN from 'bn.js'
import { after, describe } from 'mocha'

import { CurrencyBuilder, IdBuilder } from '../../typechain-generated/types-arguments/marketplace'
import { ListingStatus } from '../../typechain-generated/types-returns/marketplace'
import ApiSingleton from '../shared/api_singleton'
import { expect } from '../shared/chai'
import { E2E_PREFIX, PRICE, PRICE_WITH_FEE, TOKEN_ID, TOKEN_ID_2 } from '../shared/consts'
import { getBalance, mintAndList } from '../shared/marketplace'
import { Signers } from '../shared/signers'
import { setupArchNFT } from '../shared/test-setups/arch_nft'
import {COLLECTION_ROYALTY} from "../shared/test-setups/creator";
import { setupMarketplace as setup } from '../shared/test-setups/marketplace'
import { INITIAL_BALANCE, setupPSP22 } from '../shared/test-setups/my_psp22'

describe(E2E_PREFIX + 'Marketplace', () => {
  it('Upon initialization, the listing count should be zero.', async () => {
    const contract = await setup()

    await expect(contract.query.getListingCount()).to.have.returnNumber(0)
  })

  it('Get listing by index when there are no listings should return None', async () => {
    const contract = await setup()

    await expect(contract.query.getListingByIndex(0)).to.returnValue(null)
  })

  it('Cancel a listing.', async () => {
    const contract = await setup()

    const nft = await setupArchNFT()
    const psp22 = await setupPSP22()

    const bob = Signers.Bob

    await expect(contract.query.getListingCount()).to.have.returnNumber(0)

    await expect(mintAndList(contract, nft, psp22, TOKEN_ID, PRICE)).to.eventually.be.fulfilled

    await expect(contract.query.getListingCount()).to.have.returnNumber(1)

    await expect(contract.withSigner(bob).tx.cancelListing(0)).to.eventually.be.fulfilled

    await expect(contract.query.getListingCount()).to.have.returnNumber(1)

    await expect(contract.query.getListingByIndex(0)).to.have.deepReturnValue({
      id: 0,
      creator: bob.address,
      collection: nft.address,
      tokenId: TOKEN_ID,
      price: PRICE,
      currency: CurrencyBuilder.Custom(psp22.address),
      status: ListingStatus.cancelled,
      royalty: COLLECTION_ROYALTY,
    })
  })

  describe('PSP22 Currency', () => {
    it('List a new NFT for sale', async () => {
      const contract = await setup()
      const nft = await setupArchNFT()
      const psp22 = await setupPSP22()

      await expect(contract.query.getListingCount()).to.have.returnNumber(0)

      await expect(mintAndList(contract, nft, psp22, TOKEN_ID, PRICE)).to.eventually.be.fulfilled

      await expect(contract.query.getListingCount()).to.have.returnNumber(1)
      await expect(contract.query.getListingByIndex(0)).to.have.deepReturnValue({
        id: 0,
        creator: Signers.Bob.address,
        collection: nft.address,
        tokenId: TOKEN_ID,
        price: PRICE,
        currency: CurrencyBuilder.Custom(psp22.address),
        status: ListingStatus.onSale,
        royalty: COLLECTION_ROYALTY,
      })
    })

    it('Buy a NFT from a listing.', async () => {
      const contract = await setup()
      const nft = await setupArchNFT()
      const psp22 = await setupPSP22()

      const defaultSigner = Signers.defaultSigner
      const bob = Signers.Bob

      await expect(contract.query.getListingCount()).to.have.returnNumber(0)

      await expect(mintAndList(contract, nft, psp22, TOKEN_ID, PRICE)).to.eventually.be.fulfilled

      await expect(contract.query.getListingCount()).to.have.returnNumber(1)
      await expect(contract.query.getListingByIndex(0)).to.have.deepReturnValue({
        id: 0,
        creator: bob.address,
        collection: nft.address,
        tokenId: TOKEN_ID,
        price: PRICE,
        currency: CurrencyBuilder.Custom(psp22.address),
        status: ListingStatus.onSale,
        royalty: COLLECTION_ROYALTY,
      })

      await expect(psp22.withSigner(Signers.Alice).tx.approve(contract.address, 1100)).to.eventually.be
        .fulfilled

      await expect(contract.withSigner(Signers.Alice).tx.buyNft(0)).to.eventually.be.fulfilled

      await expect(contract.query.getListingCount()).to.have.returnNumber(1)

      await expect(contract.query.getListingByIndex(0)).to.have.deepReturnValue({
        id: 0,
        creator: bob.address,
        collection: nft.address,
        tokenId: TOKEN_ID,
        price: PRICE,
        currency: CurrencyBuilder.Custom(psp22.address),
        status: ListingStatus.sold,
        royalty: COLLECTION_ROYALTY,
      })

      await expect(nft.query.ownerOf(TOKEN_ID)).to.have.returnValue(Signers.Alice.address)

      await expect(psp22.query.balanceOf(Signers.Alice.address)).to.have.returnNumber(INITIAL_BALANCE - PRICE)
      await expect(psp22.query.balanceOf(bob.address)).to.have.returnNumber(INITIAL_BALANCE + PRICE_WITH_FEE)
      await expect(psp22.query.balanceOf(defaultSigner.address)).to.have.returnNumber(
        INITIAL_BALANCE + PRICE - PRICE_WITH_FEE,
      )
    })

    it('Buy multiple NFTs from different listings.', async () => {
      const contract = await setup()

      const nft = await setupArchNFT()
      const psp22 = await setupPSP22()

      const defaultSigner = Signers.defaultSigner
      const bob = Signers.Bob
      const alice = Signers.Alice

      const TOKEN_ID_1 = IdBuilder.U8(1)
      const TOKEN_ID_2 = IdBuilder.U8(2)
      const TOKEN_ID_3 = IdBuilder.U8(3)

      await expect(contract.query.getListingCount()).to.have.returnNumber(0)

      await expect(mintAndList(contract, nft, psp22, TOKEN_ID_1, PRICE)).to.eventually.be.fulfilled
      await expect(mintAndList(contract, nft, psp22, TOKEN_ID_2, PRICE)).to.eventually.be.fulfilled
      await expect(mintAndList(contract, nft, psp22, TOKEN_ID_3, PRICE)).to.eventually.be.fulfilled

      await expect(contract.query.getListingCount()).to.have.returnNumber(3)

      await expect(psp22.withSigner(alice).tx.approve(contract.address, 3 * PRICE)).to.eventually.be.fulfilled

      await expect(contract.withSigner(alice).tx.buyBatch([0, 1, 2])).to.eventually.be.fulfilled

      await expect(contract.query.getListingCount()).to.have.returnNumber(3)

      await expect(contract.query.getListingByIndex(0)).to.have.deepReturnValue({
        id: 0,
        creator: bob.address,
        collection: nft.address,
        tokenId: TOKEN_ID_1,
        price: PRICE,
        currency: CurrencyBuilder.Custom(psp22.address),
        status: ListingStatus.sold,
        royalty: COLLECTION_ROYALTY,
      })

      await expect(contract.query.getListingByIndex(1)).to.have.deepReturnValue({
        id: 1,
        creator: bob.address,
        collection: nft.address,
        tokenId: TOKEN_ID_2,
        price: PRICE,
        currency: CurrencyBuilder.Custom(psp22.address),
        status: ListingStatus.sold,
        royalty: COLLECTION_ROYALTY,
      })

      await expect(contract.query.getListingByIndex(2)).to.have.deepReturnValue({
        id: 2,
        creator: bob.address,
        collection: nft.address,
        tokenId: TOKEN_ID_3,
        price: PRICE,
        currency: CurrencyBuilder.Custom(psp22.address),
        status: ListingStatus.sold,
        royalty: COLLECTION_ROYALTY,
      })

      await expect(nft.query.ownerOf(TOKEN_ID_1)).to.have.returnValue(alice.address)
      await expect(nft.query.ownerOf(TOKEN_ID_2)).to.have.returnValue(alice.address)
      await expect(nft.query.ownerOf(TOKEN_ID_3)).to.have.returnValue(alice.address)

      await expect(psp22.query.balanceOf(alice.address)).to.have.returnNumber(INITIAL_BALANCE - 3 * PRICE)
      await expect(psp22.query.balanceOf(bob.address)).to.have.returnNumber(INITIAL_BALANCE + 3 * PRICE_WITH_FEE)
      await expect(psp22.query.balanceOf(defaultSigner.address)).to.have.returnNumber(
        INITIAL_BALANCE + 3 * (PRICE - PRICE_WITH_FEE),
      )
    })
  })

  describe('Native currency', () => {
    it('List a new NFT for sale', async () => {
      const contract = await setup()
      const nft = await setupArchNFT()
      const psp22 = await setupPSP22()

      await expect(contract.query.getListingCount()).to.have.returnNumber(0)

      await expect(mintAndList(contract, nft, psp22, TOKEN_ID, PRICE, true)).to.eventually.be.fulfilled

      await expect(contract.query.getListingCount()).to.have.returnNumber(1)
      await expect(contract.query.getListingByIndex(0)).to.have.deepReturnValue({
        id: 0,
        creator: Signers.Bob.address,
        collection: nft.address,
        tokenId: TOKEN_ID,
        price: PRICE,
        currency: CurrencyBuilder.Native(),
        status: ListingStatus.onSale,
        royalty: COLLECTION_ROYALTY,
      })
    })

    it('Buy a NFT from a listing.', async () => {
      const contract = await setup()
      const nft = await setupArchNFT()
      const psp22 = await setupPSP22()

      const defaultSigner = Signers.defaultSigner
      const bob = Signers.Bob

      await expect(contract.query.getListingCount()).to.have.returnNumber(0)

      await expect(mintAndList(contract, nft, psp22, TOKEN_ID, PRICE, true)).to.eventually.be.fulfilled

      const balanceBeforeCreator = await getBalance(defaultSigner)
      const balanceBeforeBob = await getBalance(bob)

      await expect(contract.query.getListingCount()).to.have.returnNumber(1)
      await expect(contract.query.getListingByIndex(0)).to.have.deepReturnValue({
        id: 0,
        creator: bob.address,
        collection: nft.address,
        tokenId: TOKEN_ID,
        price: PRICE,
        currency: CurrencyBuilder.Native(),
        status: ListingStatus.onSale,
        royalty: COLLECTION_ROYALTY,
      })

      await expect(contract.withSigner(Signers.Alice).tx.buyNft(0, { value: PRICE })).to.eventually.be
        .fulfilled

      await expect(contract.query.getListingCount()).to.have.returnNumber(1)

      await expect(contract.query.getListingByIndex(0)).to.have.deepReturnValue({
        id: 0,
        creator: bob.address,
        collection: nft.address,
        tokenId: TOKEN_ID,
        price: PRICE,
        currency: CurrencyBuilder.Native(),
        status: ListingStatus.sold,
        royalty: COLLECTION_ROYALTY,
      })

      await expect(nft.query.ownerOf(TOKEN_ID)).to.have.returnValue(Signers.Alice.address)

      const balanceAfterCreator = await getBalance(defaultSigner)
      // let balanceAfterAlice = await getBalance(alice);
      const balanceAfterBob = await getBalance(bob)

      const PRICE_WITH_FEE_BN = new BN(PRICE_WITH_FEE)
      const PRICE_BN = new BN(PRICE)

      expect(balanceAfterCreator.toString()).to.be.equal(
        balanceBeforeCreator.add(PRICE_BN).sub(PRICE_WITH_FEE_BN).toString(),
      )
      // Gas fee is not deterministic (Alice)
      expect(balanceAfterBob.toString()).to.be.equal(balanceBeforeBob.add(PRICE_WITH_FEE_BN).toString())
    })

    it('Buy batch of NFTs from a listing.', async () => {
      const contract = await setup()
      const nft = await setupArchNFT()
      const psp22 = await setupPSP22()

      const defaultSigner = Signers.defaultSigner
      const bob = Signers.Bob

      await expect(contract.query.getListingCount()).to.have.returnNumber(0)

      await expect(mintAndList(contract, nft, psp22, TOKEN_ID, PRICE, true)).to.eventually.be.fulfilled
      await expect(mintAndList(contract, nft, psp22, TOKEN_ID_2, PRICE, true)).to.eventually.be.fulfilled

      const balanceBeforeCreator = await getBalance(defaultSigner)
      const balanceBeforeBob = await getBalance(bob)

      await expect(contract.query.getListingCount()).to.have.returnNumber(2)
      await expect(contract.query.getListingByIndex(0)).to.have.deepReturnValue({
        id: 0,
        creator: bob.address,
        collection: nft.address,
        tokenId: TOKEN_ID,
        price: PRICE,
        currency: CurrencyBuilder.Native(),
        status: ListingStatus.onSale,
        royalty: COLLECTION_ROYALTY,
      })
      await expect(contract.query.getListingByIndex(1)).to.have.deepReturnValue({
        id: 1,
        creator: bob.address,
        collection: nft.address,
        tokenId: TOKEN_ID_2,
        price: PRICE,
        currency: CurrencyBuilder.Native(),
        status: ListingStatus.onSale,
        royalty: COLLECTION_ROYALTY,
      })

      await expect(contract.withSigner(Signers.Alice).tx.buyBatch([0, 1], { value: PRICE * 2 })).to.eventually
        .be.fulfilled

      await expect(contract.query.getListingCount()).to.have.returnNumber(2)

      await expect(contract.query.getListingByIndex(0)).to.have.deepReturnValue({
        id: 0,
        creator: bob.address,
        collection: nft.address,
        tokenId: TOKEN_ID,
        price: PRICE,
        currency: CurrencyBuilder.Native(),
        status: ListingStatus.sold,
        royalty: COLLECTION_ROYALTY,
      })
      await expect(contract.query.getListingByIndex(1)).to.have.deepReturnValue({
        id: 1,
        creator: bob.address,
        collection: nft.address,
        tokenId: TOKEN_ID_2,
        price: PRICE,
        currency: CurrencyBuilder.Native(),
        status: ListingStatus.sold,
        royalty: COLLECTION_ROYALTY,
      })

      await expect(nft.query.ownerOf(TOKEN_ID)).to.have.returnValue(Signers.Alice.address)
      await expect(nft.query.ownerOf(TOKEN_ID_2)).to.have.returnValue(Signers.Alice.address)

      const balanceAfterCreator = await getBalance(defaultSigner)
      const balanceAfterBob = await getBalance(bob)

      const PRICE_WITH_FEE_BN = new BN(PRICE_WITH_FEE)
      const PRICE_BN = new BN(PRICE)

      expect(balanceAfterCreator.toString()).to.be.equal(
        balanceBeforeCreator
          .add(PRICE_BN.mul(new BN(2)))
          .sub(PRICE_WITH_FEE_BN.mul(new BN(2)))
          .toString(),
      )
      // Gas fee is not deterministic (Alice)
      expect(balanceAfterBob.toString()).to.be.equal(balanceBeforeBob.add(PRICE_WITH_FEE_BN.mul(new BN(2))).toString())
    })
  })

  after(async () => {
    await ApiSingleton.disconnect()
  })
})

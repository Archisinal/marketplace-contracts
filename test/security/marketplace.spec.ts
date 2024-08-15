// SPDX-License-Identifier: MIT
import { KeyringPair } from '@polkadot/keyring/types'
import { after, describe } from 'mocha'

import { CurrencyBuilder, IdBuilder } from '../../typechain-generated/types-arguments/marketplace'
import { ListingStatus } from '../../typechain-generated/types-returns/marketplace'
import ApiSingleton from '../shared/api_singleton'
import { expect } from '../shared/chai'
import { PRICE, PRICE_WITH_FEE, SECURITY_PREFIX, TOKEN_ID, TOKEN_ID_1, TOKEN_ID_2, TOKEN_ID_3 } from '../shared/consts'
import { mintAndList } from '../shared/marketplace'
import { Signers } from '../shared/signers'
import { setupArchNFT } from '../shared/test-setups/arch_nft'
import { setupMarketplace as setup } from '../shared/test-setups/marketplace'
import { setupPSP22 } from '../shared/test-setups/my_psp22'
import {COLLECTION_ROYALTY} from "../shared/test-setups/creator";

async function getBalance(signer: KeyringPair) {
  const api = await ApiSingleton.getInstance()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { data: balance } = await api.query.system.account(signer.address)

  return balance.free
}

describe(SECURITY_PREFIX + 'Marketplace', () => {
  it("Try to cancel a listing that doesn't exist.", async () => {
    const contract = await setup()

    const bob = Signers.Bob

    await expect(contract.query.getListingCount()).to.have.returnNumber(0)

    await expect(contract.withSigner(bob).tx.cancelListing(0)).to.eventually.be.rejected

    await expect(contract.query.getListingCount()).to.have.returnNumber(0)
  })

  describe('PSP22 Currency', () => {
    it('Try to buy multiple NFTs where some or all ids are not valid.', async () => {
      const contract = await setup()

      const nft = await setupArchNFT()
      const psp22 = await setupPSP22()

      const bob = Signers.Bob
      const alice = Signers.Alice

      await expect(contract.query.getListingCount()).to.have.returnNumber(0)

      await expect(mintAndList(contract, nft, psp22, TOKEN_ID_1, PRICE)).to.eventually.be.fulfilled
      await expect(mintAndList(contract, nft, psp22, TOKEN_ID_2, PRICE)).to.eventually.be.fulfilled
      await expect(mintAndList(contract, nft, psp22, TOKEN_ID_3, PRICE)).to.eventually.be.fulfilled

      await expect(contract.query.getListingCount()).to.have.returnNumber(3)

      await expect(psp22.withSigner(alice).tx.approve(contract.address, 3 * PRICE_WITH_FEE)).to.eventually.be.fulfilled

      await expect(contract.withSigner(alice).tx.buyBatch([0, 1, 4])).to.eventually.be.rejected

      await expect(contract.query.getListingCount()).to.have.returnNumber(3)

      await expect(contract.query.getListingByIndex(2)).to.have.deepReturnValue({
        id: 2,
        creator: bob.address,
        collection: nft.address,
        tokenId: TOKEN_ID_3,
        price: PRICE,
        currency: CurrencyBuilder.Custom(psp22.address),
        status: ListingStatus.onSale,
        royalty: COLLECTION_ROYALTY,
      })
    })
  })

  describe('Native currency', () => {
    it('Cannot Buy a NFT from a listing with a lower price than the listing.', async () => {
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

      await expect(contract.withSigner(Signers.Alice).tx.buyNft(0, { value: PRICE - 1 })).to.eventually.be.rejected

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

      await expect(nft.query.ownerOf(TOKEN_ID)).to.have.returnValue(contract.address)

      const balanceAfterCreator = await getBalance(defaultSigner)
      const balanceAfterBob = await getBalance(bob)

      expect(balanceAfterCreator.toString()).to.be.equal(balanceBeforeCreator.toString())
      expect(balanceAfterBob.toString()).to.be.equal(balanceBeforeBob.toString())
    })
  })

  it('Cannot list NFT with a price of 0.', async () => {
    const contract = await setup()
    const nft = await setupArchNFT()
    const psp22 = await setupPSP22()

    await expect(mintAndList(contract, nft, psp22, TOKEN_ID, 0)).to.eventually.be.rejected

    await expect(contract.query.getListingCount()).to.have.returnNumber(0)
  })

  it('Cannot buy an cancelled NFT from a listing.', async () => {
    const contract = await setup()
    const nft = await setupArchNFT()
    const psp22 = await setupPSP22()

    const bob = Signers.Bob

    await expect(mintAndList(contract, nft, psp22, TOKEN_ID, PRICE, true)).to.eventually.be.fulfilled
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
    await expect(contract.withSigner(Signers.Bob).tx.cancelListing(0)).to.eventually.be.fulfilled
    await expect(contract.query.getListingByIndex(0)).to.have.deepReturnValue({
      id: 0,
      creator: bob.address,
      collection: nft.address,
      tokenId: TOKEN_ID,
      price: PRICE,
      currency: CurrencyBuilder.Native(),
      status: ListingStatus.cancelled,
      royalty: COLLECTION_ROYALTY,
    })
    await expect(contract.withSigner(Signers.Alice).tx.buyNft(0, { value: PRICE })).to.eventually.be.rejected
    await expect(contract.query.getListingByIndex(0)).to.have.deepReturnValue({
      id: 0,
      creator: bob.address,
      collection: nft.address,
      tokenId: TOKEN_ID,
      price: PRICE,
      currency: CurrencyBuilder.Native(),
      status: ListingStatus.cancelled,
      royalty: COLLECTION_ROYALTY,
    })

    await expect(nft.query.ownerOf(TOKEN_ID)).to.have.returnValue(bob.address)
  })


  it('only owner of the NFT can make a listing', async () => {
    const contract = await setup()
    const nft = await setupArchNFT()
    const psp22 = await setupPSP22()
    const bob = Signers.Bob
    const tokenId = IdBuilder.U8(1)
    const price = 100

    await expect(nft.tx.mint(bob.address, tokenId)).to.eventually.be.fulfilled

    await expect(nft.withSigner(bob).tx.approve(contract.address, tokenId, true)).to.eventually.be.fulfilled

    await expect(
      contract
        .withSigner(Signers.Alice)
        .tx.listNftForSale(bob.address, nft.address, tokenId, price, CurrencyBuilder.Custom(psp22.address)),
    ).to.eventually.be.rejected
  })

  after(async () => {
    await ApiSingleton.disconnect()
  })
})

// SPDX-License-Identifier: MIT
import { after, describe } from 'mocha'

import Constructors from "../../typechain-generated/constructors/arch_nft";
import { IdBuilder } from '../../typechain-generated/types-arguments/arch_nft'
import ApiSingleton from '../shared/api_singleton'
import { expect } from '../shared/chai'
import {SECURITY_PREFIX} from "../shared/consts";
import { Signers } from '../shared/signers'
import { setupArchNFT as setup } from '../shared/test-setups/arch_nft'
import { ADDITIONAL_INFO, COLLECTION_NAME, COLLECTION_URI } from '../shared/test-setups/creator'

describe(SECURITY_PREFIX + 'Arch NFT', () => {
  it('Metadata works', async () => {
    const contract = await setup()

    await expect(contract.query.collectionRoyalty()).to.have.returnValue(100)
    await expect(contract.query.collectionName()).to.have.returnValue(COLLECTION_NAME)
    await expect(contract.query.collectionUri()).to.have.returnValue(COLLECTION_URI)
    await expect(contract.query.collectionAdditionalInfo()).to.have.returnValue(ADDITIONAL_INFO)
  })

  it('Cannot deploy with royalty more than 10000', async () => {
    const api = await ApiSingleton.getInstance()

    const defaultSigner = Signers.defaultSigner

    const constructors = new Constructors(api, defaultSigner)

    await expect(constructors.new(10001, COLLECTION_NAME, COLLECTION_URI, ADDITIONAL_INFO)).to.eventually.be.rejected

    await expect(constructors.newDefault(defaultSigner.address, 10000, COLLECTION_NAME, COLLECTION_URI, ADDITIONAL_INFO)).to.eventually.be.fulfilled
  })

  it('Cannot mint NFT if not owner', async () => {
    const contract = await setup()

    await expect(contract.withSigner(Signers.Bob).tx.mint(Signers.Alice.address, IdBuilder.U8(1))).to.eventually.be.rejected
  })

  it('Cannot transfer NFT if not owner', async () => {
    const contract = await setup()

    const alice = Signers.Alice
    const bob = Signers.Bob

    await contract.tx.mint(alice.address, IdBuilder.U8(1))

    await expect(contract.withSigner(bob).tx.transfer(bob.address, IdBuilder.U8(1), [])).to.eventually.be.rejected
  })

  it('Cannot burn NFT if not owner', async () => {
    const contract = await setup()

    const { Alice: alice, Bob: bob } = Signers

    await contract.tx.mint(alice.address, IdBuilder.U8(1))

    await expect(contract.withSigner(bob).tx.burn(alice.address, IdBuilder.U8(1))).to.eventually.be.rejected
  })

  it('Cannot set collection name if not owner', async () => {
    const contract = await setup()

    await expect(contract.withSigner(Signers.Bob).tx.setCollectionName('New name')).to.eventually.be.rejected
  })

  it('Cannot set collection uri if not owner', async () => {
    const contract = await setup()

    await expect(contract.withSigner(Signers.Bob).tx.setCollectionUri('New uri')).to.eventually.be.rejected
  })

  it('Cannot set collection additional info if not owner', async () => {
    const contract = await setup()

    await expect(contract.withSigner(Signers.Bob).tx.setCollectionAdditionalInfo('New info')).to.eventually.be.rejected
  })

  it('Cannot mint NFT if already minted', async () => {
    const contract = await setup()

    const alice = Signers.Alice

    await contract.tx.mint(alice.address, IdBuilder.U8(1))

    await expect(contract.tx.mint(alice.address, IdBuilder.U8(1))).to.eventually.be.rejected
  })

  it('Not NFT owner cannot set NFT metadata', async () => {
    const contract = await setup()
    const metadata = {
      name: 'New name',
      description: 'New description',
      image: 'New image',
      externalUrl: 'New external url',
      categories: ['New category'],
    };

    await contract.tx.mint(Signers.Alice.address, IdBuilder.U8(1))
    await expect(contract.withSigner(Signers.Bob).tx.updateNftMetadata(IdBuilder.U8(1), metadata)).to.eventually.be.rejected
  })

  after(async () => {
    await ApiSingleton.disconnect()
  })
})

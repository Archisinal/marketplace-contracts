// SPDX-License-Identifier: MIT
import Constructors from '../../../typechain-generated/constructors/marketplace'
import Contract from '../../../typechain-generated/contracts/marketplace'
import ApiSingleton from '../api_singleton'
import { Signers } from '../signers'
import { setupCollectionFabric } from './collection_fabric'

export async function setupMarketplace(): Promise<Contract> {
  const api = await ApiSingleton.getInstance()

  const defaultSigner = Signers.defaultSigner

  const constructors = new Constructors(api, defaultSigner)

  const collectionFabric = await setupCollectionFabric()

  const { address } = await constructors.new(defaultSigner.address, collectionFabric.address)

  return new Contract(address, defaultSigner, api)
}

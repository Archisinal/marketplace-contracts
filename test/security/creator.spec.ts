// SPDX-License-Identifier: MIT
import { after, describe } from 'mocha'

import ApiSingleton from '../shared/api_singleton'
import { expect } from '../shared/chai'
import {SECURITY_PREFIX} from "../shared/consts";
import { Signers } from '../shared/signers'
import {
  ADDITIONAL_INFO,
  COLLECTION_CODE_HASH,
  COLLECTION_NAME,
  COLLECTION_ROYALTY,
  COLLECTION_URI,
  setupCreator as setup,
} from '../shared/test-setups/creator'

describe(SECURITY_PREFIX + 'Creator', () => {
  it('Cannot edit user data if not owner', async () => {
    const contract = await setup()

    await expect(contract.withSigner(Signers.Bob).tx.setUserData({
      nick: '@some_nick',
      avatar: null,
      additionInfo: 'Some additional info',
    })).to.eventually.be.rejected
  })

  after(async () => {
    await ApiSingleton.disconnect()
  })
})

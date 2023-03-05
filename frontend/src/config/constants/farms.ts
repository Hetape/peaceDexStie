import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 5,
    lpSymbol: 'PET-BNB LP',
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0xcdf3cb8e9a06a9653548dfd3af1614006e0907cf',
    },
    token: serializedTokens.peace,
    quoteToken: serializedTokens.wbnb,
  },
  // {
  //   pid: 1,
  //   lpSymbol: 'PET-BNB LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x5ec2ec1C9d2e6DEba58536c5Ecbe2E955CC4c227',
  //   },
  //   token: serializedTokens.peace,
  //   quoteToken: serializedTokens.wbnb,
  // },

  // {
  //   pid: 2,
  //   lpSymbol: 'PET-BNB LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x5ec2ec1C9d2e6DEba58536c5Ecbe2E955CC4c227',
  //   },
  //   token: serializedTokens.peace,
  //   quoteToken: serializedTokens.wbnb,
  // },

]

export default farms

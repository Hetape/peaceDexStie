import BigNumber from 'bignumber.js'
/* import masterchefABI from 'config/abi/masterchef.json' */
import masterchefABI from 'config/abi/metaRewards.json'
import erc20 from 'config/abi/erc20.json'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import multicall from 'utils/multicall'
import { SerializedFarm, SerializedBigNumber } from '../types'

type PublicFarmData = {
  tokenAmountTotal: SerializedBigNumber
  lpTotalInQuoteToken: SerializedBigNumber
  lpTotalSupply: SerializedBigNumber
  tokenPriceVsQuote: SerializedBigNumber
  poolWeight: SerializedBigNumber
  multiplier: string
  lpTokenValue: SerializedBigNumber
  tokenPerBlock: SerializedBigNumber
  withdrawLockPeriod: SerializedBigNumber
}

const fetchFarm = async (farm: SerializedFarm): Promise<PublicFarmData> => {
  const { pid, lpAddresses, token, quoteToken } = farm
  const lpAddress = getAddress(lpAddresses)
  const calls = [
    // Balance of token in the LP contract
    {
      address: token.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: quoteToken.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [getMasterChefAddress()],
    },
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: token.address,
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: quoteToken.address,
      name: 'decimals',
    },
  ]

  const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
    await multicall(erc20, calls)

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals))
  const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals))

  // Amount of quoteToken in the LP that are staked in the MC
  const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

  // Total staked in LP, in quote token value
  const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))

  // Only make masterchef calls if farm has pid
  const [info, totalAllocPoint, tokenPerBlock] =
    (pid || pid === 0)
      ? await multicall(masterchefABI, [
        {
          address: getMasterChefAddress(),
          name: 'poolInfo',
          params: [pid],
        },
      ])
      : [null, null]

  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
  const withdrawLockPeriod = info ? new BigNumber(info.withdrawLockPeriod?._hex) : BIG_ZERO
  // const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO
  const lpTokenValue = (info && info.balance) ? new BigNumber(info.balance?._hex).div(BIG_TEN.pow(quoteTokenDecimals)) : BIG_ZERO
  return {
    tokenAmountTotal: tokenAmountTotal.toJSON(),
    lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
    lpTotalInQuoteToken: lpTokenValue.toJSON(),
    tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal).toJSON(),
    poolWeight: '0',
    multiplier: '0',
    lpTokenValue: lpTokenValue.toJSON(),
    tokenPerBlock: new BigNumber(tokenPerBlock).div(BIG_TEN.pow(tokenDecimals)).toJSON(),
    withdrawLockPeriod: withdrawLockPeriod.toJSON()
  }
}

export default fetchFarm

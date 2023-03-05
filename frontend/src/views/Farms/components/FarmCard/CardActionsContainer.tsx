import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Text } from '@pancakeswap/uikit'
import { getAddress } from 'utils/addressHelpers'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { DeserializedFarm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { useERC20 } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'
import useApproveFarm from '../../hooks/useApproveFarm'
import useCountdown from './Countdown/useCountdown'
import CountDown from './Countdown'

const Action = styled.div`
  padding-top: 16px;
`
export interface FarmWithStakedValue extends DeserializedFarm {
  apr?: number
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  account?: string
  addLiquidityUrl?: string
  cakePrice?: BigNumber
  lpLabel?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, account, addLiquidityUrl, cakePrice, lpLabel }) => {
  const { t } = useTranslation()
  const { toastError } = useToast()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses } = farm
  const { allowance, tokenBalance, stakedBalance, earnings, lastDepositTime, canHarvest } = farm.userData || {}
  const lpAddress = getAddress(lpAddresses)
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const dispatch = useAppDispatch()
  /* Get PET Token Contract */
  const lpContract = useERC20(lpAddress)

  const { onApprove } = useApproveFarm(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
    } catch (e) {
      toastError(t('Error'), t('Sorry! Transaction is failed!'))
      console.error(e)
    } finally {
      setRequestedApproval(false)
    }
  }, [onApprove, dispatch, account, pid, t, toastError])

  let withdrawLocked = true
  const setWithdrawLocked = (flag) => {
    withdrawLocked = flag
  }
  // const onStaked = useCallback(() => setWithdrawLocked(false), [setWithdrawLocked])
  const onStaked = () => {
    withdrawLocked = false
  }

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={farm.lpSymbol}
        pid={pid}
        apr={farm.apr}
        lpLabel={lpLabel}
        cakePrice={cakePrice}
        addLiquidityUrl={addLiquidityUrl}
        withdrawLocked={withdrawLocked}
        onStaked={onStaked}
      />
    ) : (
      <Button mt="8px" width="100%" disabled={requestedApproval} onClick={handleApprove}>
        {t('Enable Contract')}
      </Button>
    )
  }

  let lastDepositTimeVal = lastDepositTime.toNumber()
  const utcNow = Date.now() / 1000;
  
  lastDepositTimeVal = utcNow - 1 // test code
  const [secondsRemaining, setSecondsRemaining] = useState(0)

  let isCountingdown = false
  let timer: ReturnType<typeof setTimeout>
  let startCountingValue = 0
  const timerCallback = () => {
    if (startCountingValue === 0) {
      setSecondsRemaining(secondsRemaining - 1)
    } else {
      setSecondsRemaining(startCountingValue)
      startCountingValue = 0
    }
    if (isCountingdown && secondsRemaining === 0) {
      clearTimeout(timer)
      isCountingdown = false
      countDownVisibility = false
    }
  }

  const withdrawLockPeriod = farm.pid === 0 ? 30 : (farm.pid === 1 ? 45 : 50)
  const deadLine = lastDepositTimeVal + withdrawLockPeriod
  let countDownVisibility = false
  if (/* !account || !isApproved || */ lastDepositTimeVal === 0) {
    countDownVisibility = false
  } else if (lastDepositTimeVal < utcNow && utcNow < deadLine) {
    countDownVisibility = true

    if (isCountingdown === false) {
      isCountingdown = true
      startCountingValue = deadLine - utcNow
      setTimeout(timerCallback, 1000)
    }
  }

  countDownVisibility = false
  // withdrawLocked = isCountingdown

  return (
    <Action>
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          PET
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Earned')}
        </Text>
      </Flex>
      <HarvestAction earnings={earnings} pid={pid} canHarvest={canHarvest} />

      <Flex justifyContent="flex-end" style={{ display: countDownVisibility ? 'flex' : 'none'}}>
        <CountDown secondsRemaining={secondsRemaining} />
      </Flex>

      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          {t('PET-BNB')}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Staked')}
        </Text>
      </Flex>
      {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

export default CardActions

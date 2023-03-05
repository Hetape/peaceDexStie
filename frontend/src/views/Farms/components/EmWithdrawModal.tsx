import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Modal, Text, Flex, Button, HelpIcon, AutoRenewIcon, useTooltip } from '@pancakeswap/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { useCakeVaultContract, useMasterchef } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ToastDescriptionWithTx } from 'components/Toast'
import Balance from 'components/Balance'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useCakeVault } from 'state/pools/hooks'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { emergencyWithdraw } from 'utils/calls/farms'

interface EmWithdrawModalProps {
  onDismiss?: () => void
  PID: number
}

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  height: 1px;
  margin: 16px auto;
  width: 100%;
`

const EmWithdrawModal: React.FC<EmWithdrawModalProps> = ({ onDismiss, PID }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()
  const { toastError, toastSuccess } = useToast()
  const cakeVaultContract = useCakeVaultContract()
  const [pendingTx, setPendingTx] = useState(false)
  const {
    estimatedCakeBountyReward,
    totalPendingCakeHarvest,
    fees: { callFee },
  } = useCakeVault()
  const { callWithGasPrice } = useCallWithGasPrice()
  const cakePriceBusd = usePriceCakeBusd()
  const callFeeAsDecimal = callFee / 100
  const totalYieldToDisplay = getBalanceNumber(totalPendingCakeHarvest, 18)

  const estimatedDollarBountyReward = useMemo(() => {
    return new BigNumber(estimatedCakeBountyReward).multipliedBy(cakePriceBusd)
  }, [cakePriceBusd, estimatedCakeBountyReward])

  const hasFetchedDollarBounty = estimatedDollarBountyReward.gte(0)
  const hasFetchedCakeBounty = estimatedCakeBountyReward ? estimatedCakeBountyReward.gte(0) : false
  const dollarBountyToDisplay = hasFetchedDollarBounty ? getBalanceNumber(estimatedDollarBountyReward, 18) : 0
  const cakeBountyToDisplay = hasFetchedCakeBounty ? getBalanceNumber(estimatedCakeBountyReward, 18) : 0

  const masterChefContract = useMasterchef()

  const handleConfirmClick = async () => {
    setPendingTx(true)
    try {
      const tx = await emergencyWithdraw(masterChefContract, PID)
      const receipt = await tx.wait()
      setPendingTx(false)
      onDismiss()
    } catch (error) {
      toastError(t('Error'), t('Sorry! Transaction is failed!'))
      onDismiss()
      setPendingTx(false)
    }
  }

  return (
    <Modal title={t('Emergency Withdraw?')} onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <Flex alignItems="flex-start" justifyContent="space-between">
        <Text>{t('Do you really want to emergency withdraw?')}</Text>
      </Flex>
      <Divider />
      {account ? (
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleConfirmClick}
          mb="28px"
          id="autoCakeConfirmBounty"
        >
          {pendingTx ? t('Confirming') : t('Confirm')}
        </Button>
        
      ) : (
        <ConnectWalletButton mb="28px" />
      )}
    </Modal>
  )
}

export default EmWithdrawModal

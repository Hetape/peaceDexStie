import BigNumber from 'bignumber.js'
import React from 'react'
import { CardBody, Flex, Text, Tag, LockIcon, CardRibbon } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import moment from 'moment';
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { DeserializedPool } from 'state/types'
import AprRow from './AprRow'
import { StyledCard } from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'
import StakeClock from '../../../../components/StakeClock'

const PoolCard: React.FC<{ pool: DeserializedPool; account: string }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, isFinished, userData, harvestInterval } = pool
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)
  let startTime = ''; 
  let endTime = '';
  if (pool.startTime && pool.endTime) {
    const startDate = new Date(pool.startTime.toNumber() * 1000);
    const endDate = new Date(pool.endTime.toNumber() * 1000);
    startTime = (moment(startDate)).format('YYYY/MM/DD');
    endTime = (moment(endDate)).format('YYYY/MM/DD');
  }
  
  return (
    <StyledCard
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <StyledCardHeader
        isStaking={accountHasStakedBalance}
        earningToken={earningToken}
        stakingToken={stakingToken}
        isFinished={isFinished && sousId !== 0}
      />
    <CardBody>
      <StakeClock start_time={startTime} end_time={endTime} />
      <AprRow pool={pool} stakedBalance={stakedBalance} />
        <Flex mt="20px" justifyContent="space-between">
          {/* <Text >{`${t('APY')}:`}</Text> */}
          <Text mb="5px" fontSize="16px" color="secondary">
            {t('Withdraw Lock')}
          </Text>
          <Tag variant="primary" startIcon={<LockIcon width="14px" color="primary" mr="4px" />}>
            {harvestInterval / 3600 / 24 + t('D')}
          </Tag>
          {/* <Text mb="5px" fontSize="16px" color="secondary">
            {harvestInterval + t('D')}
          </Text> */}
        </Flex>

        <Flex mt="24px" flexDirection="column">
          {account ? (
            <CardActions pool={pool} stakedBalance={stakedBalance} />
          ) : (
            <>
              <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                {t('Start earning')}
              </Text>
              <ConnectWalletButton />
            </>
          )}
        </Flex>
      </CardBody>
      <CardFooter pool={pool} account={account} />
    </StyledCard>
  )
}

export default PoolCard

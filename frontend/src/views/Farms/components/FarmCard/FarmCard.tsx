import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Card, Flex, Text, Skeleton, Tag, LockIcon, } from '@pancakeswap/uikit'
import { DeserializedFarm } from 'state/types'
import { getBscScanLink } from 'utils'
import { useTranslation } from 'contexts/Localization'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { StakingContractAddress } from 'config/constants'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'

export interface FarmWithStakedValue extends DeserializedFarm {
  apr?: number
  lpRewardsApr?: number
  liquidity?: BigNumber
}

const StyledCard = styled(Card)`
  align-self: baseline;
`

const FarmCardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`

const ExpandingWrapper = styled.div`
  padding: 24px;
  border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: hidden;
`

interface FarmCardProps {
  index:number
  farm: FarmWithStakedValue
  displayApr: string
  removed: boolean
  cakePrice?: BigNumber
  account?: string
}

const widrawLockLabel = ['30D'];
const aprLabel = [45.89, 89.32, 123.59];
const FarmCard: React.FC<FarmCardProps> = ({ farm, displayApr, removed, cakePrice, account, index }) => {
  const { t } = useTranslation()

  console.log ('farm: ', farm);

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const totalValueFormatted =
    farm.liquidity && farm.liquidity.gt(0)
      ? `$${farm.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 7 })}`
      : ''
  
  const totlaLpTokenValueFormatted = farm.lpTotalInQuoteToken && farm.lpTotalInQuoteToken.gt(0)
  ? `${farm.lpTotalInQuoteToken.toNumber().toLocaleString(undefined, { maximumFractionDigits: 7 })}`
  : ''
      
  const lpLabel = "MTR";/* arm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '') */
 
  const earnLabel = widrawLockLabel[index]/* farm.dual ? farm.dual.earnLabel : t('CAKE + Fees') */
 
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const ContractAddress = getAddress(StakingContractAddress)
  const lpAddress = getAddress(farm.lpAddresses)
  const isPromotedFarm = farm.token.symbol === 'CAKE'
  return (
    <StyledCard isActive={isPromotedFarm}>
      <FarmCardInnerContainer>
        <CardHeading
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          isCommunityFarm={farm.isCommunity}
          token={farm.token}
          quoteToken={farm.quoteToken}
        />
        {!removed && (
          <Flex justifyContent="space-between" alignItems="center">
            <Text color="secondary">{t('APR')}:</Text>
            <Text color="secondary" bold style={{ display: 'flex', alignItems: 'center' }}>
              {  30  ? (
                <ApyButton
                  variant="text-and-button"
                  pid={farm.pid}
                  lpSymbol={farm.lpSymbol}
                  multiplier={farm.multiplier}
                  lpLabel={lpLabel}
                  addLiquidityUrl={addLiquidityUrl}
                  cakePrice={cakePrice}
                  apr={  30 }
                  displayApr={ '100'/* displayApr */ }
                />
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </Text>
          </Flex>
        )}
        <Flex justifyContent="space-between">
          <Text color="secondary">{t('Withdraw Lock')}:</Text>
          <Tag variant="secondary" startIcon={<LockIcon width="14px" color="secondary" mr="4px" />}>
            {earnLabel}
          </Tag>
        </Flex>
        <CardActionsContainer
          farm={farm}
          lpLabel={lpLabel}
          account={account}
          cakePrice={cakePrice}
          addLiquidityUrl={addLiquidityUrl}
        />

      </FarmCardInnerContainer>

      <ExpandingWrapper>
        <ExpandableSectionButton
          onClick={() => setShowExpandableSection(!showExpandableSection)}
          expanded={showExpandableSection}
        />
        {showExpandableSection && (
          <DetailsSection
            farm={farm}
            removed={removed}
            bscScanAddress={getBscScanLink(ContractAddress, 'address')}
            infoAddress={`https://pancakeswap.finance/info/pool/${lpAddress}`}
            totalValueFormatted={totalValueFormatted}
            totalLpValueFormatted = {totlaLpTokenValueFormatted}
            lpLabel={lpLabel}
            addLiquidityUrl={addLiquidityUrl}
          />
        )}
      </ExpandingWrapper>
    </StyledCard>
  )
}

export default FarmCard

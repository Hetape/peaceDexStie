import React from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, PocketWatchIcon, Text, Heading } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import getTimePeriods from 'utils/getTimePeriods'
import useTheme from 'hooks/useTheme'
import Timer from './Timer'

const Wrapper = styled(Flex)`
  width: fit-content;
  height: fit-content;
  border: 1px solid #7645d9;
  box-sizing: border-box;
  border-radius: 6px 6px 6px 6px;
  padding: 3px 3px;

  justify-content: space-around;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 4px 4px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: column;
  }
`

interface HeadingProps {
  background?: string
  $fill?: boolean
}
const StyledHeading = styled(Heading)<HeadingProps>`
  font-size: 16px;
  margin-right: 2px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-right: 4px;
  }
`

const Countdown: React.FC<{ secondsRemaining: number; }> = ({
  secondsRemaining,
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const { minutes, hours, days, seconds } = getTimePeriods(secondsRemaining)

  const renderTimer = () => {
    return (
      <Timer
        prefix={`${t('Start')}:`}
        minutes={seconds}
        hours={hours}
        days={days}
        HeadingTextComponent={({ children }) => (
          <StyledHeading background={theme.colors.gradients.gold} $fill>
            {children}
          </StyledHeading>
        )}
        BodyTextComponent={({ children }) => (
          <Text bold color={theme.colors.gradients.gold} fontSize="12px" mr={{ _: '8px', sm: '10px' }}>
            {children}
          </Text>
        )}
      />
    )
  }

  return (
    <Wrapper>
      <Flex justifyContent="center" alignItems="center">
        {renderTimer()}
      </Flex>
    </Wrapper>
  )
}

export default Countdown

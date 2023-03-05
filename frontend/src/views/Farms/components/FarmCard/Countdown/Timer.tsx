import React from 'react'
import styled from 'styled-components'
import { Flex, Heading, Text } from '@pancakeswap/uikit'

export interface TimerProps {
  prefix?: string
  suffix?: string
  minutes?: number
  hours?: number
  days?: number
  showTooltip?: boolean
  blockNumber?: number
  HeadingTextComponent?: React.ElementType
  BodyTextComponent?: React.ElementType
}

const StyledTimerFlex = styled(Flex)<{ showTooltip?: boolean }>`
  ${({ theme, showTooltip }) => (showTooltip ? ` border-bottom: 1px dashed ${theme.colors.textSubtle};` : ``)}
  div:last-of-type {
    margin-right: 0;
  }
`

const Timer = ({ minutes, hours, days, showTooltip, HeadingTextComponent, BodyTextComponent }) => {
  return (
    <StyledTimerFlex alignItems="flex-end" showTooltip={showTooltip}>
      {Boolean(days) && (
        <>
          <HeadingTextComponent mr="2px">{days}</HeadingTextComponent>
          <BodyTextComponent>d</BodyTextComponent>
        </>
      )}
      {Boolean(hours) && (
        <>
          <HeadingTextComponent mr="2px">{hours}</HeadingTextComponent>
          <BodyTextComponent>h</BodyTextComponent>
        </>
      )}
      {Boolean(minutes) && (
        <>
          <HeadingTextComponent mr="2px">{minutes}</HeadingTextComponent>
          <BodyTextComponent>m</BodyTextComponent>
        </>
      )}
    </StyledTimerFlex>
  )
}


const Wrapper: React.FC<TimerProps> = ({
  prefix,
  suffix,
  minutes,
  hours,
  days,
  blockNumber,
  showTooltip = false,
  HeadingTextComponent,
  BodyTextComponent,
}) => {

  return (
    <Flex alignItems="flex-end" position="relative">
      <Timer
        minutes={minutes}
        hours={hours}
        days={days}
        HeadingTextComponent={HeadingTextComponent}
        BodyTextComponent={BodyTextComponent}
        showTooltip={showTooltip}
      />
    </Flex>
  )
}

export default Wrapper

/* eslint-disable camelcase */
import React, { useEffect, useState, useRef } from "react";
import styled from 'styled-components'

const StyledClock = styled.div`
  font-size: 0.8rem;
  position: absolute;
  top: 100px;
  right: 25%;
  left: 25%;
  background: #4bbafa;
  padding: 6px 10px;
  border-radius: 30px;
  border: solid 2px #FFFFFF;
  text-align: center;
  z-index: 1;
  color: #fff;
  &.Ended {
    background: #FFFFFF;
    border: solid 2px #ff8181;
  }
  .Clock-days, .Clock-hours, .Clock-minutes, .Clock-seconds {
    font-weight: bold;
    display: inline-block;
    margin-right: 5px;
    font-size: 15px;
  }
`
export interface ClockProps {
  start_time?: string,
  end_time?: string,
}

const StakeClock : React.FC<ClockProps> = ({start_time, end_time}) => {
  return (
    <StyledClock>
      <div>{start_time} ~ {end_time}</div>
    </StyledClock>
  );
}
export default StakeClock;

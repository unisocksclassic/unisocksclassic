import React, { useState } from 'react'
import styled from 'styled-components'
import Tilt from 'react-tilt'

import { amountFormatter } from '../utils'

import Gallery from './Gallery'

export default function Card({ dollarPrice, reserveSOCKSCLASSICToken, totalSOCKSCLASSICTokenSupply }) {
  const [showPop, setShowPop] = useState(false)

  function handleClickPopover(e) {
    e.preventDefault()
    setShowPop(!showPop)
  }

  return (
    <Tilt
      style={{ background: '#000', borderRadius: '8px' }}
      options={{ scale: 1.01, max: 10, glare: true, 'max-glare': 1, speed: 1000 }}
    >
      <CardWrapper>
        <Title>Unisocks Classic Edition 0</Title>
        <SubTitle>$SOCKSCLASSIC</SubTitle>
        <Gallery />
        <MarketData>
          <span>
            <CurrentPrice>{dollarPrice ? `$${amountFormatter(dollarPrice, 18, 2)} USD` : '$0.00'}</CurrentPrice>
            <SockCount>
              {reserveSOCKSCLASSICToken
                ? `${amountFormatter(reserveSOCKSCLASSICToken, 18, 0)}/${amountFormatter(
                    totalSOCKSCLASSICTokenSupply,
                    18,
                    0
                  )} available`
                : '500/500 available'}
            </SockCount>
          </span>
          <Info>
            <Popover show={showPop} onMouseLeave={e => handleClickPopover(e)}>
              <p style={{ marginTop: '0px' }}>
                The design of SOCKSCLASSIC will not change when tokens are bought and sold.
              </p>
              <a
                href="https://medium.com/@unisocksclassic/socksclassic-the-new-beacon-of-digital-resistance-2f0567924012"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more.
              </a>
            </Popover>
            <InfoButton onMouseEnter={e => handleClickPopover(e)} href="">
              ?
            </InfoButton>
            <Dynamic>Original Design</Dynamic>
          </Info>
        </MarketData>
      </CardWrapper>
    </Tilt>
  )
}

const CardWrapper = styled.div`
  /* max-width: 300px; */
  background: #000000;
  background: linear-gradient(162.92deg, #2b2b2b 12.36%, #000000 94.75%);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  color: white;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 24px;
  z-index: 1;
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);
`

const Title = styled.p`
  font-weight: 500;
  font-size: 24px;
  line-height: 126.7%;
  width: 100%;
  margin: 0;
`

const SubTitle = styled.p`
  color: #6c7284;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 156.7%;
  width: 100%;
  margin: 0;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const SockCount = styled.p`
  color: #aeaeae;
  font-weight: 400;
  margin: 0px;
  font-size: 12px;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const CurrentPrice = styled.p`
  font-weight: 600;
  font-size: 18px;
  margin: 0px;
  margin-bottom: 0.5rem;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const Info = styled.div`
  margin-bottom: -2px;
`

const Popover = styled.div`
  position: fixed;
  font-size: 12px;
  background-color: #404040;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  padding: 1rem;
  border-radius: 6px;
  right: 16px;
  bottom: 16px;
  display: block;
  width: 150px;
  style= {
     {
      margintop: '0px';
    }
  }
  display: ${props => (props.show ? 'block' : 'none')};

  a {
    color: ${props => props.theme.uniswapPink};
    text-decoration: none;
    cursor: pointer;
  }
  a:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

const Dynamic = styled.p`
  color: #aeaeae;
  font-style: italic;
  font-weight: 400;
  margin: 0px;
  font-size: 12px;
  float: left;
`

const InfoButton = styled.a`
  width: 16px;
  height: 16px;
  font-size: 12px;
  color: white;
  text-decoration: none;
  text-align: center;
  border-radius: 50%;
  margin-left: 8px;
  float: right;
  background-color: #5ca2ff;
`

const MarketData = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  margin-top: 1rem;
`

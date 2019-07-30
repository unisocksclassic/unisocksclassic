import React from 'react'
import styled from 'styled-components'

import { Controls } from './Common'

const WorksFrame = styled.div`
  width: 100%;
  padding: 24px;
  // padding-top: 16px;
  box-sizing: border-box;
  font-size: 24px;
  font-weight: 600;
  /* line-height: 170%; */
  /* text-align: center; */
`
const Title = styled.p`
  margin-top: 1rem !important;

  font-weight: 600;
  font-size: 16px;
`

const Desc = styled.p`
  line-height: 150%;
  font-size: 14px;
  margin-top: 1rem !important;
  font-weight: 500;
`

export function link(hash) {
  return `https://etherscan.io/tx/${hash}`
}

export const EtherscanLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.uniswapPink};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
`
export const ScrollableContent = styled.div`
  height: calc(100vh - 140px);
  overflow: scroll;
  scrollbar-width: none;
`

export default function Works({ closeCheckout }) {
  return (
    <WorksFrame>
      <Controls closeCheckout={closeCheckout} theme={'dark'} />

      <ScrollableContent>
        <Title>How it works:</Title>
        <Desc>
          $SOCKSCLASSIC is an ERC-20 token that entitles you to 1 limited edition ERC-721 token, shipped anywhere in the
          world.
        </Desc>
        <Desc>
          You can sell the ERC-20 token back at any time. To get a <i>real</i> ERC-721 token, redeem a $SOCKSCLASSIC
          token
        </Desc>
        <Title>How it's priced:</Title>
        <Desc>
          $SOCKSCLASSIC tokens are airdropped to $SOCKS holders (2019.07.02, 15:57:03 UTC), remaining tokens are listed
          against 0.5 ETH. Each buy/sell will move the price. The increase or decrease follows a{' '}
          <a
            href="https://blog.relevant.community/bonding-curves-in-depth-intuition-parametrization-d3905a681e0a"
            target="_blank"
            rel="noopener noreferrer"
          >
            bonding curve
          </a>
          . $SOCKSCLASSIC will eventually find an equillibrium based on market demand.
        </Desc>
        <Title>Unipay:</Title>
        <Desc>
          Buying or selling socks uses the uniswap protocol and accepts any token input as a payment method. The pool of
          $SOCKSCLASSIC is a uniswap pool where ~241 $SOCKSCLASSIC tokens were deposited along with the starting value
          of ETH.{' '}
        </Desc>
        <Desc>
          <a href="https://docs.uniswap.io/" target="_blank" rel="noopener noreferrer">
            Learn more about how uniswap works.
          </a>
        </Desc>
        <Desc>
          <a href="mailto:unisocksclassic@gmail.com" target="_blank" rel="noopener noreferrer">
            Get in touch.
          </a>
        </Desc>
      </ScrollableContent>
    </WorksFrame>
  )
}

import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'

import { amountFormatter, TRADE_TYPES, link } from '../utils'
import { ConfirmedFrame, Shim, TopFrame, ButtonFrame, Controls, PopupContent } from './Common'

import sent from './Gallery/test.png'
import { useAppContext } from '../context'

export default function Confirmed({ hash, type, amount, clearLastTransaction, closeCheckout }) {
  const [state, setState] = useAppContext()
  const { networkId } = useWeb3Context()

  useEffect(() => {
    if (!state.visible) {
      clearLastTransaction()
    }
  }, [state.visible, clearLastTransaction])

  if (type === TRADE_TYPES.UNLOCK) {
    return (
      <ConfirmedFrame>
        <TopFrame>
          <Controls closeCheckout={closeCheckout}>
            {"Unlock"} 
          </Controls>
          <PopupContent>
            <ImgStyle src={sent} alt="Logo" />
            <InfoFrame>
              <Owned>
                <p>Unlocked Token!</p>
              </Owned>
            </InfoFrame>
          </PopupContent>
        </TopFrame>
        <CheckoutPrompt>
          <EtherscanLink href={link('etherscan', hash, networkId)} target="_blank" rel="noopener noreferrer">
            Transaction Details ↗
          </EtherscanLink>
        </CheckoutPrompt>
      </ConfirmedFrame>
    )
  } else if (type === TRADE_TYPES.BUY) {
    return (
      <ConfirmedFrame>
        <TopFrame>
          <Controls closeCheckout={closeCheckout}>
            {"Buy"} 
          </Controls>
          <PopupContent>
            <ImgStyle src={sent} alt="Logo" />
            <InfoFrame>
              <Owned>
                <p>{`You got ${amountFormatter(amount, 18, 0)} SOCKSCLASSIC!`}</p>
              </Owned>
            </InfoFrame>
          </PopupContent>
        </TopFrame>
        <CheckoutPrompt>
          <EtherscanLink href={link('etherscan', hash, networkId)} target="_blank" rel="noopener noreferrer">
            Transaction Details ↗
          </EtherscanLink>
        </CheckoutPrompt>
        <Shim />
        <ButtonFrame
          text={`Redeem your SOCKSCLASSIC now`}
          type={'cta'}
          onClick={() => {
            clearLastTransaction()
            setState(state => ({ ...state, tradeType: TRADE_TYPES.REDEEM }))
            // Trigger buy frame here!
          }}
        />
        {/* <Shim /> */}
      </ConfirmedFrame>
    )
  } else {
    return (
      <ConfirmedFrame>
        <TopFrame>
          <Controls closeCheckout={closeCheckout}>
            {"Sell"}
          </Controls>
          <PopupContent>
            <ImgStyle src={sent} alt="Logo" />
            <InfoFrame>
              <Owned>
                <p>You sold SOCKSCLASSIC!</p>
              </Owned>
            </InfoFrame>
          </PopupContent>
        </TopFrame>
        <CheckoutPrompt>
          <EtherscanLink href={link('etherscan', hash, networkId)} target="_blank" rel="noopener noreferrer">
            Transaction Details ↗
          </EtherscanLink>
        </CheckoutPrompt>
        {/* <Shim /> */}
      </ConfirmedFrame>
    )
  }
}

const InfoFrame = styled.div`
  width: 100%;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-top: 0;
  justify-content: 'center';
  align-items: flex-end;
  padding: 0;
  /* padding: 1rem 0 1rem 0; */
  margin-top: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  /* background-color: ${props => (props.hasPickedAmount ? '#000' : 'none')}; */
  /* border: ${props => (props.hasPickedAmount ? '1px solid #3d3d3d' : 'none')}; */
`

const Owned = styled.div`
  font-weight: 700;
  color: #efe7e4;
  font-size: 24px;
  margin-bottom: 12px;
  margin: 0px;
  white-space: pre-wrap;
`

const ImgStyle = styled.img`
  display: flex;
  width: auto;
  max-width: 70%;
  max-height: 50vh;
  padding: 2rem 0 2rem 0;
  box-sizing: border-box;
`

const CheckoutPrompt = styled.p`
  font-weight: 500;
  font-size: 14px;
  text-align: left;
  color: '#000';
  font-style: italic;
  width: 100%;
  box-sizing: border-box;
  margin: 16px 0 0;
`
const EtherscanLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.uniswapPink};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
`

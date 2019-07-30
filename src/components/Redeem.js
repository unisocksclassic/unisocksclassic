import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'

import { useAppContext } from '../context'
import RedeemForm from './RedeemForm'
import { ConfirmedFrame, Shim, TopFrame, ButtonFrame, Controls } from './Common'
import { ERROR_CODES, TRADE_TYPES, REDEEM_ADDRESS, TOKEN_ADDRESSES, amountFormatter, link } from '../utils'

import IncrementToken from './IncrementToken'
import test from './Gallery/test.png'
import nfc from './Gallery/sent.png'
import sent from './Gallery/sent.png'

import Confetti from 'react-dom-confetti'

const config = {
  angle: 90,
  spread: 76,
  startVelocity: 51,
  elementCount: 154,
  dragFriction: 0.1,
  duration: 7000,
  stagger: 0,
  width: '10px',
  height: '10px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
}

export function RedeemControls({ closeCheckout, theme, type }) {
  return (
    <Controls theme={theme} closeCheckout={closeCheckout}>
      Pay{' '}
      <span style={{ color: '#737373' }}>
        {type === 'confirm' ? ' / Order Details' : type === 'shipping' ? ' / Shipping Details' : ''}
      </span>
    </Controls>
  )
}

function getValidationErrorMessage(validationError) {
  if (!validationError) {
    return null
  } else {
    switch (validationError.code) {
      case ERROR_CODES.INVALID_AMOUNT: {
        return 'Invalid Amount'
      }
      case ERROR_CODES.INVALID_TRADE: {
        return 'Invalid Trade'
      }
      case ERROR_CODES.INSUFFICIENT_ALLOWANCE: {
        return 'Set Allowance to Continue'
      }
      case ERROR_CODES.INSUFFICIENT_ETH_GAS: {
        return 'Not Enough ETH to Pay Gas'
      }
      case ERROR_CODES.INSUFFICIENT_SELECTED_TOKEN_BALANCE: {
        return 'Not Enough of Selected Token'
      }
      default: {
        return 'Unknown Error'
      }
    }
  }
}

export default function Redeem({
  burn,
  validateRedeem,
  balanceSOCKSCLASSIC,
  balance,
  ready,
  unlock,
  dollarize,
  setCurrentTransaction,
  setShowConnect,
  closeCheckout
}) {
  const { library, account, setConnector, networkId } = useWeb3Context()
  const [state] = useAppContext()

  const [numberBurned, setNumberBurned] = useState()
  const [validationState, setValidationState] = useState({})
  const [validationError, setValidationError] = useState()
  const [hasPickedAmount, setHasPickedAmount] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const [lastTransactionHash, setLastTransactionHash] = useState('')

  const [hasBurnt, setHasBurnt] = useState(false)

  const pending = !!transactionHash

  useEffect(() => {
    if (transactionHash) {
      library.waitForTransaction(transactionHash).then(() => {
        setLastTransactionHash(transactionHash)
        setTransactionHash('')
        setHasBurnt(true)
      })
    }
  })

  // redeem state validation
  useEffect(() => {
    if (ready) {
      try {
        const { error: validationError, ...validationState } = validateRedeem(String(state.count))
        setValidationState(validationState)
        setValidationError(validationError || null)

        return () => {
          setValidationState({})
          setValidationError()
        }
      } catch (error) {
        setValidationState({})
        setValidationError(error)
      }
    }
  }, [ready, state.count, validateRedeem])

  const shouldRenderUnlock = validationError && validationError.code === ERROR_CODES.INSUFFICIENT_ALLOWANCE

  const errorMessage = getValidationErrorMessage(validationError)

  function getText(account, errorMessage, pending, amount) {
    if (account === null) {
      return 'Connect Wallet'
    } else if (ready && !errorMessage) {
      if (pending) {
        return 'Waiting for confirmation'
      } else {
        return `Redeem {state.count} SOCKSCLASSIC`
      }
    } else {
      return errorMessage ? errorMessage : 'Loading...'
    }
  }

  function renderContent() {
    if (account === null) {
      return (
        <ButtonFrame
          className="button"
          disabled={false}
          text={account === null ? 'Connect Wallet' : 'Redeem SOCKSCLASSIC'}
          type={'cta'}
          onClick={() => {
            setConnector('Injected', { suppressAndThrowErrors: true }).catch(() => {
              setShowConnect(true)
            })
          }}
        />
      )
    } else if (!hasPickedAmount) {
      return (
        <ConfirmedFrame>
          <TopFrame hasPickedAmount={hasPickedAmount}>
            <RedeemControls closeCheckout={closeCheckout} />
            <ImgStyle src={test} alt="Logo" hasPickedAmount={hasPickedAmount} />
            <InfoFrame pending={pending}>
              <Owned>
                <SockCount>You own {balanceSOCKSCLASSIC && `${amountFormatter(balanceSOCKSCLASSIC, 18, 0)}`}</SockCount>
                <p>Redeem SOCKSCLASSIC</p>
              </Owned>
              <IncrementToken
                initialValue={Number(amountFormatter(balanceSOCKSCLASSIC, 18, 0))}
                max={Number(amountFormatter(balanceSOCKSCLASSIC, 18, 0))}
              />
            </InfoFrame>
          </TopFrame>
          <Shim />
          <ButtonFrame
            className="button"
            disabled={false}
            text={'Next'}
            type={'cta'}
            onClick={() => {
              setNumberBurned(state.count)
              setHasPickedAmount(true)
            }}
          />
        </ConfirmedFrame>
      )
    } else if (!hasBurnt) {
      return (
        <ConfirmedFrame>
          <TopFrame hasPickedAmount={hasPickedAmount}>
            <RedeemControls closeCheckout={closeCheckout} type="confirm" />
            <InfoFrame hasPickedAmount={hasPickedAmount}>
              <ImgStyle src={nfc} alt="Logo" hasPickedAmount={hasPickedAmount} />
              <Owned>
                <p style={{ fontSize: '18px' }}>{state.count} Unisocks Classic NFT</p>
                <p style={{ fontSize: '14px', fontWeight: '500' }}>Digital Collectible (10kb)</p>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#AEAEAE',
                    marginTop: '16px',
                    marginRight: '16px',
                    wordBreak: 'break-all'
                  }}
                >
                  {account}
                </p>
              </Owned>
            </InfoFrame>
          </TopFrame>
          {/* <Back
            onClick={() => {
              setHasConfirmedAddress(false)
            }}
          >
            back
          </Back>
          <Count>2/3</Count>
          <CheckoutPrompt>BURN THE SOCKSCLASSIC?</CheckoutPrompt> */}
          <Shim />

          {shouldRenderUnlock ? (
            <ButtonFrame
              text={`Unlock SOCKSCLASSIC`}
              type={'cta'}
              pending={pending}
              onClick={() => {
                unlock({ address: REDEEM_ADDRESS, token: TOKEN_ADDRESSES.SOCKSCLASSIC }).then(({ hash }) => {
                  setCurrentTransaction(hash, TRADE_TYPES.UNLOCK, undefined)
                })
              }}
            />
          ) : (
            <ButtonFrame
              className="button"
              disabled={validationError !== null || (pending && transactionHash)}
              pending={pending}
              // text={pending ? `Waiting for confirmation...` : `Redeem ${numberBurned} SOCKSCLASSIC`}
              text={
                (getText(account, errorMessage, pending),
                pending ? `Waiting for confirmation...` : `Redeem ${numberBurned} SOCKSCLASSIC`)
              }
              type={'cta'}
              onClick={() => {
                burn(numberBurned.toString())
                  .then(response => {
                    setTransactionHash(response.hash)
                  })
                  .catch(() => {})
              }}
            />
          )}
          <Shim />
          <Back disabled={!!pending}>
            {pending ? (
              <EtherscanLink href={link('etherscan', transactionHash, networkId)} target="_blank" rel="noopener noreferrer">
                View on Etherscan.
              </EtherscanLink>
            ) : (
              <span
                onClick={() => {
                  setHasPickedAmount(false)
                }}
              >
                back
              </span>
            )}
          </Back>
        </ConfirmedFrame>
      )
    } else {
      return (
        <ConfirmedFrame>
          <TopFrame hasPickedAmount={hasPickedAmount}>
            <RedeemControls closeCheckout={closeCheckout} />
            <ImgStyle src={sent} alt="Logo" hasPickedAmount={hasPickedAmount} hasBurnt={hasBurnt} />
            <InfoFrame>
              <Owned>
                <p>You got socks!</p>
              </Owned>
            </InfoFrame>
          </TopFrame>
          <CheckoutPrompt>
            Estimated shipping time 2-3 minutes. <br /> Shipping time does not vary by region
          </CheckoutPrompt>
          <CheckoutPrompt>Your shipping details will be available soon.</CheckoutPrompt>
          <div style={{ margin: '16px 0 16px 16px' }}>
            {/* <EtherscanLink href={link('etherscan', transactionHash, networkId)} target="_blank" rel="noopener noreferrer">
              View on Etherscan.
            </EtherscanLink> */}
            <EtherscanLink href={link('opensea', account, networkId)} target="_blank" rel="noopener noreferrer">
              View on OpenSea.
            </EtherscanLink>
          </div>
        </ConfirmedFrame>
      )
    }
  }

  return (
    <>
      {renderContent()}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Confetti active={hasBurnt} config={config} />
      </div>
    </>
  )
}

const InfoFrame = styled.div`
  opacity: ${props => (props.pending ? 0.6 : 1)};
  width: 100%;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-top: ${props => (props.hasPickedAmount ? '8px' : '0')};
  justify-content: ${props => (props.hasPickedAmount ? 'flex-start' : 'space-between')};
  align-items: flex-end;
  padding: ${props => (props.hasPickedAmount ? '1rem 0 1rem 0' : ' 0')};
  /* padding: 1rem 0 1rem 0; */
  margin-top: 12px;
  /* margin-bottom: 8px; */
  /* margin-right: ${props => (props.hasPickedAmount ? '8px' : '0px')}; */

  border-radius: 6px;

  /* background-color: ${props => (props.hasPickedAmount ? '#000' : 'none')}; */
  border: ${props => (props.hasPickedAmount ? '1px solid #3d3d3d' : 'none')};
`

const Owned = styled.div`
  font-weight: 700;
  color: #efe7e4;
  font-size: 24px;
  margin-bottom: 12px;
  margin: 0px;
  white-space: pre-wrap;

  p {
    margin: 0;
  }
`

const Bonus = styled.div`
  font-weight: 500;
  font-size: 12px;
  padding: 4px;
  background-color: ${props => props.theme.uniswapPink};
  border-radius: 4px;
  position: absolute;
  top: 200px;
  left: 32px;
`

const ImgStyle = styled.img`
  width: ${props => (props.hasPickedAmount ? (props.hasBurnt ? '300px' : '120px') : '300px')};
  padding: ${props => (props.hasPickedAmount ? (props.hasBurnt ? '0px' : '0 1rem 0 0') : '2rem 0 2rem 0')};
  box-sizing: border-box;
`
const SockCount = styled.span`
  color: #aeaeae;
  font-weight: 400;
  font-size: 14px;
  width: 100%;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.uniswapPink};
`

const Back = styled.div`
  color: #aeaeae;
  font-weight: 400;
  margin: 0px;
  margin: -4px 0 16px 0px !important;
  font-size: 14px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* color: ${props => props.theme.uniswapPink}; */
  text-align: center;
  span {
    cursor: pointer;
  }
  span:hover {
    text-decoration: underline;
  }
`

const CheckoutPrompt = styled.p`
  font-weight: 500;
  font-size: 14px;
  margin: 24px 16px 0 16px !important;
  text-align: left;
  color: '#000';
  font-style: italic;
  width: 100%;
`

const RedeemFrame = styled(RedeemForm)`
  width: 100%;
`

const EtherscanLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.uniswapPink};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
`

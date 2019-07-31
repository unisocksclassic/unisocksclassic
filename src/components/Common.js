import React from 'react'
import styled from 'styled-components'
import Button from './Button'
import close from './Gallery/close.svg'
import closeDark from './Gallery/close_dark.svg'

export const ConfirmedFrame = styled.div`
  width: 100%;
  /* padding: 2rem; */
  box-sizing: border-box;
  font-size: 36px;
  font-weight: 500;
  /* line-height: 170%; */
  // text-align: center;
  padding: 16px;
`

export const Shim = styled.div`
  height: 20px;
`

export const TopFrame = styled.div`
  width: 100%;
  max-width: 375px;
  background: #000000;
  background: linear-gradient(162.92deg, #2b2b2b 12.36%, #000000 94.75%);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  color: white;
  // display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  // box-sizing: border-box;
  margin: -16px -16px 0px -16px;
`

export const ButtonFrame = styled(Button)`
  // margin: 16px;
  height: 48px;
  padding: 16px;
`

export const Close = styled.img.attrs(({ theme }) => ({
  src: theme === 'dark' ? closeDark : close,
  alt: 'Close'
}))`
  width: 16px;
  color: #fff;
  font-weight: 600;
  margin: 0px;
  /* margin-right: 2px;
  margin-top: -7px; */
  height: 16px;
  font-size: 16px;
  padding: 4px;
  cursor: pointer;
`

const FrameControls = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin: ${({ theme }) => (theme === 'dark' ? '-16px -16px 0px -16px' : '-24px -24px -40px -24px')};
  padding: ${({ theme }) => (theme === 'dark' ? '16px' : '24px')};
  background: ${({ theme }) => (theme === 'dark' ? '#fff' : 'none')};
`

const Unicorn = styled.p`
  color: ${props => (props.theme === 'dark' ? '#000' : '#fff')};
  font-weight: 600;
  margin: 0px;
  font-size: 16px;
`

export function Controls({ closeCheckout, theme, children = 'Pay' }) {
  return (
    <FrameControls theme={theme}>
      <Unicorn theme={theme}>
        <span role="img" aria-label="unicorn">
          🦄
        </span>{' '}
        {children}
      </Unicorn>
      <Close onClick={() => closeCheckout()} theme={theme} />
    </FrameControls>
  )
}

export const PopupContent = styled.div`
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0px;
}
`

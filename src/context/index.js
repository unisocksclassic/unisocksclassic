import React, { useState, useContext } from 'react'
import { useWeb3Context } from 'web3-react'

import { TRADE_TYPES, getTokenAddresses, getTokenSymbols } from '../utils'

export const AppContext = React.createContext([{}, () => {}])

const initialState = {
  visible: false,
  count: 1,
  valid: false,
  tradeType: TRADE_TYPES.BUY
}

export default function AppProvider({ children }) {
  const { networkId } = useWeb3Context()
  const tokenAddresses = getTokenAddresses(networkId)
  const [state, setState] = useState({
    ...initialState,
    tokenAddresses,
    tokenSymbols: getTokenSymbols(tokenAddresses),
    networkId
  })

  if (networkId !== state.networkId) {
    setState({
      tokenAddresses: getTokenAddresses(networkId),
      tokenSymbols: getTokenSymbols(tokenAddresses),
      networkId
    })
  }

  return <AppContext.Provider value={[state, setState]}>{children}</AppContext.Provider>
}

export function useAppContext() {
  return useContext(AppContext)
}

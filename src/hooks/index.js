import { useEffect, useState, useCallback, useMemo } from 'react'
import { useWeb3Context } from 'web3-react'

import {
  isAddress,
  getTokenContract,
  getRedeemContract,
  getExchangeContract,
  getTokenExchangeAddressFromFactory,
  getEtherBalance,
  getTokenBalance,
  getTokenSupply,
  getTokenAllowance,
  getRedeemAddress
} from '../utils'

export function useBlockEffect(functionToRun) {
  const { library } = useWeb3Context()

  useEffect(() => {
    if (library) {
      function wrappedEffect(blockNumber) {
        functionToRun(blockNumber)
      }
      library.on('block', wrappedEffect)
      return () => {
        library.removeListener('block', wrappedEffect)
      }
    }
  }, [library, functionToRun])
}

export function useTokenContract(tokenAddress, withSignerIfPossible = true) {
  const { library, account } = useWeb3Context()

  return useMemo(() => {
    try {
      return getTokenContract(tokenAddress, library, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [account, library, tokenAddress, withSignerIfPossible])
}

export function useRedeemContract(withSignerIfPossible = true) {
  const { library, account, networkId } = useWeb3Context()

  const redeemAddress = getRedeemAddress(networkId)

  return useMemo(() => {
    try {
      return getRedeemContract(redeemAddress, library, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [account, library, redeemAddress, withSignerIfPossible])
}

export function useExchangeContract(tokenAddress, withSignerIfPossible = true) {
  const { library, account, networkId } = useWeb3Context()

  const [exchangeAddress, setExchangeAddress] = useState()
  useEffect(() => {
    if (isAddress(tokenAddress)) {
      let stale = false
      getTokenExchangeAddressFromFactory(tokenAddress, library, account, networkId).then(exchangeAddress => {
        if (!stale) {
          setExchangeAddress(exchangeAddress)
        }
      })
      return () => {
        stale = true
        setExchangeAddress()
      }
    }
  }, [library, tokenAddress, networkId, account])

  return useMemo(() => {
    try {
      return getExchangeContract(exchangeAddress, library, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [exchangeAddress, library, withSignerIfPossible, account])
}

export function useAddressBalance(address, tokenAddress) {
  const { library } = useWeb3Context()

  const [balance, setBalance] = useState()

  const updateBalance = useCallback(() => {
    if (isAddress(address) && (tokenAddress === 'ETH' || isAddress(tokenAddress))) {
      let stale = false

      ;(tokenAddress === 'ETH' ? getEtherBalance(address, library) : getTokenBalance(tokenAddress, address, library))
        .then(value => {
          if (!stale) {
            setBalance(value)
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null)
          }
        })
      return () => {
        stale = true
        setBalance()
      }
    }
  }, [address, library, tokenAddress])

  useEffect(() => {
    return updateBalance()
  }, [updateBalance])

  useBlockEffect(updateBalance)

  return balance
}

export function useTokenSupply(tokenAddress) {
  const { library } = useWeb3Context()

  const [tokenSupply, setTokenSupply] = useState()

  const updateTokenSupply = useCallback(() => {
    if (isAddress(tokenAddress)) {
      let stale = false

      getTokenSupply(tokenAddress, library)
        .then(value => {
          if (!stale) {
            setTokenSupply(value)
          }
        })
        .catch(() => {
          if (!stale) {
            setTokenSupply(null)
          }
        })
      return () => {
        stale = true
        setTokenSupply()
      }
    }
  }, [library, tokenAddress])

  useEffect(() => {
    return updateTokenSupply()
  }, [updateTokenSupply])

  useBlockEffect(updateTokenSupply)

  return tokenSupply
}

export function useExchangeReserves(tokenAddress) {
  const exchangeContract = useExchangeContract(tokenAddress)

  const reserveETH = useAddressBalance(exchangeContract && exchangeContract.address, 'ETH')
  const reserveToken = useAddressBalance(exchangeContract && exchangeContract.address, tokenAddress)

  return { reserveETH, reserveToken }
}

export function useAddressAllowance(address, tokenAddress, spenderAddress) {
  const { library } = useWeb3Context()

  const [allowance, setAllowance] = useState()

  const updateAllowance = useCallback(() => {
    if (isAddress(address) && isAddress(tokenAddress) && isAddress(spenderAddress)) {
      let stale = false

      getTokenAllowance(address, tokenAddress, spenderAddress, library)
        .then(allowance => {
          if (!stale) {
            setAllowance(allowance)
          }
        })
        .catch(() => {
          if (!stale) {
            setAllowance(null)
          }
        })

      return () => {
        stale = true
        setAllowance()
      }
    }
  }, [address, library, spenderAddress, tokenAddress])

  useEffect(() => {
    return updateAllowance()
  }, [updateAllowance])

  useBlockEffect(updateAllowance)

  return allowance
}

export function useExchangeAllowance(address, tokenAddress) {
  const exchangeContract = useExchangeContract(tokenAddress)

  return useAddressAllowance(address, tokenAddress, exchangeContract && exchangeContract.address)
}

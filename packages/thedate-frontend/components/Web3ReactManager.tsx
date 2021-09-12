import useEagerConnect from '@/hooks/useEagerConnect';
import useInactiveListener from '@/hooks/useInactiveListener';
import { network, NetworkContextName } from '@/utils/connectors';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { active } = useWeb3React();
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName);

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // always activated network connector
  useEffect(() => {
    if (!networkActive && !networkError) {
      activateNetwork(network)
    }
  }, [networkActive, networkError, activateNetwork]);

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 600)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return <>no connection to ethernum</>;
  }

  // if neither context is active, spin
  if (!active && !networkActive) {
    return <>no connection to ethernum</>;
  }

  return children
}

import { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import {
  defaultNadoClient,
  buildSender,
  buildSignerField,
  buildTimestampNonce,
  HexString,
} from '../../lib/nado';

const SESSION_KEY_STORAGE = 'nado_session_key_v1';

export function useNadoSessionSigner() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [sessionKey, setSessionKey] = useState<HexString | null>(null);
  const [signerAddress, setSignerAddress] = useState<HexString | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY_STORAGE);
    if (stored) {
      try {
        const account = privateKeyToAccount(stored as HexString);
        setSessionKey(stored as HexString);
        setSignerAddress(account.address);
      } catch (e) {
        console.error('Failed to restore Nado session key:', e);
      }
    }
  }, []);

  const createAndLinkSessionKey = async () => {
    if (!address || !walletClient) {
      throw new Error('Wallet not connected');
    }

    setIsLinking(true);
    setError(null);

    try {
      const newPrivateKey = generatePrivateKey();
      const newAccount = privateKeyToAccount(newPrivateKey);

      const sender = buildSender(address);
      const signerField = buildSignerField(newAccount.address);
      const nonce = buildTimestampNonce();

      const linkStruct = {
        sender,
        signer: signerField,
        nonce,
      };

      await defaultNadoClient.linkSigner(
        walletClient,
        address as HexString,
        linkStruct
      );

      localStorage.setItem(SESSION_KEY_STORAGE, newPrivateKey);
      setSessionKey(newPrivateKey);
      setSignerAddress(newAccount.address);

      return newAccount.address;
    } catch (err: any) {
      const msg = err.message || 'Failed to link session key';
      setError(msg);
      throw err;
    } finally {
      setIsLinking(false);
    }
  };

  const revokeSessionKey = async () => {
    if (!address || !walletClient) {
      throw new Error('Wallet not connected');
    }

    setIsLinking(true);
    setError(null);

    try {
      const sender = buildSender(address);
      const revocationSignerField = buildSignerField(); // 32 zero bytes
      const nonce = buildTimestampNonce();

      const linkStruct = {
        sender,
        signer: revocationSignerField,
        nonce,
      };

      await defaultNadoClient.linkSigner(
        walletClient,
        address as HexString,
        linkStruct
      );

      localStorage.removeItem(SESSION_KEY_STORAGE);
      setSessionKey(null);
      setSignerAddress(null);
    } catch (err: any) {
      const msg = err.message || 'Failed to revoke session key';
      setError(msg);
      throw err;
    } finally {
      setIsLinking(false);
    }
  };

  return {
    sessionKey,
    signerAddress,
    isSessionActive: !!sessionKey,
    createAndLinkSessionKey,
    revokeSessionKey,
    isLinking,
    error,
  };
}

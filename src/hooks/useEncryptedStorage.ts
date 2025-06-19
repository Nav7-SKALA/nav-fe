import { useCallback } from 'react';
import CryptoJS from 'crypto-js';

const key = process.env.REACT_APP_ENCRYPTION_KEY;
if (!key) {
  throw new Error('ENCRYPTION_KEY is not defined!');
}
const ENCRYPTION_KEY = key;

/**
 * Generic encrypted localStorage hook
 * @param storageKey localStorage key (ex: 'encrypted-projects', 'encrypted-experiences', 'encrypted-certificates')
 */
export const useEncryptedStorage = <T>(storageKey: string) => {
  const saveEncryptedData = useCallback(
    (data: T[]) => {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
      localStorage.setItem(storageKey, encrypted);
    },
    [storageKey]
  );

  const loadEncryptedData = useCallback((): T[] => {
    const encrypted = localStorage.getItem(storageKey);
    if (!encrypted) return [];

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (e) {
      console.error(`복호화 실패 (${storageKey}):`, e);
      return [];
    }
  }, [storageKey]);

  const removeEncryptedData = useCallback(() => {
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  const removeEncryptedItemByIndex = useCallback(
    (index: number) => {
      const currentData = loadEncryptedData();
      if (index < 0 || index >= currentData.length) return;

      const updatedData = [...currentData.slice(0, index), ...currentData.slice(index + 1)];
      saveEncryptedData(updatedData);
    },
    [loadEncryptedData, saveEncryptedData]
  );

  return { saveEncryptedData, loadEncryptedData, removeEncryptedData, removeEncryptedItemByIndex };
};

import { useState } from 'react';

export function useLocalStorage(storageKey, defaultValue) {
  const [storageValue, _setStorageValue] = useState(defaultValue);
  const [timeStamp, setTimeStamp] = useState(null);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(storageKey);
      if (storedValue) {
        const parsed = JSON.parse(storedValue);
        const isValid = Object.keys(defaultValue).every(
          (key) => parsed.values[key] !== undefined
        );
        // Validate that the storage has all the keys set by the default state.
        // Otherwise, do not use the saved state.
        if (isValid) {
          _setStorageValue(parsed.values);
          setTimeStamp(parsed.timestamp);
        } else {
          _setStorageValue(defaultValue);
          setTimeStamp(null);
        }
      }
    } catch (error) {
      console.warn(`Could not parse existing form state: ${error}`);
    }
  }, [storageKey, defaultValue]);

  const setStorageValue = (values) => {
    const timestamp = Date.now();
    setTimeStamp(timestamp);
    // Save the form state
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ values, timestamp })
    );
  };

  return [storageValue, timeStamp, setStorageValue];
}

import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppStateChange(onForeground: () => void): void {
  const savedCallback = useRef(onForeground);

  useEffect(() => {
    savedCallback.current = onForeground;
  }, [onForeground]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        savedCallback.current();
      }
    });

    return () => subscription.remove();
  }, []);
}

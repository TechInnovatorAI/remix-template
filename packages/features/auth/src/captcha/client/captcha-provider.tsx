'use client';

import { createContext, useCallback, useRef, useState } from 'react';

import { TurnstileInstance } from '@marsidev/react-turnstile';

export const Captcha = createContext<{
  token: string;
  setToken: (token: string) => void;
  instance: TurnstileInstance | null;
  setInstance: (ref: TurnstileInstance) => void;
}>({
  token: '',
  instance: null,
  setToken: (_: string) => {
    // do nothing
    return '';
  },
  setInstance: () => {
    // do nothing
  },
});

export function CaptchaProvider(props: { children: React.ReactNode }) {
  const [token, setToken] = useState<string>('');
  const instanceRef = useRef<TurnstileInstance | null>(null);

  const setInstance = useCallback((ref: TurnstileInstance) => {
    instanceRef.current = ref;
  }, []);

  return (
    <Captcha.Provider
      value={{ token, setToken, instance: instanceRef.current, setInstance }}
    >
      {props.children}
    </Captcha.Provider>
  );
}

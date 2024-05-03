import { useContext, useMemo } from 'react';

import { Captcha } from './captcha-provider';

/**
 * @name useCaptchaToken
 * @description A hook to get the captcha token and reset function
 * @returns The captcha token and reset function
 */
export function useCaptchaToken() {
  const context = useContext(Captcha);

  if (!context) {
    throw new Error(`useCaptchaToken must be used within a CaptchaProvider`);
  }

  return useMemo(() => {
    return {
      captchaToken: context.token,
      resetCaptchaToken: () => context.instance?.reset(),
    };
  }, [context]);
}

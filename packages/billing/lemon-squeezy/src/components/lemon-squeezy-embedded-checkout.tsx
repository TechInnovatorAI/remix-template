'use client';

import { useEffect } from 'react';

interface LemonSqueezyWindow extends Window {
  createLemonSqueezy: () => void;
  LemonSqueezy: {
    Setup: (options: {
      eventHandler: (event: { event: string }) => void;
    }) => void;
    Refresh: () => void;
    Url: {
      Open: (url: string) => void;
      Close: () => void;
    };
  };
}

export function LemonSqueezyEmbeddedCheckout(props: {
  checkoutToken: string;
  onClose?: () => void;
}) {
  useLoadScript(props.checkoutToken, props.onClose);

  return null;
}

function useLoadScript(
  checkoutToken: string,
  onClose: (() => void) | undefined,
) {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://app.lemonsqueezy.com/js/lemon.js';

    script.onload = () => {
      const win = window as unknown as LemonSqueezyWindow;

      win.createLemonSqueezy();
      win.LemonSqueezy.Url.Open(checkoutToken);

      if (onClose) {
        win.LemonSqueezy.Setup({
          eventHandler: (event) => {
            if (event.event === 'PaymentMethodUpdate.Closed') {
              onClose();
            }
          },
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [checkoutToken, onClose]);
}

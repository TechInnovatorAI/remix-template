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

export function LemonSqueezyEmbeddedCheckout(props: { checkoutToken: string }) {
  useLoadScript(props.checkoutToken);

  return null;
}

function useLoadScript(checkoutToken: string) {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://app.lemonsqueezy.com/js/lemon.js';

    script.onload = () => {
      const win = window as unknown as LemonSqueezyWindow;

      win.createLemonSqueezy();
      win.LemonSqueezy.Url.Open(checkoutToken);
    };

    document.body.appendChild(script);
  }, [checkoutToken]);
}

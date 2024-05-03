'use client';

import { createRef, useEffect, useRef } from 'react';

import type { LoadingBarRef } from 'react-top-loading-bar';
import LoadingBar from 'react-top-loading-bar';

export function TopLoadingBarIndicator() {
  const ref = createRef<LoadingBarRef>();
  const runningRef = useRef(false);

  useEffect(() => {
    if (!ref.current || runningRef.current) {
      return;
    }

    const loadingBarRef = ref.current;

    loadingBarRef.continuousStart(0, 250);
    runningRef.current = true;

    return () => {
      loadingBarRef.complete();
      runningRef.current = false;
    };
  }, [ref]);

  return (
    <LoadingBar
      className={'bg-primary'}
      height={4}
      waitingTime={0}
      shadow
      color={''}
      ref={ref}
    />
  );
}

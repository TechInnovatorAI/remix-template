import React from 'react';

import { Heading } from '../../shadcn/heading';
import { cn } from '../../utils';
import { HeroTitle } from './hero-title';

interface HeroProps {
  pill?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  cta?: React.ReactNode;
  image?: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function Hero({
  pill,
  title,
  subtitle,
  cta,
  image,
  className,
  animate = true,
}: HeroProps) {
  return (
    <div className={cn('mx-auto flex flex-col space-y-20', className)}>
      <div
        className={cn(
          'mx-auto flex flex-1 flex-col items-center justify-center md:flex-row',
          {
            ['duration-1000 animate-in fade-in zoom-in-90 slide-in-from-top-36']:
              animate,
          },
        )}
      >
        <div className="flex w-full flex-1 flex-col items-center space-y-6 xl:space-y-8 2xl:space-y-10">
          {pill && (
            <div
              className={cn({
                ['delay-300 duration-700 animate-in fade-in fill-mode-both']:
                  animate,
              })}
            >
              {pill}
            </div>
          )}

          <div className="flex flex-col items-center space-y-8">
            <HeroTitle>{title}</HeroTitle>

            {subtitle && (
              <div className="flex max-w-2xl flex-col space-y-1">
                <Heading
                  level={3}
                  className="p-0 text-center font-sans text-base font-normal"
                >
                  {subtitle}
                </Heading>
              </div>
            )}
          </div>

          {cta && (
            <div
              className={cn({
                ['delay-500 duration-1000 animate-in fade-in fill-mode-both']:
                  animate,
              })}
            >
              {cta}
            </div>
          )}
        </div>
      </div>

      {image && (
        <div
          className={cn('mx-auto flex max-w-[85rem] justify-center py-8', {
            ['delay-300 duration-1000 animate-in fade-in zoom-in-95 slide-in-from-top-32 fill-mode-both']:
              animate,
          })}
        >
          {image}
        </div>
      )}
    </div>
  );
}

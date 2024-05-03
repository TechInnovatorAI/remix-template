import type { Config } from 'tailwindcss';

import baseConfig from '@kit/tailwind-config';

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...baseConfig.content],
  presets: [baseConfig],
} satisfies Config;

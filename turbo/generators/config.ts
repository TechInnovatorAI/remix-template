import type { PlopTypes } from '@turbo/gen';

import { createCloudflareGenerator } from './templates/cloudflare/generator';
import { createEnvironmentVariablesGenerator } from './templates/env/generator';
import { createPackageGenerator } from './templates/package/generator';
import { createEnvironmentVariablesValidatorGenerator } from './templates/validate-env/generator';

// List of generators to be registered
const generators = [
  createPackageGenerator,
  createCloudflareGenerator,
  createEnvironmentVariablesGenerator,
  createEnvironmentVariablesValidatorGenerator,
];

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  generators.forEach((gen) => gen(plop));
}

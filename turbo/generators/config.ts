import type { PlopTypes } from '@turbo/gen';

import { createCloudflareGenerator } from './templates/cloudflare/generator';
import { createPackageGenerator } from './templates/package/generator';

// List of generators to be registered
const generators = [createPackageGenerator, createCloudflareGenerator];

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  generators.forEach((gen) => gen(plop));
}

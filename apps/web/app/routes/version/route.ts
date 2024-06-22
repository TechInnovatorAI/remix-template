// please provide your own implementation
// if you're not using Vercel or Cloudflare Pages
const KNOWN_GIT_ENV_VARS = [
  'CF_PAGES_COMMIT_SHA',
  'VERCEL_GIT_COMMIT_SHA',
  'GIT_HASH',
];

export const loader = async () => {
  const currentGitHash = await getGitHash();

  return new Response(currentGitHash, {
    headers: {
      'content-type': 'text/plain',
    },
  });
};

function getGitHash() {
  for (const envVar of KNOWN_GIT_ENV_VARS) {
    if (process.env[envVar]) {
      return process.env[envVar];
    }
  }

  return getHashFromProcess();
}

async function getHashFromProcess() {
  const { execSync } = await import('child_process');

  return execSync('git log --pretty=format:"%h" -n1').toString().trim();
}

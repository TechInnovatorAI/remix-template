import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// set gcTime to 0 on the server
// as we cannot invalidate the cache on the server
const isServer = typeof document === 'undefined';
const gcTime = isServer ? 0 : undefined;
const staleTime = isServer ? undefined : 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime,
      staleTime,
    },
  },
});

export function ReactQueryProvider(props: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}

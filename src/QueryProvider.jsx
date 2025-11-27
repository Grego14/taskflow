import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet } from 'react-router-dom'

const queryClient = new QueryClient()

export default function QueryProvider({ userId }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Outlet />
    </QueryClientProvider>
  )
}

/* eslint-disable react-hooks/set-state-in-effect */
"use client";  // ← This marks it as a Client Component (runs in the browser)

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { store } from "@/store/store";
import { lightTheme, darkTheme } from "@/styles/theme";
import { useAppSelector } from "@/store/store";

// Inner component to access Redux state for theme
export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const isDark = useAppSelector((state) => state.theme.isDark);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🚨 Prevent SSR mismatch
  if (!mounted) return null;

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  // QueryClient must be created inside component (not at module level)
  // to work correctly with Next.js server-side rendering
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,      // data stays fresh for 1 minute
            retry: 1,                   // retry failed requests once
            refetchOnWindowFocus: false,// don't refetch on tab switch
          },
        },
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
        {/* Dev tools — shows query cache in browser (only in development) */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
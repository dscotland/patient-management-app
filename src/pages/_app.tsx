// pages/_app.js
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps, type AppType } from "next/app";
import { Amplify } from 'aws-amplify';
import { PageWithLayout } from "../modules/Layout";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

type AppPropsWithLayout = AppProps & {
  Component: PageWithLayout;
};

const queryClient = new QueryClient()

function MyApp({ Component, pageProps: { session, ...pageProps } }:AppPropsWithLayout) {
  Amplify.configure({
    Auth: {
      userPoolId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_ID,
      userPoolWebClientId: process.env.NEXT_PUBLIC_AUTH_WEB_CLIENT_ID,
    },
  });

  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
          <ChakraProvider>
            {getLayout(<Component {...pageProps} />)}
          </ChakraProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default MyApp;
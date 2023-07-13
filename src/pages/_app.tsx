// pages/_app.js
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps, type AppType } from "next/app";
import { Amplify } from 'aws-amplify';
import { PageWithLayout } from "../modules/Layout";
import { SessionProvider } from "next-auth/react";

type AppPropsWithLayout = AppProps & {
  Component: PageWithLayout;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }:AppPropsWithLayout) {
  Amplify.configure({
    Auth: {
      userPoolId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_ID,
      userPoolWebClientId: process.env.NEXT_PUBLIC_AUTH_WEB_CLIENT_ID,
    },
  });

  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        {getLayout(<Component {...pageProps} />)}
      </ChakraProvider>
    </SessionProvider>
  )
}

export default MyApp;
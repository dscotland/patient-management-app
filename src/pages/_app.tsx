// pages/_app.js
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps, type AppType } from "next/app";
import { Amplify } from 'aws-amplify';

function MyApp({ Component, pageProps }:AppProps) {
  Amplify.configure({
    Auth: {
      userPoolId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_ID,
      userPoolWebClientId: process.env.NEXT_PUBLIC_AUTH_WEB_CLIENT_ID,
    },
  });
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp;
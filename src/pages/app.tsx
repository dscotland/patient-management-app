import {
    Box,
    Button,
    Container,
    Heading,
    Image,
    Spacer,
    Text,
    VStack,
    Center
  } from "@chakra-ui/react";
  import Head from "next/head";
  import React from "react";
  import Layout from "../components/Layout/Layout";
  import { PageWithLayout } from "../modules/Layout";
  import Router from "next/router";
  import { AuthenticatePatient } from "../lib/ProtectedRoute";
  import MainAppointment from "../components/appointments/MainAppointment";
  
  const Home: PageWithLayout = () => {
    return (
      <>
        <Head>
          <title>PM Home Page</title>
          <meta name="PM Home page" content="PM Home page" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Center>
            <Box w={"90%"} pt={10}>
                <MainAppointment/>
            </Box>
        </Center>
      </>
    );
  };
  
  Home.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
  };
  
  export default Home;
  
  export async function getServerSideProps(context: any) {
    return await AuthenticatePatient(context);
  }
  
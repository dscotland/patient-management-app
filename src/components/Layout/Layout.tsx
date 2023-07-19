import {
    Center,
    Spinner,
} from "@chakra-ui/react";

import {  useSession } from "next-auth/react";
import Navbar from "./Navbar";

const Layout = ({ children }: any) => {
    const { data: user, status } = useSession();

    if (status === "loading" || !user) {
    return (
        <Center h={"100vh"}>
            <Spinner color="blue.400" />
        </Center>
    );
    }

    return (
        <>
            <Navbar/>
            {children}
        </>
      );
}

export default Layout;
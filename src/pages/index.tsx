import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    chakra,
    Alert,
    AlertIcon,
    AlertTitle,
    FormErrorMessage,
  } from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
  
  export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, isLoading] = useState(false);
    const [calledPush, setCalledPush] = useState(false);
    const { data: user, status } = useSession();


    const [loginErrorObject, showLoginError] = useState({
        isError: false,
        errorMessage: "",
    });

    useEffect(() => {
        if (user && status === "authenticated") {
            if (calledPush) {
                return; // no need to call router.push() again
            }
            router.push("/app");
            setCalledPush(true); // <-- toggle 'true' after first redirect
        }
    }, [(status === "authenticated") && user]);

    async function Login(username: string, password: string) {
        isLoading(true);
    
        const user = await signIn("credentials", {
          redirect: false,
          email: username,
          password: password,
        });
        if (user?.error === null) {
          router.push("/app");
        }
        if (user?.error === "User does not exist.") {
          showLoginError({
            isError: true,
            errorMessage: "Invalid username or password!",
          });
        }
        if (user?.error === "User is not confirmed.") {
          showLoginError({
            isError: true,
            errorMessage: "Invalid username or password!",
          });
        }
        if (user?.error === "Password attempts exceeded") {
          showLoginError({
            isError: true,
            errorMessage:
              "Too many login attempts. Your account is now locked for 15 mins. If you still need help, please contact info@ncight.com",
          });
        }
        if (user?.error === "Incorrect username or password.") {
          showLoginError({
            isError: true,
            errorMessage: "Invalid username or password!",
          });
        }
        isLoading(false);
      }


    const onSubmit = (data: any) => {
        Login(data.email, data.password);
    };

    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <chakra.form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Sign in to your account</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              and start scheduling appointments today
            </Text>
          </Stack>
          {loginErrorObject.isError ? (
                <Alert variant="solid" status="error" justifyContent={"center"}>
                  <AlertIcon />
                  <AlertTitle>{loginErrorObject.errorMessage}</AlertTitle>
                </Alert>
              ) : null}
          <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email" isRequired isInvalid={Boolean(errors.email)}>
              <FormLabel>Email address</FormLabel>
              <Input 
                type="email"
                {...register("email", { required: "Email is required" })}
              />
                <FormErrorMessage>
                <>{errors.email && errors.email.message}</>
                </FormErrorMessage>
            </FormControl>
            <FormControl id="password" isRequired isInvalid={Boolean(errors.password)}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input 
                    type={showPassword ? 'text' : 'password'}
                    {...register("password", { required: "Password is required" })}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                    <>{errors.password && errors.password.message}</>
              </FormErrorMessage>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Signing in"
                isLoading={loading}
                size="lg"
                type="submit"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Dont have an account? <Link href='/signup' color={'blue.400'}>Signup</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
        </Stack>
        </chakra.form>
      </Flex>
    );
  }
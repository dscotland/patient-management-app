import { Center, Heading } from '@chakra-ui/react';
import {
  Button,
  FormControl,
  Flex,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  FormErrorMessage,
  chakra,
  useToast
} from '@chakra-ui/react';
import { PinInput, PinInputField } from '@chakra-ui/react';
import { useForm, Controller } from "react-hook-form";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function VerifyEmailForm(): JSX.Element {

    const {
        handleSubmit,
        control,
        unregister,
        reset,
        formState: { errors },
    } = useForm();
    const [loading, isLoading] = useState(false);
    const [resendLoading, isResendLoading] = useState(false);
    const router = useRouter();
    const { email }:any = router.query;
    const toast = useToast();

    const onSubmit = (data: any) => {
        confirmSignUp(
          decodeURIComponent(
            new URLSearchParams(window.location.search).get("email") || ""
          ),
          data.confirmation_code
        );
    };

    async function confirmSignUp(username: string, confirmationCode: string) {
        isLoading(true);
        try {
          const confirmUser = await Auth.confirmSignUp(username, confirmationCode);
          if (confirmUser) {
            toast({
                title: "Account verified!",
                description: "You will be redirected to the login page shortly",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
          }
          isLoading(false);
          unregister("confirmation_code");
          setTimeout(()=>{router.push("/")},4000);
        } catch (error:any) {
            if(error.message === "Invalid verification code provided, please try again."){
                toast({
                    title: "Something went wrong!",
                    description: "You entered an invalid verification code. Please try again or get a new code",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                });
            } else {
                toast({
                    title: "Something went wrong!",
                    description: "We can't verify your account at this time. Please try again later",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                });
            }
          unregister("confirmation_code");
        }
        isLoading(false);

    }

    async function resendConfirmationCode(username: string) {
        isResendLoading(true);
        try {
          await Auth.resendSignUp(username);
          toast({
            title: "Email resent!",
            description: "Please check your inbox for a new verification code",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        } catch (err) {
          toast({
            title: "Error",
            description: "We had a problem resending code. Please try again later",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        }
        isResendLoading(false);
      }



    return (
        <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <chakra.form onSubmit={handleSubmit(onSubmit)}>
        <Stack
            spacing={4}
            w={'full'}
            maxW={'sm'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'xl'}
            boxShadow={'lg'}
            p={6}
            my={10}>
            <Center>
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                Verify your Email
            </Heading>
            </Center>
            <Center
            fontSize={{ base: 'sm', sm: 'md' }}
            color={useColorModeValue('gray.800', 'gray.400')}>
            We have sent a verification code to your email
            </Center>
            <Center
            fontSize={{ base: 'sm', sm: 'md' }}
            fontWeight="bold"
            color={useColorModeValue('gray.800', 'gray.400')}>
                {`${email}`}
            </Center>
            <Center
            fontSize={{ base: 'sm', sm: 'md' }}
            color={useColorModeValue('gray.800', 'gray.400')}>
            Please enter the code below
            </Center>
                <Controller
                control={control}
                name="confirmation_code"
                rules={{
                    required: {
                    value: true,
                    message: "Please enter your verification code",
                    },
                }}
                render={({ field: { ref, ...rest } }) => (
                    <FormControl isInvalid={errors.confirmation_code != null}>
                    <Center>
                        <HStack>
                        <PinInput otp {...rest} size={"lg"}>
                            <PinInputField
                            borderColor={
                                errors.confirmation_code != null ? "red" : ""
                            }
                            />
                            <PinInputField
                            borderColor={
                                errors.confirmation_code != null ? "red" : ""
                            }
                            />
                            <PinInputField
                            borderColor={
                                errors.confirmation_code != null ? "red" : ""
                            }
                            />
                            <PinInputField
                            borderColor={
                                errors.confirmation_code != null ? "red" : ""
                            }
                            />
                            <PinInputField
                            borderColor={
                                errors.confirmation_code != null ? "red" : ""
                            }
                            />
                            <PinInputField
                            borderColor={
                                errors.confirmation_code != null ? "red" : ""
                            }
                            />
                        </PinInput>
                        </HStack>
                    </Center>
                    <Center>
                        <FormErrorMessage>
                        <>{errors.confirmation_code?.message}</>
                        </FormErrorMessage>
                    </Center>
                    </FormControl>
                )}
                />

                <Center>
                <Stack spacing={4} pt={"5"} w={"full"}>
                    <Button
                        bg={'blue.400'}
                        color={'white'}
                        type="submit"
                        w={"inherit"}
                        isLoading={loading}
                        _hover={{
                        bg: 'blue.500',
                    }}>
                        Verify
                    </Button>
                    <Button
                        bg={'blue.400'}
                        color={'white'}
                        onClick={()=>{resendConfirmationCode(email)}}
                        w={"inherit"}
                        isLoading={resendLoading}
                        _hover={{
                        bg: 'blue.500',
                    }}>
                        Resend Verification
                    </Button>
                </Stack>
                </Center>
            
        </Stack>
        </chakra.form>
        </Flex>
  );
}
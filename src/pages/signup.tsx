import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    chakra,
    useToast,
    FormHelperText,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { CheckIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  import { Auth } from 'aws-amplify';
  import { v4 as uuidv4 } from 'uuid';
  import { useForm } from "react-hook-form";
  import axios from 'axios';
  import { AiOutlineClose } from "react-icons/ai";

  type SignUpParameters = {
    password: string;
    email: string;
    phone_number: string;
    family_name: string;
    given_name: string;
    ip_address: string;
  };
  
  export default function Login() {

    const {
        register,
        reset,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const watchPassword = watch("password","");
    const toast = useToast();


    function formatPhoneNumber(phone_number: string) {
        const cleanPhoneNumber = phone_number.replaceAll("-", "");
        const finalPhoneNumber = "+1" + cleanPhoneNumber;
        return finalPhoneNumber;
    }


    async function signUp({password, email, phone_number, family_name, given_name, ip_address }: SignUpParameters) {
        try {
          const { user } = await Auth.signUp({
            username:email,
            password,
            attributes: {
                email,
                phone_number,
                family_name,
                given_name,
                "custom:userId": uuidv4(),
                "custom:ipAddress": ip_address
              },
              clientMetadata: {
                groupName: "Patient"
              }
          });

          if(user){
            toast({
                title: "Email sent!",
                description: "Please check your inbox for a verification code and further instructions",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
              });
              reset({password:"",email:"",phone_number:"",first_name:"",last_name:""});
          }
        } catch (error) {
            toast({
                title: "Something went wrong!",
                description: "We weren't able to create your user at this time! Try again later",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
              });
          reset({password:"",email:"",phone_number:"",first_name:"",last_name:""});
        }
    }

    const onSubmit = async (data: any) => {
        const response = await axios.get('https://geolocation-db.com/json/');
        const email:string = data.email;
        const password:string = data.password;
        const phone_number:string = formatPhoneNumber(data.phone_number)
        const family_name:string = data.last_name;
        const given_name:string = data.first_name;
        const ip_address:string = response.data['IPv4'];

        const user:SignUpParameters = {
            email,
            password,
            phone_number,
            family_name,
            given_name,
            ip_address
        }
        signUp(user);
    };

    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Signup for your account</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              and start scheduling appointments today
            </Text>
          </Stack>
          <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
            <chakra.form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={6}>
            <HStack>
              <Box>
                <FormControl 
                    id="firstName" 
                    isRequired
                    isInvalid={Boolean(errors.first_name)}
                >
                  <FormLabel>First Name</FormLabel>
                  <Input 
                    type="text" 
                    {...register("first_name", {
                        required: "Please enter your first name",
                    })}
                  />
                  <FormErrorMessage>
                  <> {errors.first_name && errors.first_name.message}</>
                </FormErrorMessage>
                </FormControl>
              </Box>
              <Box>
                <FormControl 
                    id="lastName" 
                    isRequired
                    isInvalid={Boolean(errors.last_name)}
                >
                  <FormLabel>Last Name</FormLabel>
                  <Input 
                    type="text" 
                    {...register("last_name", {
                        required: "Please enter your last name",
                    })}
                  />
                  <FormErrorMessage>
                    <> {errors.last_name && errors.last_name.message}</>
                  </FormErrorMessage>
                </FormControl>
              </Box>
            </HStack>
            <FormControl 
                id="phoneNumber" 
                isRequired
                isInvalid={Boolean(errors.phone_number)}
            >
              <FormLabel>Phone Number</FormLabel>
              <Input 
                type="tel"
                placeholder="1234567890" 
                {...register("phone_number", {
                    required: "Please enter your phone number",
                    minLength: {
                        value: 10,
                        message: "Phone number can't be less than 10 digits",
                      },
                      maxLength: {
                        value: 13,
                        message: "Phone number can't be greater than 13 digits",
                      },
                })}
               />
               <FormErrorMessage>
                <> {errors.phone_number && errors.phone_number.message}</>
               </FormErrorMessage>
            </FormControl>
            <FormControl 
                id="email" 
                isRequired
                isInvalid={Boolean(errors.email)}
            >
              <FormLabel>Email address</FormLabel>
              <Input 
                type="email"
                placeholder="example@pm.com" 
                {...register("email", {
                    required: "Please enter your email address",
                    pattern: {
                      value:
                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Email format is incorrect",
                    },
                  })}
              />
                <FormErrorMessage>
                    <> {errors.email && errors.email.message}</>
               </FormErrorMessage>
            </FormControl>
            <FormControl 
                id="password" 
                isRequired
                isInvalid={Boolean(errors.password)}
            >
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input 
                    type={showPassword ? 'text' : 'password'} 
                    {...register("password", {
                        required: "Please enter your password",
                    })}
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
                <> {errors.password && errors.password.message}</>
               </FormErrorMessage>
               <FormHelperText >
              <HStack>
                {watchPassword?.length < 8 ? (
                  <AiOutlineClose color="#E53E3E" />
                ) : (
                  <CheckIcon color={"green.500"} />
                )}
                <Text
                  color={watchPassword?.length < 8 ? "red.500" : "green.500"}
                >
                  at least 8 characters
                </Text>
              </HStack>
            </FormHelperText>
            <FormHelperText >
              <HStack>
                {!RegExp("(.*[A-Z].*)").test(watchPassword) ? (
                  <AiOutlineClose color="#E53E3E" />
                ) : (
                  <CheckIcon color={"green.500"} />
                )}
                <Text
                  color={
                    !RegExp("(.*[A-Z].*)").test(watchPassword)
                      ? "red.500"
                      : "green.500"
                  }
                >
                  at least 1 uppercase letter
                </Text>
              </HStack>
            </FormHelperText>
            <FormHelperText >
              <HStack>
                {!RegExp("(.*[a-z].*)").test(watchPassword) ? (
                  <AiOutlineClose color="#E53E3E" />
                ) : (
                  <CheckIcon color={"green.500"} />
                )}
                <Text
                  color={
                    !RegExp("(.*[a-z].*)").test(watchPassword)
                      ? "red.500"
                      : "green.500"
                  }
                >
                  at least 1 lowercase letter
                </Text>
              </HStack>
            </FormHelperText>
            <FormHelperText>
              <HStack>
                {!RegExp("([^A-Za-z0-9])").test(watchPassword) ? (
                  <AiOutlineClose color="#E53E3E" />
                ) : (
                  <CheckIcon color={"green.500"} />
                )}
                <Text
                  color={
                    !RegExp("([^A-Za-z0-9])").test(watchPassword)
                      ? "red.500"
                      : "green.500"
                  }
                >
                  at least 1 special character
                </Text>
              </HStack>
            </FormHelperText>
            <FormHelperText>
              <HStack>
                {!RegExp(".*[0-9].*").test(watchPassword) ? (
                  <AiOutlineClose color="#E53E3E" />
                ) : (
                  <CheckIcon color={"green.500"} />
                )}
                <Text
                  color={
                    !RegExp(".*[0-9].*").test(watchPassword)
                      ? "red.500"
                      : "green.500"
                  }
                >
                  at least 1 number
                </Text>
              </HStack>
            </FormHelperText>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Creating account"
                type="submit"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already have an account? <Link href="/" color={'blue.400'}>Login</Link>
              </Text>
            </Stack>
            
          </Stack>
          </chakra.form>
        </Box>
        </Stack>
      </Flex>
    );
  }

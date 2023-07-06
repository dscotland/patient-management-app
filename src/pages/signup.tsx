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
    chakra
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  import { Auth } from 'aws-amplify';
  import { v4 as uuidv4 } from 'uuid';
  import { useForm, Controller } from "react-hook-form";

  type SignUpParameters = {
    password: string;
    email: string;
    phone_number: string;
    family_name: string;
    given_name: string;

  };
  
  export default function Login() {

    const {
        register,
        control,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);

    function formatPhoneNumber(phone_number: string) {
        const cleanPhoneNumber = phone_number.replaceAll("-", "");
        const finalPhoneNumber = "+1" + cleanPhoneNumber;
        return finalPhoneNumber;
    }

    const onSubmit = (data: any) => {
        console.log('came here');
        const email:string = data.email;
        const password:string = data.password;
        const phone_number:string = formatPhoneNumber(data.phone_number)
        const family_name:string = data.last_name
        const given_name:string = data.first_name

        const user:SignUpParameters = {
            email,
            password,
            phone_number,
            family_name,
            given_name
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
          <Stack spacing={4}>
            <chakra.form onSubmit={handleSubmit(onSubmit)}>
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
                {...register("phone_number", {
                    required: "Please enter your phone number",
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
                {...register("email", {
                    required: "Please enter your email address",
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
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
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
            </chakra.form>
          </Stack>
        </Box>
        </Stack>
      </Flex>
    );
  }
  
async function signUp({password, email, phone_number, family_name, given_name }: SignUpParameters) {
    console.log(password, email, phone_number, family_name, given_name);
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
          },
      });
      console.log(user);
    } catch (error) {
      console.log('error signing up:', error);
    }
}
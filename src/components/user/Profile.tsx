import { Modal, 
    ModalContent, 
    ModalHeader, 
    ModalCloseButton, 
    ModalBody, 
    ModalFooter, 
    Button, 
    ModalOverlay, 
    useDisclosure, 
    Text, 
    Box,
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    Stack,
    Spacer,
    useToast
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
 

interface ProfileProps {
    isOpen: boolean
    onClose: any
}

interface UserProfileData {
    firstName: string
    lastName: string
    phoneNumber: string
}

export default function UserProfile(props:ProfileProps) {
    const {
        register,
        control,
        reset,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();
    const { data: user } = useSession();
    
    const Overlay = () => (
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px)'
          w={'full'}
        />
    );

    const [userProfileData, setUserProfileData] = React.useState<UserProfileData>({firstName:"",lastName:"",phoneNumber:""});
    const [updateLoading, setUpdateLoading] = React.useState(false);
    const [deleteLoading, setDeleteLoading] = React.useState(false);
    const toast = useToast();
    const router = useRouter();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        setUpdateLoading(true)
        axios.get("https://6fn0up8v71.execute-api.us-east-1.amazonaws.com/prod/user/getUserFn",{
            headers: {
              Authorization: `Bearer ${user?.user.signInUserSession.idToken.jwtToken}`,
            },
          })
          .then((res) => res.data)
          .then((data) => {         
            setUserProfileData({firstName:data.givenName, lastName:data.familyName, phoneNumber:data.phoneNumber})
            setUpdateLoading(false)
          })
      }, [props.isOpen])

    const onSubmit = async (data: any) => {
        console.log(data);
        const ipAddress = (await axios.get('https://geolocation-db.com/json/')).data['IPv4']
        const result = await axios.post("https://6fn0up8v71.execute-api.us-east-1.amazonaws.com/prod/user/updateUserFn",{
                givenName: data.first_name,
                familyName: data.last_name,
                phoneNumber: data.phone_number,
                ipAddress: ipAddress
        },{
            headers: {
                Authorization: `Bearer ${user?.user.signInUserSession.idToken.jwtToken}`,
                "Content-Type": "application/json",
            }
        })
        if(result.status === 200){
            toast({
                title: "User Profile Updated",
                status: "success",
                duration: 2000,
                isClosable: false,
                position: "top-right",
            });
            setTimeout(()=>{props.onClose(false); reset();},1000);
        }
    };

    const deleteUser = async () => {
        const result = await axios.post("https://6fn0up8v71.execute-api.us-east-1.amazonaws.com/prod/user/deleteUserFn",{},{
            headers: {
                Authorization: `Bearer ${user?.user.signInUserSession.idToken.jwtToken}`,
                "Content-Type": "application/json",
            }
        })
        if(result.status === 200){
            toast({
                title: "User Deleted!",
                description: "Your user has been deleted. You'll be logged out shortly",
                status: "success",
                duration: 5000,
                isClosable: false,
                position: "top-right",
            });
            setTimeout(()=>{router.push("/")},4000);
        }
    }

    return (
        <Modal isCentered isOpen={props.isOpen} onClose={()=>{props.onClose(false); reset();}}>
        <Overlay/>
        <chakra.form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>User Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Stack spacing={6}>
            <HStack>
              <Box>
                <FormControl 
                    id="firstName" 
                    isInvalid={Boolean(errors.first_name)}
                >
                  <FormLabel>First Name</FormLabel>
                  <Input 
                    type="text" 
                    {...register("first_name", {
                        required: "Please enter your first name",
                    })}
                    defaultValue={userProfileData.firstName}
                  />
                  <FormErrorMessage>
                  <> {errors.first_name && errors.first_name.message}</>
                </FormErrorMessage>
                </FormControl>
              </Box>
              <Box>
                <FormControl 
                    id="lastName" 
                    isInvalid={Boolean(errors.last_name)}
                >
                  <FormLabel>Last Name</FormLabel>
                  <Input 
                    type="text" 
                    {...register("last_name", {
                        required: "Please enter your last name",
                    })}
                    defaultValue={userProfileData.lastName}
                  />
                  <FormErrorMessage>
                    <> {errors.last_name && errors.last_name.message}</>
                  </FormErrorMessage>
                </FormControl>
              </Box>
            </HStack>
            <FormControl 
                id="phoneNumber" 
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
                defaultValue={userProfileData.phoneNumber}
               />
               <FormErrorMessage>
                <> {errors.phone_number && errors.phone_number.message}</>
               </FormErrorMessage>
            </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button bg={"red.500"} color={"white"} isLoading={deleteLoading} onClick={()=>{deleteUser()}}>Delete</Button>
            <Spacer/>
            <Button bg={"blue.400"} color={"white"} isLoading={updateLoading} type="submit">Update</Button>
          </ModalFooter>
        </ModalContent>
        </chakra.form>
      </Modal>
    )
}
import { Modal, 
    ModalContent, 
    ModalHeader, 
    ModalCloseButton, 
    ModalBody, 
    ModalFooter, 
    Button, 
    ModalOverlay, 
    Box,
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    Stack,
    Spacer,
    useToast,
    Center,
    Select,
    Textarea,
    Text
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from 'uuid';
 

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
        getValues,
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
    const [startDate, setStartDate] = useState(new Date());

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
        const result = await axios.post("https://6fn0up8v71.execute-api.us-east-1.amazonaws.com/prod/appointment/createAppointmentFn",{
                doctor: data.doctors,
                description: data.description,
                date: data.date_time,
                createdAt: new Date().toISOString,
                id: uuidv4()
        },{
            headers: {
                Authorization: `Bearer ${user?.user.signInUserSession.idToken.jwtToken}`,
                "Content-Type": "application/json",
            }
        })
        if(result.status === 200){
            toast({
                title: "Appointment Set!",
                description: "Don't be late!",
                status: "success",
                duration: 4000,
                isClosable: false,
                position: "top-right",
            });
            setTimeout(()=>{props.onClose(false); reset();},4000);
        }
    };

    return (
        <Modal isCentered isOpen={props.isOpen} onClose={()=>{props.onClose(false); reset();}}>
        <Overlay/>
        <chakra.form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>Schedule Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text pb={5} color={"red"} fontSize={"sm"}> The patient information shown below will be referenced for your appointment. If you would like to update this information, please do so in your user profile.</Text>
          <Stack spacing={6}>
            <HStack>
              <Box>
                <FormControl 
                    id="firstName" 
                    isInvalid={Boolean(errors.first_name)}
                    isReadOnly
                >
                  <FormLabel>First Name</FormLabel>
                  <Input 
                    type="text" 
                    defaultValue={userProfileData.firstName}
                    {...register("first_name")}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl 
                    id="lastName" 
                    isInvalid={Boolean(errors.last_name)}
                    isReadOnly
                >
                  <FormLabel>Last Name</FormLabel>
                  <Input 
                    type="text" 
                    defaultValue={userProfileData.lastName}
                    {...register("last_name")}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl 
                id="phoneNumber" 
                isInvalid={Boolean(errors.phone_number)}
                isReadOnly
            >
              <FormLabel>Phone Number</FormLabel>
              <Input 
                type="tel"
                placeholder="1234567890" 
                defaultValue={userProfileData.phoneNumber}
                {...register("phone_number")}
               />
            </FormControl>
            <FormControl
                id="date_time"
                isInvalid={Boolean(errors.date_time)}
            >
                <FormLabel> Appointment Date/Time </FormLabel>
                <Controller
                    rules={{ required: "Please select a date and time" }}
                    control={control}
                    name="date_time"
                    render={({ field: { onChange } }) => (
                        <DatePicker
                        selected={
                            getValues("date_time")
                              ? new Date(getValues("date_time"))
                              : null
                          }
                        onChange={onChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={60}
                        timeCaption="Time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        minDate={new Date()}
                        scrollableYearDropdown
                        customInput={<Input/>}
                    />
                )}
                />
                <FormErrorMessage>
                <> {errors.date_time && errors.date_time.message}</>
               </FormErrorMessage>
            </FormControl>
            <FormControl
                id="doctors"
                isInvalid={Boolean(errors.doctors)}
            >
                <FormLabel> Doctors on Duty </FormLabel>
                <Controller
                    rules={{ required: "Please select a doctor" }}
                    control={control}
                    name="doctors"
                    render={({ field: { onChange } }) => (
                        <Select variant='outline' placeholder='Please select a doctor' onChange={onChange}>
                            <option value='Dr. Smith'>Dr. Smith</option>
                            <option value='Dr. Jones'>Dr. Jones</option>
                            <option value='Dr. Brown'>Dr. Brown</option>
                        </Select>
                    )}
                />
            </FormControl>
            <FormControl
                id="description"
            >
            <FormLabel> Appointment Reason </FormLabel>
            <Controller
                control={control}
                name="description"
                render={({ field: {onChange} }) => (
                    <Textarea 
                        placeholder='Enter a brief description explaining the reason for your appointment' 
                        onChange={onChange}
                    />
                )}
            />
            </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Center>
                <Button bg={"blue.400"} color={"white"} isLoading={updateLoading} type="submit">Done</Button>
            </Center>
          </ModalFooter>
        </ModalContent>
        </chakra.form>
      </Modal>
    )
}
import {
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Box,
    Button,
    Flex,
    Spacer,
    SimpleGrid,
    Heading,
    Center,
    Spinner
  } from "@chakra-ui/react";
  import { CalendarIcon } from "@chakra-ui/icons";
  import { useSession } from "next-auth/react";
  import AppointmentCard from "./AppointmentCard";
  import ScheduleAppointment from "./ScheduleAppointmentModal";
  import { useState, useEffect } from "react";
  import axios from "axios";
  

  export interface Appointment {
    id: string
    doctor : string,
    date: string,
    description?: string
    createdAt: string,
    userId: string,
  }

  const MainAppointment = () => {
    const { data: user } = useSession();

    const [appointmentsLoading, setAppointmentsLoading] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        setAppointmentsLoading(true)
        axios.get("https://6fn0up8v71.execute-api.us-east-1.amazonaws.com/prod/appointment/listAppointmentsFn",{
            headers: {
                Authorization: `Bearer ${user?.user.signInUserSession.idToken.jwtToken}`,
            },
            })
            .then((res) => res.data)
            .then((data) => {       
                const allAppointments = data; 
                const upcomingAppointments = allAppointments.filter((appointment:Appointment) => new Date(appointment.date) > new Date());
                const pastAppointments = allAppointments.filter((appointment:Appointment) => new Date(appointment.date) < new Date());
                setUpcomingAppointments(upcomingAppointments);
                setPastAppointments(pastAppointments);
                setAppointmentsLoading(false)
            })
        }, [])

    const [isScheduleAppointmentOpen, setScheduleAppointmentOpen] = useState(false);
    const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([
    ]);
  
    const [pastAppointments, setPastAppointments] = useState<Appointment[]>([
    ]);

    type Props = {
        title: string;
      };
      
      const CustomHeading = (props: Props) => {
        return (
          <Box pb={4}>
            <Heading size={"lg"} color={"blue.900"}>
              {props.title}
            </Heading>
          </Box>
        );
      };
  
    return (
      <>
        <CustomHeading title="Appointments" />
        <Flex>
          <Spacer />
          <Button color={"white"} bg={"blue.400"} leftIcon={<CalendarIcon />} onClick={()=>{setScheduleAppointmentOpen(true)}}>
            {" "}
            Schedule an Appointment
          </Button>
          <ScheduleAppointment isOpen={isScheduleAppointmentOpen} onClose={()=>{setScheduleAppointmentOpen(false)}}/>
        </Flex>
  
        <Box>
          <Tabs margin={2}>
            <TabList>
              <Tab>Upcoming</Tab>
              <Tab>Past</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {appointmentsLoading ? 
                <Center h={"70vh"}>
                    <Spinner color="blue.400" />
                </Center> : 
                <SimpleGrid columns={{ sm: 1, md: 1, lg: 2, xl: 3 }} spacing={10}>
                  {upcomingAppointments.map((upcomingAppointment) => {
                    return (
                      <AppointmentCard
                        key={upcomingAppointment.id}
                        createdAt={upcomingAppointment.createdAt}
                        date={upcomingAppointment.date}
                        doctor={upcomingAppointment.doctor}
                        description={upcomingAppointment.description}
                        userId={upcomingAppointment.userId}
                        id={upcomingAppointment.id}
                      />
                    );
                  })}
                </SimpleGrid>}
              </TabPanel>
              <TabPanel>
              {appointmentsLoading ? 
                <Center h={"70vh"}>
                    <Spinner color="blue.400" />
                </Center> : 
                <SimpleGrid columns={{ sm: 1, md: 1, lg: 2, xl: 3 }} spacing={10}>
                  {pastAppointments.map((pastAppointment) => {
                    return (
                      <AppointmentCard
                        key={pastAppointment.id}
                        createdAt={pastAppointment.createdAt}
                        date={pastAppointment.date}
                        doctor={pastAppointment.doctor}
                        description={pastAppointment.description}
                        userId={pastAppointment.userId}
                        id={pastAppointment.id}
                      />
                    );
                  })}
                </SimpleGrid>}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </>
    );
  };
  
  export default MainAppointment;
  
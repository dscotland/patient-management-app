import {
    Card,
    CardBody,
    Heading,
    Text,
    Stack,
    Center,
    Box,
    Flex,
    Spacer,
    Hide,
    Show,
    IconButton,
    Tag,
  } from "@chakra-ui/react";
  import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
  import { Appointment } from "./MainAppointment";
  import moment from "moment";
  
  
  const AppointmentCard = ({
    id,
    doctor,
    date,
    description,
    createdAt,
    userId,
  }: Appointment) => {
    const formattedAppointmentDate = moment(date).format("MMM Do h:mm a");
    const [appointmentMonth,appointmentDay, appointmentTime, period] =
      formattedAppointmentDate.split(" ");
    return (
      <Card
        variant={"elevated"}
        direction={{ base: "column", sm: "row" }}
        size={"lg"}
        align={"center"}
      >
        <Show below="sm">
          <Box pb={5}>
            <IconButton
              variant="unstyled"
              color="blue.500"
              aria-label="Edit Appointment"
              icon={<EditIcon />}
            />
            <IconButton
              variant="unstyled"
              color="red"
              aria-label="Delete Appointment"
              icon={<DeleteIcon />}
            />
          </Box>
        </Show>
  
        <Center w={"50%"}>
          <Stack color={"blue.500"} textAlign={"center"}>
            <Heading>{appointmentMonth}</Heading>
            <Heading>{appointmentDay}</Heading>
            <Heading size={"sm"}>
              {appointmentTime} {period}
            </Heading>
          </Stack>
        </Center>
  
        <Stack
          w={"100%"}
          textAlign={{
            base: "center",
            sm: "left",
            md: "left",
            lg: "left",
            xl: "left",
          }}
        >
          <CardBody pt={0}>
            <Hide below="sm">
              <Flex>
                <Spacer />
                <Box pb={5}>
                  <IconButton
                    variant="unstyled"
                    color="blue.500"
                    aria-label="Edit Appointment"
                    icon={<EditIcon />}
                  />
                  <IconButton
                    variant="unstyled"
                    color="red"
                    aria-label="Delete Appointment"
                    icon={<DeleteIcon />}
                  />
                </Box>
              </Flex>
            </Hide>
  
            <Heading
              size="md"
              pb={5}
              pt={{ sm: 5, md: 0, lg: 0, xl: 0 }}
              color={"brand.900"}
            >
              Appointment with {doctor}
            </Heading>
  
              <Tag size={"sm"} variant="solid" colorScheme="yellow">
                Pending
              </Tag>
  
            <Box pt={5} pb={5}>
              <Text py={2} overflow={"scroll"} maxH={"100px"} noOfLines={4}>
                {description}
              </Text>
              <Text py={2} overflow={"scroll"} maxH={"100px"}>
                {moment(date).format("dddd MMMM Do YYYY")}
              </Text>
            </Box>
          </CardBody>
        </Stack>
      </Card>
    );
  };
  
  export default AppointmentCard;
  
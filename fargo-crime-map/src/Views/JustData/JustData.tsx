import { Flex, Image } from "@chakra-ui/react";
import CrimeData from "Components/CrimeData";
import MyDatePicker from "Components/MyDatePicker";

const JustData = () => {
  return (
    <Flex width="100vw" height="100vh" bg="white">
      {/* eslint-disable-next-line */}
      <Image height={500} src="/logo-color.svg" />
      <MyDatePicker />
      <CrimeData />
    </Flex>
  );
};

export default JustData;

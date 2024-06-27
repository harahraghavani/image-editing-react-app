import {
  Box,
  Flex,
  Heading,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { CiDark, CiLight } from "react-icons/ci";
import { IoMdSettings } from "react-icons/io";
import CommonDrawer from "./CommonDrawer";

const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      w="100%"
      transition={"all 0.3s ease"}
      boxShadow="0px 2px 25px rgba(57, 63, 72, 0.3)"
    >
      <Flex justifyContent={"space-between"} alignItems={"center"} p={"20px"}>
        <Heading size="md">Image Editor</Heading>
        <Flex gap={4} alignItems={"center"}>
          <Box onClick={onOpen}>
            <IoMdSettings cursor={"pointer"} size={28} />
          </Box>
          <Box onClick={toggleColorMode} cursor={"pointer"}>
            {colorMode === "light" ? (
              <CiDark size={35} />
            ) : (
              <CiLight size={35} />
            )}
          </Box>
        </Flex>
      </Flex>
      <CommonDrawer isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default NavBar;

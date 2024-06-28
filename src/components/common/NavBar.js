import {
  Box,
  Flex,
  Heading,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { CiDark, CiLight } from "react-icons/ci";
import { IoMdSettings } from "react-icons/io";
import CommonDrawer from "./CommonDrawer";

const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navbarRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    let prevScrollpos = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        navbarRef.current.style.top = "0";
        if (currentScrollPos > 0) {
          navbarRef.current.style.boxShadow =
            "rgba(57, 63, 72, 0.4) 0px 2px 5px";
          navbarRef.current.style.backgroundColor =
            colorMode === "light" ? "#FFFFFF" : "#1A202C";
        } else {
          navbarRef.current.style.boxShadow = "none";
          navbarRef.current.style.backgroundColor = "transparent";
          setHasScrolled(false);
        }
      } else {
        navbarRef.current.style.top = "-70px";
        setHasScrolled(true);
      }
      prevScrollpos = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [colorMode]);

  useEffect(() => {
    if (hasScrolled) {
      navbarRef.current.style.boxShadow = "rgba(57, 63, 72, 0.4) 0px 2px 5px";
      navbarRef.current.style.backgroundColor =
        colorMode === "light" ? "#FFFFFF" : "#1A202C";
    }
  }, [hasScrolled, colorMode]);

  return (
    <Box
      position="fixed"
      w="100%"
      ref={navbarRef}
      transition={"all 0.3s ease"}
      zIndex={999}
      top={0}
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

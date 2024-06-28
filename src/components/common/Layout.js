import { Box } from "@chakra-ui/react";
import React from "react";
import NavBar from "./NavBar";

const Layout = ({ children }) => {
  return (
    <Box>
      <NavBar />
      <Box mt="75px">{children}</Box>
    </Box>
  );
};

export default Layout;

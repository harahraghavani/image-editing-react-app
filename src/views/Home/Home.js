import { Box } from "@chakra-ui/react";
import NavBar from "../../components/common/NavBar";
import ImagesGrid from "../../components/ImagesGrid";

const Home = () => {
  return (
    <Box position="relative">
      <NavBar />
      <ImagesGrid />
    </Box>
  );
};

export default Home;

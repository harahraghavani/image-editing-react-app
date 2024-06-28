import { Box } from "@chakra-ui/react";
import ImagesGrid from "../../components/ImagesGrid";
import Layout from "../../components/common/Layout";

const Home = () => {
  return (
    <Layout>
      <Box position="relative">
        <ImagesGrid />
      </Box>
    </Layout>
  );
};

export default Home;

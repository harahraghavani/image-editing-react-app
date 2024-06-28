import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const NoDataComponent = () => {
  const { colorMode } = useColorMode();

  const borderColor = colorMode === "light" ? "gray" : "gray";
  const bgColor = colorMode === "light" ? "gray.50" : "gray.700";
  const textColor = colorMode === "light" ? "gray.500" : "gray.300";

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minH="calc(100svh - 75px)"
      height="calc(100svh - 75px)"
    >
      <Box
        border={`1px solid ${borderColor}`}
        borderRadius="md"
        p={5}
        bg={bgColor}
        textAlign="center"
        shadow={"inner"}
        width={"100%"}
        mx={50}
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap="15px"
          height="200px"
        >
          <FaSearch size="60px" color={textColor} />
          <Text fontSize="2xl" color={textColor}>
            No data found
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default NoDataComponent;

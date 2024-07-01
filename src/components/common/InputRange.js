import { Box, Flex, Heading, Input, Tag } from "@chakra-ui/react";
import { useTheme } from "../../hooks/theme/useTheme";

const InputRange = ({ min, max, value, onChangeCallBack, displayName }) => {
  const { selectedColor } = useTheme();

  return (
    <Box>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        width="270px"
      >
        <Heading size="sm">{displayName}</Heading>
        <Tag
          colorScheme={selectedColor !== null ? selectedColor : "gray"}
          borderRadius="full"
          variant="solid"
        >
          {value}
        </Tag>
      </Flex>
      <Input
        type="range"
        value={value}
        min={min}
        max={max}
        onChange={onChangeCallBack}
        height="25px"
        variant="filled"
        rounded="full"
        px={2}
        width="270px"
      />
    </Box>
  );
};

export default InputRange;

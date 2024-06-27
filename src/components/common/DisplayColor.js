import { Box, Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react";
import { IoMdAdd, IoIosCheckmarkCircle } from "react-icons/io";
import { useTheme } from "../../hooks/theme/useTheme";

const DisplayColor = ({ data, onClose }) => {
  const { name } = data;

  const { selectedColor, changeColor } = useTheme();

  return (
    <Box w={150}>
      <Tag
        size={"lg"}
        variant={name === selectedColor ? "solid" : "outline"}
        colorScheme={name}
        mb={3}
        w={"100%"}
        py={2}
        cursor="pointer"
        onClick={() => {
          changeColor(name);
          onClose();
        }}
      >
        <TagLeftIcon
          boxSize="24px"
          as={name === selectedColor ? IoIosCheckmarkCircle : IoMdAdd}
        />
        <TagLabel textTransform={"capitalize"}>{name}</TagLabel>
      </Tag>
    </Box>
  );
};

export default DisplayColor;

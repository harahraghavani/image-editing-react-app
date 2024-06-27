import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Box,
  Heading,
  Button,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import DisplayColor from "./DisplayColor";
import { Colors } from "../../constant/constant";
import { useTheme } from "../../hooks/theme/useTheme";

const CommonDrawer = ({ isOpen, onClose }) => {
  const { resetToDefault, selectedColor } = useTheme();
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size={{
        base: "xs",
        sm: "sm",
      }}
    >
      <DrawerOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <DrawerContent>
        <Flex justifyContent={"space-between"} alignItems={"center"} p={"20px"}>
          <Box>
            <Heading
              size={{
                base: "sm",
                sm: "md",
              }}
              textTransform={"capitalize"}
            >
              Choose your favourite color
            </Heading>
          </Box>
          <IoClose cursor={"pointer"} size={25} onClick={onClose} />
        </Flex>
        <DrawerBody>
          <Flex flexWrap="wrap" gap={5}>
            {Colors.map((item) => {
              return (
                <Box key={item.id}>
                  <DisplayColor data={item} onClose={onClose} />
                </Box>
              );
            })}
          </Flex>
          <Box mt={4}>
            <Button
              _focusVisible={{ outline: "none" }}
              onClick={() => {
                resetToDefault();
                onClose();
              }}
              isDisabled={selectedColor === null}
            >
              Reset to default
            </Button>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CommonDrawer;

import {
  Box,
  IconButton,
  Image,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useTheme } from "../hooks/theme/useTheme";
import AddImageModal from "./modal/AddImageModal";
import { useFirebase } from "../hooks/firebase/useFirebase";
import Shimmer from "./common/Shimmer";
import NoDataComponent from "./common/NoDataComponent";

const ImagesGrid = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedColor } = useTheme();
  const [file, setFile] = useState(null);

  const { states } = useFirebase();
  const { loader, imagesData } = states;
  const handleClose = () => {
    setFile(null);
    onClose();
  };

  return (
    <>
      <Box
        position="relative"
        minH="calc(100svh - 75px)"
        height="calc(100svh - 75px)"
        transition={"all 0.3s ease"}
      >
        {loader ? (
          <SimpleGrid columns={[1, 2, 3]} spacing="20px" p="20px" mx="auto">
            <Shimmer height="350px" />
            <Shimmer height="350px" />
            <Shimmer height="350px" />
            <Shimmer height="350px" />
            <Shimmer height="350px" />
            <Shimmer height="350px" />
          </SimpleGrid>
        ) : imagesData?.length <= 0 ? (
          <NoDataComponent />
        ) : (
          <SimpleGrid columns={[1, 2, 3]} spacing="40px" p="20px">
            {imagesData?.map((url, index) => (
              <Box
                rounded="xl"
                key={index}
                display="inline-flex"
                justifyContent="center"
              >
                <Image
                  src={url}
                  alt={`Image ${Math.random()}`}
                  height={"500"}
                  objectFit={"cover"}
                />
              </Box>
            ))}
          </SimpleGrid>
        )}

        <Box
          position="fixed"
          right="40px"
          bottom="40px"
          rounded="full"
          boxShadow="dark-lg"
        >
          <IconButton
            colorScheme={selectedColor != null ? selectedColor : "gray"}
            aria-label="Add Image"
            icon={<IoMdAdd />}
            isRound={true}
            size="lg"
            onClick={onOpen}
          />
        </Box>
      </Box>
      {isOpen && (
        <AddImageModal
          isOpen
          onClose={handleClose}
          file={file}
          setFile={setFile}
        />
      )}
    </>
  );
};

export default ImagesGrid;

import {
  Box,
  IconButton,
  Image,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useTheme } from "../hooks/theme/useTheme";
import AddImageModal from "./modal/AddImageModal";
import { useFirebase } from "../hooks/firebase/useFirebase";

const ImagesGrid = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedColor } = useTheme();
  const [file, setFile] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  console.log("imageUrls: ", imageUrls);
  const { firebaseMethods } = useFirebase();
  const { fetchImages } = firebaseMethods;

  const handleClose = () => {
    setFile(null);
    onClose();
  };

  useEffect(() => {
    const loadImages = async () => {
      const urls = await fetchImages();
      setImageUrls(urls);
    };
    loadImages();
  }, [fetchImages]);

  return (
    <>
      <Box
        position="relative"
        minH="calc(100svh - 75px)"
        height="calc(100svh - 75px)"
        transition={"all 0.3s ease"}
      >
        <SimpleGrid columns={[2, null, 3]} spacing="40px" p="20px">
          {imageUrls.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={`Image ${index + 1}`}
              boxSize="200px"
              objectFit="cover"
            />
          ))}
        </SimpleGrid>
        <Box
          position="absolute"
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

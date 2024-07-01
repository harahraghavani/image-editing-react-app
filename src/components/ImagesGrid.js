import {
  AspectRatio,
  Box,
  IconButton,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useTheme } from "../hooks/theme/useTheme";
import AddImageModal from "./modal/AddImageModal";
import { useFirebase } from "../hooks/firebase/useFirebase";
import Shimmer from "./common/Shimmer";
import NoDataComponent from "./common/NoDataComponent";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useNavigate } from "react-router-dom";

const ImagesGrid = () => {
  // REACT ROUTER
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedColor } = useTheme();
  const [file, setFile] = useState(null);

  const { states, firebaseMethods } = useFirebase();
  const { getAllImages } = firebaseMethods;
  const { loader, imagesData } = states;

  const handleClose = () => {
    setFile(null);
    onClose();
    getAllImages();
  };

  useEffect(() => {
    getAllImages();
    // eslint-disable-next-line
  }, []);

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
            <AspectRatio width="auto" ratio={1}>
              <Shimmer />
            </AspectRatio>
            <AspectRatio width="auto" ratio={1}>
              <Shimmer />
            </AspectRatio>
            <AspectRatio width="auto" ratio={1}>
              <Shimmer />
            </AspectRatio>
          </SimpleGrid>
        ) : imagesData?.length <= 0 ? (
          <NoDataComponent />
        ) : (
          <Box mx="25px" mb="50px">
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
            >
              <Masonry columnsCount={3} gutter="25px">
                {imagesData?.map((data, index) => {
                  return (
                    <LazyLoadImage
                      key={index}
                      src={data?.url}
                      alt={`Image ${Math.random()}`}
                      onClick={() => {
                        navigate(`/image/edit/${data?.id}`);
                      }}
                    />
                  );
                })}
              </Masonry>
            </ResponsiveMasonry>
          </Box>
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

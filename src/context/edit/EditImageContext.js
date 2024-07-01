import { createContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../../hooks/firebase/useFirebase";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { getDefaultValue, getFilterString } from "../../utility/utils";
import InputRange from "../../components/common/InputRange";
import { CiDark, CiLight } from "react-icons/ci";
import { useTheme } from "../../hooks/theme/useTheme";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { HiRefresh } from "react-icons/hi";
import CommonDrawer from "../../components/common/CommonDrawer";
import { IoMdSettings } from "react-icons/io";

const EditImageContext = createContext();

const EditImageProvider = ({ children }) => {
  const { id } = useParams();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navbarRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { selectedColor } = useTheme();

  // REFERENCES
  const canvasRef = useRef(null);

  // FIREBASE CONTEXT VALUES
  const { states, firebaseMethods } = useFirebase();
  const { getDataBasedOnId, updateImageData } = firebaseMethods;
  const { image } = states;

  // STATES
  const [filters, setFilters] = useState(getDefaultValue());

  // Function to set filters based on fetched data
  const setFiltersFromData = (data) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      for (const key in data) {
        if (updatedFilters[key]) {
          updatedFilters[key].value = data[key];
        }
      }
      return updatedFilters;
    });
  };

  const canvasComponent = () => {
    return (
      <Box>
        <canvas ref={canvasRef} className="image-canvas" />
      </Box>
    );
  };

  const filterOnChangeHandler = ({ filterName, value }) => {
    setFilters((prevFilters) => {
      return {
        ...prevFilters,
        [filterName]: {
          ...prevFilters[filterName],
          value,
        },
      };
    });
    updateImageData({ id, updatedData: { [filterName]: value } });
    applyFilterChanges();
  };

  const editImageHeader = () => {
    return (
      <Box
        w="100%"
        ref={navbarRef}
        transition={"all 0.3s ease-in-out"}
        zIndex={999}
        top={0}
        position={{
          base: "inherit",
          sm: "inherit",
          md: "inherit",
          lg: "fixed",
          xl: "fixed",
        }}
      >
        <Flex
          justifyContent={{
            base: "center",
            sm: "center",
            md: "space-between",
            lg: "space-between",
            xl: "space-between",
          }}
          alignItems={"center"}
          p={"20px"}
          flexWrap={{
            base: "wrap",
            sm: "wrap",
            md: "nowrap",
            lg: "nowrap",
            xl: "nowrap",
          }}
          gap={{
            base: 5,
            sm: 5,
            md: 0,
            lg: 0,
            xl: 0,
          }}
          transition={"all 0.3s ease-in-out"}
        >
          <Flex gap={4} alignItems={"center"}>
            <Heading size="md">Preview Image</Heading>
            <Box onClick={toggleColorMode} cursor={"pointer"}>
              {colorMode === "light" ? (
                <CiDark size={35} />
              ) : (
                <CiLight size={35} />
              )}
            </Box>
            <Box onClick={onOpen}>
              <IoMdSettings cursor={"pointer"} size={28} />
            </Box>
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <Button>Back</Button>
            <IconButton
              colorScheme={selectedColor !== null ? selectedColor : "gray"}
              aria-label="donwload image"
              icon={<FaCloudDownloadAlt />}
              onClick={() => {}}
            />
            <IconButton
              colorScheme={selectedColor !== null ? selectedColor : "gray"}
              aria-label="reset image"
              icon={<HiRefresh />}
              onClick={() => {}}
            />
            <IconButton
              colorScheme={selectedColor !== null ? selectedColor : "gray"}
              aria-label="remove image"
              icon={<MdDeleteForever />}
              onClick={() => {}}
            />
          </Flex>
        </Flex>
        <CommonDrawer isOpen={isOpen} onClose={onClose} />
      </Box>
    );
  };

  const rangeInputComponents = () => {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={25}
      >
        <InputRange
          max={filters.brightness.max}
          min={filters.brightness.min}
          value={filters.brightness.value}
          displayName={filters.brightness.displayName}
          onChangeCallBack={(e) => {
            filterOnChangeHandler({
              filterName: "brightness",
              value: e.target.value,
            });
          }}
        />
        <InputRange
          max={filters.contrast.max}
          min={filters.contrast.min}
          value={filters.contrast.value}
          displayName={filters.contrast.displayName}
          onChangeCallBack={(e) => {
            filterOnChangeHandler({
              filterName: "contrast",
              value: e.target.value,
            });
          }}
        />
        <InputRange
          max={filters.grayscale.max}
          min={filters.grayscale.min}
          value={filters.grayscale.value}
          displayName={filters.grayscale.displayName}
          onChangeCallBack={(e) => {
            filterOnChangeHandler({
              filterName: "grayscale",
              value: e.target.value,
            });
          }}
        />
        <InputRange
          max={filters.hue.max}
          min={filters.hue.min}
          value={filters.hue.value}
          displayName={filters.hue.displayName}
          onChangeCallBack={(e) => {
            filterOnChangeHandler({
              filterName: "hue",
              value: e.target.value,
            });
          }}
        />
        <InputRange
          max={filters.saturation.max}
          min={filters.saturation.min}
          value={filters.saturation.value}
          displayName={filters.saturation.displayName}
          onChangeCallBack={(e) => {
            filterOnChangeHandler({
              filterName: "saturation",
              value: e.target.value,
            });
          }}
        />
        <InputRange
          max={filters.sepia.max}
          min={filters.sepia.min}
          value={filters.sepia.value}
          displayName={filters.sepia.displayName}
          onChangeCallBack={(e) => {
            filterOnChangeHandler({
              filterName: "sepia",
              value: e.target.value,
            });
          }}
        />
      </Flex>
    );
  };

  const applyFilterChanges = () => {
    if (!image) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const { url } = image;

    // Set the willReadFrequently attribute
    context.willReadFrequently = true;
    context.desynchronized = true;

    const newImage = new Image();
    newImage.src = url;
    newImage.onload = () => {
      canvas.width = newImage.width;
      canvas.height = newImage.height;
      context.filter = getFilterString(filters);
      context.drawImage(newImage, 0, 0);
    };
  };

  useEffect(() => {
    if (image) {
      const { url } = image;

      const canvas = canvasRef.current;
      const imageContext = canvas.getContext("2d");

      const newImage = new Image();
      newImage.src = url;
      newImage.onload = () => {
        canvas.width = newImage.width;
        canvas.height = newImage.height;
        imageContext.drawImage(newImage, 0, 0);
      };
      applyFilterChanges();
    }
  }, [id, image]);

  // Get image baseed on id
  useEffect(() => {
    if (id) {
      getDataBasedOnId({ id });
    }
  }, []);

  useEffect(() => {
    if (image) {
      applyFilterChanges();
    }
    // eslint-disable-next-line
  }, [filters, image]);

  useEffect(() => {
    if (id) {
      getDataBasedOnId({ id });
    }
  }, [id]);

  useEffect(() => {
    if (image) {
      setFiltersFromData(image);
    }
  }, [image]);

  const windowWidth = window.innerWidth;
  useEffect(() => {
    let prevScrollpos = window.pageYOffset;

    const handleScroll = () => {
      if (!navbarRef.current) return;
      const currentScrollPos = window.pageYOffset;

      if (prevScrollpos > currentScrollPos) {
        navbarRef.current.style.top = "0";
        if (currentScrollPos > 0) {
          navbarRef.current.style.boxShadow =
            "rgba(57, 63, 72, 0.4) 0px 2px 5px";
          navbarRef.current.style.backgroundColor =
            colorMode === "light" ? "#FFFFFF" : "#1A202C";
          if (windowWidth < 768) {
            navbarRef.current.style.position = "sticky";
          }
        } else {
          navbarRef.current.style.boxShadow = "none";
          navbarRef.current.style.backgroundColor = "transparent";
          if (windowWidth < 768) {
            navbarRef.current.style.position = "initial";
          }
          setHasScrolled(false);
        }
      } else {
        navbarRef.current.style.top = "-70px";
        setHasScrolled(true);
      }
      prevScrollpos = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [windowWidth]);

  useEffect(() => {
    if (hasScrolled) {
      if (!navbarRef.current) return;
      navbarRef.current.style.boxShadow = "rgba(57, 63, 72, 0.4) 0px 2px 5px";
      navbarRef.current.style.backgroundColor =
        colorMode === "light" ? "#FFFFFF" : "#1A202C";
    }
  }, [hasScrolled, colorMode]);

  const values = {
    stateValues: {
      image,
    },
    jsxComponents: {
      canvasComponent,
      rangeInputComponents,
      editImageHeader,
    },
  };

  return (
    <EditImageContext.Provider value={values}>
      {children}
    </EditImageContext.Provider>
  );
};

export { EditImageContext, EditImageProvider };

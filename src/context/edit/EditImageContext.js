import { createContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../../hooks/firebase/useFirebase";
import { Box, Flex } from "@chakra-ui/react";
import { getDefaultValue, getFilterString } from "../../utility/utils";
import InputRange from "../../components/common/InputRange";

const EditImageContext = createContext();

const EditImageProvider = ({ children }) => {
  const { id } = useParams();

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

  const values = {
    stateValues: {
      image,
    },
    jsxComponents: {
      canvasComponent,
      rangeInputComponents,
    },
  };

  return (
    <EditImageContext.Provider value={values}>
      {children}
    </EditImageContext.Provider>
  );
};

export { EditImageContext, EditImageProvider };

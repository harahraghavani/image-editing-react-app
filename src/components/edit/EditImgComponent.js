import React from "react";
import { useEditImage } from "../../hooks/edit/useEditImage";
import { Box, Grid, GridItem, Flex } from "@chakra-ui/react";

const EditImgComponent = () => {
  const { jsxComponents } = useEditImage();
  const { canvasComponent, rangeInputComponents, editImageHeader } =
    jsxComponents;

  return (
    <Box>
      {editImageHeader()}
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(2, 1fr)",
        }}
        gap={6}
        justifyContent="center"
        alignItems="center"
        height="100svh"
        mx="auto"
      >
        <GridItem>
          <Flex justifyContent="center" p={7}>
            {canvasComponent()}
          </Flex>
        </GridItem>
        <GridItem>{rangeInputComponents()}</GridItem>
      </Grid>
    </Box>
  );
};

export default EditImgComponent;

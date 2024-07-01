import { Box } from "@chakra-ui/react";
import { useEditImage } from "../../hooks/edit/useEditImage";
import EditImgComponent from "../../components/edit/EditImgComponent";
import { EditImageProvider } from "../../context/edit/EditImageContext";

const EditPage = () => {
  return (
    <EditImageProvider>
      <EditImgComponent />
    </EditImageProvider>
  );
};

export default EditPage;

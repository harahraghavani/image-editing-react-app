import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import UploadInput from "../common/UploadInput";
import { useRef } from "react";
import { IMAGE_TYPE } from "../../constant/regex";
import { useFirebase } from "../../hooks/firebase/useFirebase";
import { useTheme } from "../../hooks/theme/useTheme";

const AddImageModal = ({ isOpen, onClose, file, setFile }) => {
  const fileInputRef = useRef(null);
  const { selectedColor } = useTheme();
  const { firebaseMethods, states } = useFirebase();
  const { uploadImages } = firebaseMethods;
  const { isUploading } = states;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={() => {
        onClose();
        handleRemoveFile();
      }}
      isCentered
      motionPreset="scale"
      size={{
        base: "xs",
        sm: "sm",
        md: "md",
        lg: "lg",
      }}
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Add Image</ModalHeader>
        <ModalCloseButton isDisabled={isUploading} />
        <ModalBody>
          <UploadInput
            type="file"
            onChangeCallBack={handleFileChange}
            acceptType={IMAGE_TYPE}
            inputReference={fileInputRef}
            file={file}
            disabled={isUploading}
          />
        </ModalBody>
        <ModalFooter>
          {file && (
            <Button
              transition={"all 0.3s ease"}
              onClick={() => {
                uploadImages({
                  img: file,
                  closeUploadModal: () => onClose(),
                });
              }}
              isDisabled={isUploading}
              isLoading={isUploading}
              colorScheme={selectedColor !== null ? selectedColor : "gray"}
              variant="outline"
            >
              Upload
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddImageModal;

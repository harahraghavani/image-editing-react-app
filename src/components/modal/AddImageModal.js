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

const AddImageModal = ({ isOpen, onClose, file, setFile }) => {
  const fileInputRef = useRef(null);
  const { firebaseMethods, states } = useFirebase();
  const { handleUploadImage } = firebaseMethods;
  const { isImageUploading } = states;
  console.log("isImageUploading: ", isImageUploading);

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
      size="sm"
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Add Image</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <UploadInput
            type="file"
            onChangeCallBack={handleFileChange}
            acceptType={IMAGE_TYPE}
            inputReference={fileInputRef}
            file={file}
          />
        </ModalBody>
        <ModalFooter>
          {file && (
            <Button
              transition={"all 0.3s ease"}
              onClick={() =>
                handleUploadImage({
                  imageData: file?.name,
                  closeModal: () => onClose(),
                })
              }
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

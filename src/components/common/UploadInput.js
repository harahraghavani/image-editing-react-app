import {
  Input,
  InputGroup,
  InputLeftElement,
  useColorMode,
} from "@chakra-ui/react";
import { FaUpload, FaCheckCircle } from "react-icons/fa";
import { useTheme } from "../../hooks/theme/useTheme";

const UploadInput = ({
  type = "file",
  acceptType,
  onChangeCallBack,
  maxAllowedFiles = 1,
  inputReference,
  file,
  disabled,
}) => {
  const { selectedColor } = useTheme();
  const { colorMode } = useColorMode();

  const color =
    colorMode === "light"
      ? file
        ? `${selectedColor}.200`
        : ""
      : file
      ? `${selectedColor}.700`
      : "";

  const borderColor = !file
    ? colorMode === "light"
      ? "1px solid black"
      : "1px solid white"
    : "";

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        {file ? <FaCheckCircle /> : <FaUpload />}
      </InputLeftElement>
      <input
        type={type}
        onChange={onChangeCallBack}
        accept={acceptType}
        ref={(node) => {
          inputReference = node;
        }}
        style={{ display: "none" }}
        disabled={disabled}
      />
      <Input
        onClick={() => inputReference.click()}
        max={maxAllowedFiles}
        readOnly={true}
        value={file ? file.name : "Upload an image"}
        cursor="pointer"
        _focusVisible={{ outline: "none" }}
        _hover={{ backgroundColor: selectedColor ? color : "" }}
        border={borderColor}
        backgroundColor={color}
        variant={file ? "filled" : "outline"}
        disabled={disabled}
      />
    </InputGroup>
  );
};

export default UploadInput;

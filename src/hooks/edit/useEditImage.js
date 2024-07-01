import { useContext } from "react";
import { EditImageContext } from "../../context/edit/EditImageContext";

export const useEditImage = () => useContext(EditImageContext);

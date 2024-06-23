import { useContext } from "react";
import { FirebaseContext } from "../../context/firebase/FirebaseContext";

export const useFirebase = () => useContext(FirebaseContext)
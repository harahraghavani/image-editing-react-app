import { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import MY_APP from "../../firebase/config/index";
import { useToast } from "@chakra-ui/react";
import {
  getDataFromLocalStorage,
  removeDataFromLocalStorage,
  setDataToLocalStorage,
} from "../../utility/utils";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const FirebaseContext = createContext();

const FirebaseProvider = ({ children }) => {
  const auth = getAuth(MY_APP);
  const googleProvider = new GoogleAuthProvider();
  const storage = getStorage(MY_APP);
  const db = getFirestore(MY_APP);

  // states
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  // upload and get images
  const [imagesData, setImagesData] = useState([]);

  const [isUploading, setIsUploading] = useState(false);
  const [loader, setLoader] = useState(false);

  // hooks
  const toast = useToast();
  const navigate = useNavigate();

  // cookies data
  const accessToken = getDataFromLocalStorage("Access Token");
  const userData = getDataFromLocalStorage("User Data");

  const signUpWithGoogle = async () => {
    setIsLoading(true);
    await signInWithPopup(auth, googleProvider)
      .then((result) => {
        setDataToLocalStorage("Access Token", result?.user?.accessToken);
        setDataToLocalStorage("User Data", result?.user);
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setIsLoading(false);
        toast({
          title: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isUserExist = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  };

  const uploadFile = async ({ file }) => {
    const storageRef = ref(storage);
    const fileRef = ref(storageRef, `images/${file.name + v4()}`);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };

  const uploadImages = async ({ img, closeUploadModal }) => {
    setIsUploading(true);
    const url = await uploadFile({ file: img });
    try {
      await addDoc(collection(db, "images", user?.email, "images"), {
        email: user?.email,
        url,
      });
      const querySnapshot = await getDocs(
        collection(db, "images", user?.email, "images")
      );
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      data.filter((item) => item.email === user?.email);

      setImagesData(data);
      setIsUploading(false);
      closeUploadModal();
      toast({
        title: "Image uploaded successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsUploading(false);
      closeUploadModal();
    }
  };

  const getAllImages = async () => {
    if (!userData) {
      return;
    }
    setLoader(true);
    try {
      const q = query(
        collection(db, "images", userData?.email, "images"),
        where("email", "==", userData?.email)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setImagesData([]); // Update the state to reflect no images found
        setLoader(false);
        return;
      }

      const urls = [];
      querySnapshot.forEach((doc) => {
        urls.push(doc.data());
      });
      setImagesData(urls);
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoader(false);
    }
  };

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        toast({
          title: "Logged out successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        navigate("/login");
        removeDataFromLocalStorage("Access Token");
        removeDataFromLocalStorage("User Data");
      })
      .catch((error) => {
        toast({
          title: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      })
      .finally(() => {});
    removeDataFromLocalStorage("Access Token");
    removeDataFromLocalStorage("User Data");
  };

  useEffect(() => {
    isUserExist();
    // eslint-disable-next-line
  }, []);

  const values = {
    firebaseMethods: {
      signUpWithGoogle,
      uploadImages,
      getAllImages,
      logoutUser,
    },
    states: {
      isLoading,
      user,
      isUploading,
      loader,
      imagesData,
    },
    accessToken,
  };

  return (
    <FirebaseContext.Provider value={values}>
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext, FirebaseProvider };

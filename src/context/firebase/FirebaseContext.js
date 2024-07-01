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
  getDefaultValue,
  removeDataFromLocalStorage,
  setDataToLocalStorage,
} from "../../utility/utils";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const FirebaseContext = createContext();

const FirebaseProvider = ({ children }) => {
  // FIREBASE
  const auth = getAuth(MY_APP);
  const googleProvider = new GoogleAuthProvider();
  const storage = getStorage(MY_APP);
  const db = getFirestore(MY_APP);

  // DEFAULT VALUES
  const filters = getDefaultValue();

  // hooks
  const toast = useToast();

  // REACT ROUTER
  const navigate = useNavigate();

  // states
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [imagesData, setImagesData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [image, setImage] = useState(null);

  // LOACL STORAGE
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
        name: img.name,
        email: user?.email,
        url,
        type: img.type,
        brightness: filters.brightness.value,
        contrast: filters.contrast.value,
        grayscale: filters.grayscale.value,
        hue: filters.hue.value,
        saturation: filters.saturation.value,
        sepia: filters.sepia.value,
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
        urls.push({ id: doc.id, ...doc.data() });
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

  const getDataBasedOnId = async ({ id }) => {
    const docRef = doc(db, "images", userData?.email, "images", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setImage(docSnap.data());
    }
  };

  const updateImageData = async ({ id, updatedData }) => {
    try {
      const docRef = doc(db, "images", user?.email, "images", id);
      await setDoc(docRef, { ...updatedData }, { merge: true });

      // Update local state if necessary
      setImagesData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, ...updatedData } : item
        )
      );
    } catch (error) {
      console.log("error: ", error);
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
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
      getDataBasedOnId,
      updateImageData,
    },
    states: {
      isLoading,
      user,
      isUploading,
      loader,
      imagesData,
      image,
      setImage,
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

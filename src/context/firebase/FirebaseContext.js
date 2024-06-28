import { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import MY_APP from "../../firebase/config/index";
import { useToast } from "@chakra-ui/react";
import { createCookie, getCookie } from "../../utility/utils";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";

const FirebaseContext = createContext();

const FirebaseProvider = ({ children }) => {
  const auth = getAuth(MY_APP);
  const googleProvider = new GoogleAuthProvider();
  const storage = getStorage(MY_APP);
  const imageListRef = ref(storage, "images/");

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
  const accessToken = getCookie("Access Token");

  const signUpWithGoogle = async () => {
    setIsLoading(true);
    await signInWithPopup(auth, googleProvider)
      .then((result) => {
        createCookie("Access Token", result?.user?.accessToken);
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

  const uploadImages = ({ img, closeUploadModal }) => {
    try {
      setIsUploading(true);
      const imgRef = ref(storage, `images/${img.name + v4()}`);
      uploadBytes(imgRef, img)
        .then((snapshot) => {
          setIsUploading(false);
          toast({
            title: "Image uploaded successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          closeUploadModal();
          getDownloadURL(snapshot.ref).then((url) => {
            setImagesData((prev) => [...prev, url]);
          });
        })
        .catch((error) => {
          setIsUploading(false);
          toast({
            title: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          closeUploadModal();
        })
        .finally(() => {
          setIsUploading(false);
          closeUploadModal();
        });
    } catch (error) {
      setIsUploading(false);
      closeUploadModal();
    }
  };

  const getAllImages = () => {
    setLoader(true);
    listAll(imageListRef)
      .then((response) => {
        response?.items?.forEach((ele) => {
          getDownloadURL(ele).then((url) => {
            setImagesData((prev) => [...prev, url]);
            setLoader(false);
          });
        });
      })
      .catch(() => {
        setLoader(false);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    isUserExist();
    getAllImages();
    // eslint-disable-next-line
  }, []);

  const values = {
    firebaseMethods: {
      signUpWithGoogle,
      uploadImages,
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

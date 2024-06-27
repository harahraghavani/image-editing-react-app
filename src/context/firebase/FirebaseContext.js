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

const FirebaseContext = createContext();

const FirebaseProvider = ({ children }) => {
  const auth = getAuth(MY_APP);
  const googleProvider = new GoogleAuthProvider();
  const storage = getStorage(MY_APP);

  // states
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

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

  const handleUploadImage = async ({ imageData, closeModal }) => {
    setIsImageUploading(true);
    const imageRef = ref(storage, `images/${imageData}`);
    await uploadBytes(imageRef, imageData)
      .then(() => {
        setIsImageUploading(false);
        closeModal();
      })
      .catch((error) => {
        setIsImageUploading(false);
        toast({
          title: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        closeModal();
      })
      .finally(() => {
        setIsImageUploading(false);
        closeModal();
      });
    setIsImageUploading(false);
  };

  const fetchImages = async () => {
    const imagesListRef = ref(storage, "images/");
    const imageRefs = await listAll(imagesListRef);
    const imageUrls = await Promise.all(
      imageRefs.items.map((itemRef) => getDownloadURL(itemRef))
    );
    return imageUrls;
  };

  useEffect(() => {
    isUserExist();
    // eslint-disable-next-line
  }, []);

  const values = {
    firebaseMethods: {
      signUpWithGoogle,
      handleUploadImage,
      fetchImages,
    },
    states: {
      isLoading,
      user,
      isImageUploading,
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

import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import MY_APP from "../../firebase/config/index";
import { useToast } from "@chakra-ui/react";
import { createCookie, getCookie } from "../../utility/utils";
import { useNavigate } from "react-router-dom";

const FirebaseContext = createContext();

const FirebaseProvider = ({ children }) => {
    const auth = getAuth(MY_APP);
    const googleProvider = new GoogleAuthProvider();

    // states
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null)

    // hooks
    const toast = useToast();
    const navigate = useNavigate();

    // cookies data
    const accessToken = getCookie("Access Token");


    const signUpWithGoogle = () => {
        setIsLoading(true);
        signInWithPopup(auth, googleProvider)
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
                })
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const isUserExist = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser(null)
            }
        })
    }

    useEffect(() => {
        isUserExist()
        // eslint-disable-next-line
    }, [])



    const values = {
        firebaseMethods: {
            signUpWithGoogle,
        },
        states: {
            isLoading,
            user
        },
        accessToken
    };

    return (
        <FirebaseContext.Provider value={values}>
            {children}
        </FirebaseContext.Provider>
    );
};

export { FirebaseContext, FirebaseProvider };

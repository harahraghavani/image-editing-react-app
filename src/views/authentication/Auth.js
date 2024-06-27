import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";
import { useFirebase } from "../../hooks/firebase/useFirebase";

const Auth = () => {
  const { firebaseMethods, states } = useFirebase();

  // destructuring the states
  const { signUpWithGoogle } = firebaseMethods;
  const { isLoading } = states;

  return (
    <Flex h="100svh" alignItems="center" justifyContent="center">
      <Button
        leftIcon={<FaGoogle />}
        variant="solid"
        onClick={signUpWithGoogle}
        isLoading={isLoading}
        isDisabled={isLoading}
        loadingText="Authenticating..."
      >
        Signin with Google
      </Button>
    </Flex>
  );
};

export default Auth;

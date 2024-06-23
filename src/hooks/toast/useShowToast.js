import { useToast } from "@chakra-ui/react";

export const useShowToast = ({
    message = "",
    duration = 3000,
    status = "success",
    position = "top-right",
    close = false
}) => {
    const toast = useToast({
        title: message,
        duration,
        status,
        position,
        isClosable: close,
    });

    return { toast };
};

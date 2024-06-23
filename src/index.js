import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { FirebaseProvider } from "./context/firebase/FirebaseContext";
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ChakraProvider>
        <BrowserRouter>
            <FirebaseProvider>
                <App />
            </FirebaseProvider>
        </BrowserRouter>
    </ChakraProvider>
);

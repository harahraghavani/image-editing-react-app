import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { FirebaseProvider } from "./context/firebase/FirebaseContext";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/theme/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <BrowserRouter>
      <FirebaseProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </FirebaseProvider>
    </BrowserRouter>
  </ChakraProvider>
);

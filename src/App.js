import { Route, Routes } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./router/PrivateRoute";
import { Suspense, lazy } from "react";

// pages
const AuthPage = lazy(() => import("./views/authentication/Auth"));
const HomePage = lazy(() => import("./views/Home/Home"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={null}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/authentication" element={<AuthPage />} />
          {/* PRIVATE ROUTES  */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/*" element={<HomePage />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CustomChallenge from "./routes/custom-challenge";
import CreateAccount from "./routes/create-account";
import { createGlobalStyle } from "styled-components";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import { ProtectedRoute } from "./components/protected-route";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "/custom-challenge",
        element: <CustomChallenge />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/create-account",
    element: <CreateAccount />,
  },
]);

const GlobalStyles = createGlobalStyle`
  *{
    box-sizing: border-box;
  };
  html {
    font-size: 10px;
  }
  body {
    display: flex;
    justify-content: center;
    margin: 0;
    color: black;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #F3E2D7;
  }
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </>
  );
}

export default App;

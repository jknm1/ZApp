import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { SplashScreen } from "./components/SplashScreen";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState, useEffect } from "react";

// Replace with your actual Google OAuth Client ID from https://console.cloud.google.com/
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [hasShownSplash, setHasShownSplash] = useState(false);

  useEffect(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem("splash_shown");
    if (splashShown) {
      setShowSplash(false);
      setHasShownSplash(true);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("splash_shown", "true");
    setShowSplash(false);
    setHasShownSplash(true);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        {showSplash && !hasShownSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
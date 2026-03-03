import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { SplashScreen } from "./components/SplashScreen";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";

// Google OAuth Client ID - Production Configuration
const GOOGLE_CLIENT_ID = "1053937514105-s2pk36uirmvqculcgs23tdc7ggfnieea.apps.googleusercontent.com";

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

    // Set favicon dynamically
    const setFavicon = () => {
      // Remove existing favicon if any
      const existingFavicon = document.querySelector("link[rel*='icon']");
      if (existingFavicon) {
        existingFavicon.remove();
      }

      // Create SVG favicon data URL
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:rgb(236, 72, 153);stop-opacity:1" />
              <stop offset="50%" style="stop-color:rgb(219, 39, 119);stop-opacity:1" />
              <stop offset="100%" style="stop-color:rgb(225, 29, 72);stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="20" fill="url(#grad)"/>
          <text x="50" y="73" font-family="Arial, sans-serif" font-size="70" font-weight="900" fill="white" text-anchor="middle">Z</text>
        </svg>
      `;
      
      const favicon = document.createElement("link");
      favicon.rel = "icon";
      favicon.type = "image/svg+xml";
      favicon.href = "data:image/svg+xml," + encodeURIComponent(svg.trim());
      document.head.appendChild(favicon);

      // Also set title
      document.title = "ZYNX CAPITAL - Trade with Confidence";
    };

    setFavicon();
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
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
            },
          }}
        />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
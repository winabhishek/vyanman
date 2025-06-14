
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import Chat from "./pages/Chat";
import MeditationPage from "./pages/MeditationPage";
import CBTPage from "./pages/CBTPage";
import EnhancedCBTPage from "./pages/EnhancedCBTPage";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/meditation" element={<MeditationPage />} />
                    <Route path="/cbt" element={<CBTPage />} />
                    <Route path="/enhanced-cbt" element={<EnhancedCBTPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/auth" element={<Login />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;

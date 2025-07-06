
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./components/MainLayout";
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import CinematicOnboardingPage from "./pages/CinematicOnboardingPage";
import Chat from "./pages/Chat";
import MeditationPage from "./pages/MeditationPage";
import CBTPage from "./pages/CBTPage";
import EnhancedCBTPage from "./pages/EnhancedCBTPage";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import DigitalDetoxPage from "./pages/DigitalDetoxPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

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
                    <Route path="/" element={
                      <MainLayout>
                        <LandingPage />
                      </MainLayout>
                    } />
                    <Route path="/onboarding" element={
                      <MainLayout>
                        <OnboardingPage />
                      </MainLayout>
                    } />
                    <Route path="/cinematic-onboarding" element={
                      <MainLayout>
                        <CinematicOnboardingPage />
                      </MainLayout>
                    } />
                    <Route path="/chat" element={
                      <MainLayout>
                        <Chat />
                      </MainLayout>
                    } />
                    <Route path="/meditation" element={
                      <MainLayout>
                        <MeditationPage />
                      </MainLayout>
                    } />
                    <Route path="/mood-tracker" element={
                      <MainLayout>
                        <MoodTrackerPage />
                      </MainLayout>
                    } />
                    <Route path="/digital-detox" element={
                      <MainLayout>
                        <DigitalDetoxPage />
                      </MainLayout>
                    } />
                    <Route path="/cbt" element={
                      <MainLayout>
                        <CBTPage />
                      </MainLayout>
                    } />
                    <Route path="/enhanced-cbt" element={
                      <MainLayout>
                        <EnhancedCBTPage />
                      </MainLayout>
                    } />
                    <Route path="/profile" element={
                      <MainLayout>
                        <Profile />
                      </MainLayout>
                    } />
                    <Route path="/login" element={
                      <MainLayout>
                        <Login />
                      </MainLayout>
                    } />
                    <Route path="/auth" element={
                      <MainLayout>
                        <Login />
                      </MainLayout>
                    } />
                    <Route path="/auth/callback" element={
                      <MainLayout>
                        <AuthCallback />
                      </MainLayout>
                    } />
                    <Route path="/about" element={
                      <MainLayout>
                        <About />
                      </MainLayout>
                    } />
                    <Route path="*" element={
                      <MainLayout>
                        <NotFound />
                      </MainLayout>
                    } />
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

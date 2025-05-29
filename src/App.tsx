
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from "./components/MainLayout";

// Import all page components
import LandingPage from "./pages/LandingPage";
import Chat from "./pages/Chat";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import MeditationPage from "./pages/MeditationPage";
import DigitalDetoxPage from "./pages/DigitalDetoxPage";
import Login from "./pages/Login";
import About from "./pages/About";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CBTPage from "./pages/CBTPage";

// Add Google Fonts - these will be loaded via our index.css import
// The fonts imported are:
// - Inter: Clean, modern sans-serif for body text
// - Poppins: Contemporary, friendly heading font

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
                  <Route path="/chat" element={<MainLayout><Chat /></MainLayout>} />
                  <Route path="/mood-tracker" element={<MainLayout><MoodTrackerPage /></MainLayout>} />
                  <Route path="/meditation" element={<MainLayout><MeditationPage /></MainLayout>} />
                  <Route path="/digital-detox" element={<MainLayout><DigitalDetoxPage /></MainLayout>} />
                  <Route path="/cbt" element={<MainLayout><CBTPage /></MainLayout>} />
                  <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
                  <Route path="/about" element={<MainLayout><About /></MainLayout>} />
                  <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

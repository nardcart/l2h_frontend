import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Blogs from "./pages/Blogs";
import SuccessStories from "./pages/SuccessStories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          {/* Placeholder routes for remaining pages */}
          <Route path="/ebooks" element={<div className="pt-16 p-8 text-center"><h1 className="text-4xl font-bold">Ebooks - Coming Soon</h1></div>} />
          <Route path="/jobs" element={<div className="pt-16 p-8 text-center"><h1 className="text-4xl font-bold">Jobs - Coming Soon</h1></div>} />
          <Route path="/partnerships" element={<div className="pt-16 p-8 text-center"><h1 className="text-4xl font-bold">Partnerships - Coming Soon</h1></div>} />
          <Route path="/courses/:category" element={<Courses />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

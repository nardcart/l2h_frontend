import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import SuccessStories from "./pages/SuccessStories";
import Jobs from "./pages/Jobs";
import Ebooks from "./pages/Ebooks";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import QualityPolicy from "./pages/QualityPolicy";
import RefundsCancellation from "./pages/RefundsCancellation";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import BlogList from "./pages/admin/BlogList";
import BlogCreate from "./pages/admin/BlogCreate";
import CategoryList from "./pages/admin/categories/CategoryList";
import CategoryCreate from "./pages/admin/categories/CategoryCreate";
import EbookManagement from "./pages/admin/EbookManagement";
import EbookEmailManager from "./pages/admin/EbookEmailManager";
import UserManagement from "./pages/admin/UserManagement";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin Login (No Layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Admin Routes (With Layout) - Protected */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="blogs" element={<BlogList />} />
            <Route path="blogs/create" element={<BlogCreate />} />
            <Route path="blogs/:id/edit" element={<BlogCreate />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/create" element={<CategoryCreate />} />
            <Route path="categories/:id/edit" element={<CategoryCreate />} />
            <Route path="ebooks" element={<EbookManagement />} />
            <Route path="ebooks/emails" element={<EbookEmailManager />} />
            <Route path="comments" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Comments - Coming Soon</h2></div>} />
            <Route path="authors" element={<UserManagement />} />
            <Route path="newsletter" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Newsletter - Coming Soon</h2></div>} />
            <Route path="analytics" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Analytics - Coming Soon</h2></div>} />
            <Route path="settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Settings - Coming Soon</h2></div>} />
          </Route>

          {/* Public Routes (With Navigation) */}
          <Route path="/*" element={
            <>
              <Navigation />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/success-stories" element={<SuccessStories />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/ebooks" element={<Ebooks />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/quality-policy" element={<QualityPolicy />} />
                <Route path="/refunds-cancellation" element={<RefundsCancellation />} />
                <Route path="/partnerships" element={<div className="pt-16 p-8 text-center"><h1 className="text-4xl font-bold">Partnerships - Coming Soon</h1></div>} />
                <Route path="/courses/:category" element={<Courses />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

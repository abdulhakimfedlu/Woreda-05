import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Announcements } from './pages/Announcements';
import { Services } from './pages/Services';
import { ServiceDetails } from './pages/ServiceDetails';
import { ServiceDetailsIndex } from './pages/ServiceDetailsIndex';
import { Gallery } from './pages/Gallery';
import { Messages } from './pages/Messages';
import { Login } from './pages/Login';
import { ManageAdmins } from './pages/ManageAdmins';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute() {
  const { token, loading } = useAuth();
  
  if (loading) return null;
  
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
             <Route path="/" element={<Layout />}>
               <Route index element={<Dashboard />} />
               <Route path="announcements" element={<Announcements />} />
               <Route path="services" element={<Services />} />
               <Route path="service-details" element={<ServiceDetailsIndex />} />
               <Route path="service-details/:id" element={<ServiceDetails />} />
               <Route path="gallery" element={<Gallery />} />
               <Route path="messages" element={<Messages />} />
               <Route path="manage-admins" element={<ManageAdmins />} />
             </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </AuthProvider>
  )
}

export default App;
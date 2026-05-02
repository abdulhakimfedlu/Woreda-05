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
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPassword } from './pages/ForgotPassword';
import { ManageAdmins } from './pages/ManageAdmins';
import { LanguageProvider } from './context/LanguageContext';
import { AuthGuard } from './components/AuthGuard';

function App() {
  return (
    <LanguageProvider>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<AuthGuard />}>
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
  )
}

export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Announcements } from './pages/Announcements';
import { Services } from './pages/Services';
import { ServiceDetails } from './pages/ServiceDetails';
import { Gallery } from './pages/Gallery';
import { Messages } from './pages/Messages';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="services" element={<Services />} />
            <Route path="service-details" element={<ServiceDetails />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App;
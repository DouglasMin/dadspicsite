import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { Gallery } from '@/pages/Gallery';
import { ArtworkDetail } from '@/pages/ArtworkDetail';
import { Exhibitions } from '@/pages/Exhibitions';
import { Contact } from '@/pages/Contact';
import { Login } from '@/pages/Login';
import { Admin } from '@/pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="artwork/:id" element={<ArtworkDetail />} />
          <Route path="exhibitions" element={<Exhibitions />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        {/* Auth routes without Layout */}
        <Route path="login" element={<Login />} />
        <Route path="admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
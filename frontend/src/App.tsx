import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { Gallery } from '@/pages/Gallery';
import { ArtworkDetail } from '@/pages/ArtworkDetail';
import { Exhibitions } from '@/pages/Exhibitions';
import { Contact } from '@/pages/Contact';

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
          {/* Admin route will be added later */}
          <Route path="admin" element={<div className="container mx-auto px-4 py-20 text-center">Admin dashboard coming soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
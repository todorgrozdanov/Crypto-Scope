import Home from "./pages/Home.tsx";
import Crypto from "./pages/Crypto.tsx";
import Navbar from "./layout/Navbar.tsx";
import Footer from "./layout/Footer.tsx";
import { Routes, Route } from "react-router-dom";


function App() {

  return (
      <>
          <Navbar />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/crypto/:coinGeckoId" element={<Crypto />} />
          </Routes>
          <Footer />
      </>
  )
}

export default App

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Produtos from "./pages/Produtos";
import Estoque from "./pages/estoque";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/estoque" element={<Estoque />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

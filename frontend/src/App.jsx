import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicInquiry from "./pages/PublicInquiry";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicInquiry />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

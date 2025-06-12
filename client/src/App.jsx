import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ConcernsPage from "./pages/ConcernsPage";
import ConcernDetailPage from "./pages/ConcernDetailPage";
import DonationPage from "./pages/DonationPage";
import GoogleSuccess from "./components/common/GoogleSuccess";
import NotFoundPage from "./pages/NotFoundPage";
// Add other pages as you build them

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/google/success" element={<GoogleSuccess />} />
          <Route path="/concerns" element={<ConcernsPage />} />
          <Route path="/concerns/:id" element={<ConcernDetailPage />} />
          <Route path="/donate" element={<DonationPage />} />
          {/* Add more routes as you build more pages */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
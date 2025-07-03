import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ConcernsPage from "./pages/ConcernsPage";
import ConcernDetailPage from "./pages/ConcernDetailPage";
import CommunityPage from "./pages/CommunityPage";
import CommunityDetailPage from "./pages/CommunityDetailPage";
import CommunityDiscussion from "./pages/CommunityDiscussion";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import DonationPage from "./pages/DonationPage";
import GoogleSuccess from "./components/common/GoogleSuccess";
import NotFoundPage from "./pages/NotFoundPage";

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
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/:id" element={<CommunityDetailPage />} />
          <Route path="/community/:id/discussions/:discussionId" element={<CommunityDiscussion />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/profile/:id/edit" element={<EditProfilePage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
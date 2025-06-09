import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import ConcernList from "./components/ConcernList";
import CreateConcernForm from "./components/CreateConcernForm";
import GoogleSuccess from "./components/GoogleSuccess";

function MainApp({ user, setUser, refresh, setRefresh }) {
  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">RaiseIt Concerns</h1>
      <button
        className="mb-4 bg-gray-200 px-3 py-1 rounded"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }}
      >
        Logout
      </button>
      <CreateConcernForm onCreated={() => setRefresh((r) => r + 1)} />
      <div className="my-8" />
      <ConcernList refresh={refresh} onRefresh={() => setRefresh((r) => r + 1)} />
    </div>
  );
}

function App() {
  const [refresh, setRefresh] = useState(0);
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <AuthPage onAuthSuccess={setUser} />
            ) : (
              <MainApp
                user={user}
                setUser={setUser}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            )
          }
        />
        <Route path="/auth/google/success" element={<GoogleSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
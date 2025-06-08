import { useState } from "react";
import AuthPage from "./components/AuthPage";
import ConcernList from "./components/ConcernList";
import CreateConcernForm from "./components/CreateConcernForm";

function App() {
  const [refresh, setRefresh] = useState(0);
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );

  if (!user) {
    return <AuthPage onAuthSuccess={setUser} />;
  }

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

export default App;
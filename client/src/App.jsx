import ConcernList from "./components/ConcernList";
import CreateConcernForm from "./components/CreateConcernForm";
import { useState } from "react";

function App() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">RaiseIt Concerns</h1>
      <CreateConcernForm onCreated={() => setRefresh((r) => r + 1)} />
      <div className="my-8" />
      <ConcernList key={refresh} />
    </div>
  );
}

export default App;
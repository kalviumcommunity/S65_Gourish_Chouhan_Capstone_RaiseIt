import { useNavigate } from "react-router-dom";
import CreateConcernForm from "../components/common/CreateConcernForm";

export default function CreateConcernPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Raise a Concern</h1>
        <p className="text-muted-foreground">
          Share the issue clearly so the community can understand and support it.
        </p>
      </div>
      <CreateConcernForm onCreated={() => navigate("/concerns")} />
    </div>
  );
}

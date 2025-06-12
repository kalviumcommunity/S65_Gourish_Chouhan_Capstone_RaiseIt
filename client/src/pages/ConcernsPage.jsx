import ConcernList from "../components/common/ConcernList";
import CreateConcernForm from "../components/common/CreateConcernForm";

export default function ConcernsPage() {
  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">All Concerns</h1>
      <CreateConcernForm />
      <div className="my-8" />
      <ConcernList />
    </div>
  );
}
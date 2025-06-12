import DonateForm from "../components/common/DonateForm";

export default function DonationPage() {
  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Support a Cause</h1>
      <DonateForm />
    </div>
  );
}
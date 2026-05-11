import { useEffect, useState } from "react";
import { IndianRupee, Shield, CheckCircle, Heart, ArrowRight, FolderHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import DonateForm from "@/components/common/DonateForm";
import { getCauses } from "../services/api";

export default function DonationPage() {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCauses()
      .then(setCauses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2"><Shield className="h-4 w-4" /><span>Secure Razorpay Checkout</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /><span>Admin-Managed Causes</span></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800">
            <Heart className="h-4 w-4" /> Support causes listed by RaiseIt admins
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Fund Work That Needs Support
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
            Choose a cause and donate through a secure payment flow. Donation records are saved to your profile when you are logged in.
          </p>
        </div>

        {loading && <div className="py-12 text-center text-gray-500">Loading causes...</div>}
        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700">{error}</div>}

        {!loading && !error && !causes.length && (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <FolderHeart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h2 className="text-2xl font-semibold">No active causes yet</h2>
            <p className="mt-2 text-gray-600">An admin can add causes from the admin dashboard.</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {causes.map((cause) => <CauseCard key={cause._id} cause={cause} />)}
        </div>

        <div className="mt-20 rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h3 className="mb-3 text-2xl font-bold text-gray-900">Before You Donate</h3>
          <p className="mx-auto max-w-3xl text-gray-600">
            RaiseIt stores payment status and cause details for transparency inside the app. Organization verification, tax receipts, and impact reporting should be confirmed with the receiving organization before making large donations.
          </p>
        </div>
      </div>
    </div>
  );
}

function CauseCard({ cause }) {
  const initials = cause.logo || cause.name.split(" ").map((part) => part[0]).join("").slice(0, 3).toUpperCase();
  const urgencyClass = cause.urgency === "high" ? "bg-red-100 text-red-800 border-red-200" : cause.urgency === "low" ? "bg-green-100 text-green-800 border-green-200" : "bg-yellow-100 text-yellow-800 border-yellow-200";

  return (
    <Dialog>
      <Card className="h-full overflow-hidden border-0 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <CardHeader className="p-0">
          {cause.image ? <img src={cause.image} alt="" className="h-48 w-full object-cover" /> : <div className="h-2 bg-black" />}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-black text-sm font-semibold text-white shadow-lg">{initials}</div>
                <div>
                  <CardTitle className="text-xl text-gray-900">{cause.name}</CardTitle>
                  <Badge variant="outline" className="mt-2 text-xs">{cause.category}</Badge>
                  <CardDescription className="mt-3 leading-relaxed text-gray-600">{cause.mission}</CardDescription>
                </div>
              </div>
              <Badge className={`text-xs ${urgencyClass}`}>{cause.urgency === "high" ? "Urgent" : cause.urgency === "low" ? "Ongoing" : "Active"}</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-6">
          {cause.impact && <InfoBlock title="Current Need" text={cause.impact} />}
          {cause.featuredProject && <InfoBlock title="Featured Project" text={cause.featuredProject} compact />}
        </CardContent>

        <CardFooter className="border-t bg-white p-4">
          <div className="flex w-full items-center justify-between gap-3">
            <Button variant="outline" className="border-gray-300 hover:border-gray-400 hover:bg-white" disabled>
              Details on card <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-black px-6 text-white shadow-lg transition-all duration-200 hover:bg-yellow-500 hover:shadow-xl">
                <IndianRupee className="mr-2 h-4 w-4" /> Donate Now
              </Button>
            </DialogTrigger>
          </div>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-black" /> Donate to {cause.name}</DialogTitle>
          <DialogDescription className="text-left">Your contribution will be recorded against this cause after successful payment verification.</DialogDescription>
        </DialogHeader>
        <DonateForm cause={{ ...cause, id: cause._id }} />
      </DialogContent>
    </Dialog>
  );
}

function InfoBlock({ title, text, compact = false }) {
  return (
    <div className={compact ? "border-l-4 border-black pl-4" : "rounded-lg border border-gray-200 bg-gray-50 p-4"}>
      <h4 className="mb-1 text-sm font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-700">{text}</p>
    </div>
  );
}

import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function DonationResultPage() {
  const [params] = useSearchParams();
  const status = params.get("status");
  const paymentId = params.get("paymentId");
  const message = params.get("message");
  const isSuccess = status === "success";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-12">
      <Card className="w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            {isSuccess ? <CheckCircle className="h-8 w-8 text-green-600" /> : <XCircle className="h-8 w-8 text-red-600" />}
          </div>
          <CardTitle>{isSuccess ? "Donation Successful" : "Donation Failed"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isSuccess
              ? "Thank you for supporting RaiseIt. Your donation has been verified and recorded."
              : message || "Your payment could not be completed. Please try again."}
          </p>
          {paymentId && <p className="text-sm text-muted-foreground">Payment ID: {paymentId}</p>}
          <div className="flex justify-center gap-3">
            <Button asChild><Link to="/donate">Back to Donations</Link></Button>
            <Button variant="outline" asChild><Link to="/">Go Home</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

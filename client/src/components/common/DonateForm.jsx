import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RAZORPAY_KEY_ID } from "../../config";
import { createPaymentOrder, verifyPayment } from "../../services/api";

export default function DonateForm({ cause }) {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDonate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!window.Razorpay) throw new Error("Razorpay checkout script is not loaded");
      if (!RAZORPAY_KEY_ID) throw new Error("Razorpay key is missing in client/.env");

      const order = await createPaymentOrder(Number(amount), {
        causeId: cause?.id || "",
        causeName: cause?.name || "RaiseIt Platform Support",
      });

      // 2. Open Razorpay checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "RaiseIt",
        description: cause?.name ? `Donation to ${cause.name}` : "Donation",
        handler: async function (response) {
          await verifyPayment(response);
          navigate(`/donate/result?status=success&paymentId=${response.razorpay_payment_id}`);
        },
        prefill: {},
        theme: { color: "#3399cc" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      navigate(`/donate/result?status=failed&message=${encodeURIComponent(err.message)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDonate} className="space-y-3 rounded-xl border p-4">
      <input
        type="number"
        min="1"
        className="w-full rounded-md border p-2"
        placeholder="Amount (INR)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full rounded-md bg-black px-4 py-2 text-white disabled:bg-gray-300"
        disabled={loading}
      >
        {loading ? "Processing..." : "Donate Securely"}
      </button>
    </form>
  );
}

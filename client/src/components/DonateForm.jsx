import { useState } from "react";

export default function DonateForm() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDonate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create order on backend
      const res = await fetch("https://raiseit.onrender.com/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const order = await res.json();

      // 2. Open Razorpay checkout
      const options = {
        key: "rzp_test_ZhK2KbZnynAlPL",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "RaiseIt",
        description: "Donation",
        handler: function (response) {
          alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        },
        prefill: {},
        theme: { color: "#3399cc" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDonate} className="p-4 border rounded space-y-2">
      <input
        type="number"
        min="1"
        className="border p-2 w-full"
        placeholder="Amount (INR)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Donate"}
      </button>
    </form>
  );
}
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function PaymentSuccess() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [message, setMessage] = useState("Finalizing your order...");

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    const product = queryParams.get("product");
    const quantity = parseInt(queryParams.get("quantity"), 10);
    const totalPrice = parseFloat(queryParams.get("totalPrice"));
    const userId = queryParams.get("userId");
    const branchManagerId = queryParams.get("branchManagerId");
    const branchId = queryParams.get("branchId");

    if (product && userId) {
      axios
        .post("http://localhost:3001/orders", {
          product,
          quantity,
          totalPrice,
          userId,
          branchManagerId,
          branchId,
        })
        .then(() => {
          navigate(`/userpage/${userId}?status=success`);
        })
        .catch((error) => {
          const errorMsg =
            error.response?.data?.error || `Error placing order: ${error.message}`;
          const remainingStock = error.response?.data?.remainingStock;

          if (remainingStock) {
            setMessage(`Insufficient stock. You can only order up to ${remainingStock} units.`);
          } else {
            setMessage(errorMsg);
          }

          // Delay so user can read error
          setTimeout(() => {
            navigate(`/userpage/${userId}?status=fail`);
          }, 3000);
        });
    }
  }, [navigate, search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <p className="text-lg">{message}</p>
    </div>
  );
}

export default PaymentSuccess;

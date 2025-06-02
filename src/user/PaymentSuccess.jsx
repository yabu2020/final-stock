import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function PaymentSuccess() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Verifying your payment...");
  const [txRef, setTxRef] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    const processPayment = async () => {
      if (hasProcessedRef.current) return;
      hasProcessedRef.current = true;

      try {
        const params = new URLSearchParams(search);
        const tx_ref = params.get("tx_ref") || 
                      JSON.parse(sessionStorage.getItem('pendingOrder'))?.tx_ref;

        if (!tx_ref) {
          throw new Error("Transaction reference not found");
        }

        setTxRef(tx_ref);
        setMessage(`Verifying payment ${tx_ref}...`);

        const verifyPayment = async (attempt = 1) => {
          try {
            const response = await axios.post('http://localhost:3001/api/payments/verify', {
              tx_ref: tx_ref
            }, {
              timeout: 8000
            });

            if (!response.data.success) {
              throw new Error(response.data.error || 'Payment verification failed');
            }

            return response.data.data;
          } catch (error) {
            if (attempt < 3) {
              console.log(`Retrying verification (attempt ${attempt + 1})...`);
              await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
              return verifyPayment(attempt + 1);
            }
            throw error;
          }
        };

        const paymentData = await verifyPayment();

        const orderData = JSON.parse(sessionStorage.getItem('pendingOrder'));

        if (!orderData) {
          throw new Error("Order data not found");
        }

        setMessage("Creating your order...");
        const orderResponse = await axios.post('http://localhost:3001/orders', {
          ...orderData,
          paymentVerified: true,
          paymentData: paymentData
        });

        sessionStorage.removeItem('pendingOrder');

        setStatus("success");
        setMessage("Payment and order processed successfully!");

        setTimeout(() => {
          navigate('/user/Userpage', {
            state: {
              paymentSuccess: true,
              order: orderResponse.data
            },
            replace: true
          });
        }, 3000);

      } catch (error) {
        console.error("Payment processing error:", error);
        setStatus("error");
        setMessage(
          error.response?.data?.error ||
          error.message ||
          "Payment processing failed"
        );

        if (error.message.includes("not found") || error.message.includes("timeout")) {
          setRetryCount(prev => prev + 1);
        } else {
          setTimeout(() => {
            navigate('/user/Userpage', {
              state: {
                paymentError: message
              },
              replace: true
            });
          }, 5000);
        }
      }
    };

    processPayment();
  }, [search, navigate, retryCount]);

  const handleRetry = () => {
    setStatus("processing");
    setMessage("Retrying payment verification...");
    setRetryCount(prev => prev + 1);
  };

  const handleCancel = () => {
    localStorage.removeItem('pendingOrder');
    sessionStorage.removeItem('pendingOrder');
    navigate('/user/Userpage');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          {status === "success" ? "✅ Payment Successful" : 
           status === "error" ? "❌ Payment Error" : "Processing Payment"}
        </h2>
        
        <div className="mb-6">
          <p className="mb-2">{message}</p>
          {txRef && (
            <p className="text-sm text-gray-400">
              Transaction: {txRef}
            </p>
          )}
        </div>

        {status === "error" && retryCount < 3 && (
          <div className="flex gap-4">
            <button
              onClick={handleRetry}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {status === "success" && (
          <p className="text-green-300">Redirecting to your orders...</p>
        )}

        {status === "error" && retryCount >= 3 && (
          <p className="text-red-300">Please contact support with your transaction reference.</p>
        )}
      </div>
    </div>
  );
}

export default PaymentSuccess;
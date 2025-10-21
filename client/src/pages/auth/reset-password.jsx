// import React, { useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const ResetPassword = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password/${token}`,
//         { password }
//       );

//       toast.success(res.data.message || "Password reset successful!");
//       navigate("/auth/login");
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || "Error resetting password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* Left Section */}
//       <div className="hidden md:flex w-1/2 bg-black text-white flex-col items-center justify-center p-8">
//         <h1 className="text-3xl font-bold mb-4 text-center">
//           Welcome to Forever Shopping Site
//         </h1>
//         <p className="text-gray-300 text-center max-w-sm">
//           Shop the latest trends with ease and security.
//         </p>
//       </div>

//       {/* Right Section */}
//       <div className="flex w-full md:w-1/2 items-center justify-center bg-white p-6">
//         <div className="w-full max-w-md">
//           <h2 className="text-3xl font-bold text-center text-gray-800">
//             Reset your password
//           </h2>
//           <p className="text-sm text-center text-gray-900 mt-2 mb-6">
//             Enter your new password below
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-black-900">
//                 New Password
//               </label>
//               <input
//                 type="password"
//                 placeholder="Enter new password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 minLength={6}
//                 className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-black-800">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 placeholder="Confirm new password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 minLength={6}
//                 className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full bg-black text-white py-2 rounded font-medium mt-4 transition ${
//                 loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-900"
//               }`}
//             >
//               {loading ? "Resetting..." : "Reset Password"}
//             </button>

//             <p className="text-center text-sm mt-4">
//               Remember your password?{" "}
//               <Link
//                 to="/auth/login"
//                 className="text-black font-medium hover:underline"
//               >
//                 Login
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;


import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";


const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password/${token}`,
        { password }
      );

      toast.success(res.data.message || "Password reset successful!");
      navigate("/auth/login");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-black text-white flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Welcome to Forever Shopping Site
        </h1>
        <p className="text-gray-300 text-center max-w-sm">
          Shop the latest trends with ease and security.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white p-6">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Reset your password
          </h2>
          <p className="text-sm text-center text-gray-900 mt-2 mb-6">
            Enter your new password below
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-black-900">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black-800">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-black text-white py-2 rounded font-medium mt-4 transition ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-900"
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <p className="text-center text-sm mt-4">
              Remember your password?{" "}
              <Link
                to="/auth/login"
                className="text-black font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;


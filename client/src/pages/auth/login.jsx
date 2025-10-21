import CommonForm from "@/components/common/form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    dispatch(loginUser(formData))
      .then((data) => {
        if (data?.payload?.success) {
          toast.success(data.payload.message || "Login successful!");
          navigate("/");
        } else {
          toast.error(data.payload.message || "Invalid credentials");
        }
      })
      .catch((error) => {
        toast.error(error.message || "Something went wrong");
      });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>

      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

      <div className="text-center mt-4">
        <Link
          to="/auth/forgot"
          className="font-medium text-base text-primary hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default AuthLogin;

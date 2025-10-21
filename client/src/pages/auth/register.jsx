import CommonForm from "@/components/common/form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();

    if (!formData.userName || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    dispatch(registerUser(formData))
      .then((data) => {
        if (data?.payload?.success) {
          toast.success(data.payload.message || "Registration successful!");
          navigate("/auth/login");
        } else {
          toast.error(data.payload.message || "Registration failed");
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
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default AuthRegister;


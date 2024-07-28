import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import LoadingButton from "../../../components/LoadingButton";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";
import Icon from "@/components/ui/Icon";
import { toast } from "react-toastify";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Email tidak valid")
      .required("Email is Required"),
    password: yup.string().required("Kata sandi wajib di isi"),
  })
  .required();

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const loginHandler = async (e) => {
    setIsLoadingButton(true);
    e.preventDefault();

    const formData = new FormData();

    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await axios.post(ApiEndpoint.LOGIN, formData);
      localStorage.setItem("token", response?.data?.data?.token);
      setIsLoadingButton(false);
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.status === 500) {
        Swal.fire({
          icon: "error",
          title: "Terjadi Kesalahan Server",
          text: "Mohon maaf, terjadi kesalahan pada server.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Terjadi kesalahan.",
        });
      }
      setIsLoadingButton(false);
    }
    setIsLoadingButton(false);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  return (
    <form onSubmit={loginHandler} className="space-y-4 ">
      <Textinput
        name="email"
        label="email"
        type="email"
        register={register}
        error={errors.email}
        className="h-[48px]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Masukkan email anda"
      />

      <div className="flex items-center mb-2">
        <div className="w-full relative">
          <Textinput
            name="password"
            label="Kata Sandi"
            type={isPasswordVisible ? "text" : "password"}
            register={register}
            error={errors.password}
            className="h-[48px] form-control  py-2 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="****************"
          />

          <div
            className={`absolute top-0 right-0 ${
              errors.password ? "pr-10" : "pr-2"
            } pt-1 mt-10`}
          >
            <button
              type="button"
              className="action-btn flex"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <Icon icon="heroicons:eye-slash" />
              ) : (
                <Icon icon="heroicons:eye" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Button
        text={isLoadingButton ? <LoadingButton /> : "Masuk"}
        className="btn btn-dark block w-full text-center"
        type="submit"
        disabled={isLoadingButton}
      />
    </form>
  );
};

export default LoginForm;
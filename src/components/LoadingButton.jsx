import React from "react";
import useDarkMode from "@/hooks/useDarkMode";
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
import { useSelector } from "react-redux";
const LoadingButton = () => {
  const [isDark] = useDarkMode();
  const { isAuth } = useSelector((state) => state.auth);
  return (
    // <div className="flex w-full h-full">
    //   {!isAuth && (
    //     <div className="mb-3">
    //       <img src={isDark ? LogoWhite : Logo} alt="Logo" />
    //     </div>
    //   )}
      <svg
        className={'animate-spin inline-flex justify-center h-5 w-full'}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    // </div>
  );
};

export default LoadingButton;

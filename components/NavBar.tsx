"use client";
import React ,{useState}from "react";
import Image from "next/image";
import Logo from "../Public/logo.png";
import { UserButton, SignInButton } from "@clerk/nextjs";
import "./sign.css";
import HomeF from "./HomeF";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NavBar() {
 const [isToastShown, setIsToastShown] = useState(false); // State to track if toast has been shown

 const handleHistory = (event:any) => {
   // Prevent default link navigation
   event.preventDefault();

   // Show the toast only once
   if (!isToastShown) {
     toast.info("No history found", {
       position: "top-right",
       autoClose: 3000,
       hideProgressBar: false,
       closeOnClick: true,
       pauseOnHover: true,
       draggable: true,
     });

     // Set the flag to true so that the toast doesn't show again
     setIsToastShown(true);
   }
 };
  return (
    <div className="flex justify-between p-3 px-10 border-b-[1px] shadow-lg">
      <div className="flex gap-10 items-center ">
        <Link href={"/"}>
          <Image src={Logo} width={120} height={60} alt="Logo" />
        </Link>
        <div className="hidden md:flex gap-6">
          <Link href={"/"}>
            <h2 className="hover:bg-gray-100 p-2 rounded-md cursor-pointer transistion-all">
              Home
            </h2>
          </Link>
          <Link href="/history" onClick={handleHistory}>
            <h2
              onClick={handleHistory}
              className="hover:bg-gray-100 p-2 rounded-md cursor-pointer transistion-all"
            >
              History
            </h2>
          </Link>
        </div>
      </div>
      <div className="mt-6">
        <UserButton />
      </div>
      <SignInButton />
      <ToastContainer />
    </div>
  );
}

export default NavBar;

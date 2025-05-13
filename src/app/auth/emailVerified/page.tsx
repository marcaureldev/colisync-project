"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
const emailVeried = () => {
  const params = useSearchParams();
  const token = params?.get("token");
  const email = params?.get("email");
  const userId = params?.get("userId");
  const brand = params?.get("brand");
  const otp = params?.get("otp");
  const [existOTP, setExistOTP] = useState(false);

  useEffect(() => {
    if (otp) {
      setExistOTP(true);
    }
  }, [otp]);

  if (existOTP) {
    return (
      <div className="flex items-center justify-center flex-col h-screen">
        <SyncLoader />
        {/* <p>otp: {otp}</p> */}
      </div>
    );
  }
  return (
    <div>
      <p>token: {token}</p>
      <p>email: {email}</p>
      <p>userId:{userId}</p>
      <p>brand: {brand}</p>
    </div>
  );
};

export default emailVeried;

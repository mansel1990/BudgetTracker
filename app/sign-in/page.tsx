import { SignIn } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
};

export default page;

"use client";

import React from "react";
import PendingRequests from "./_components/PendingRequests";
import UserList from "./_components/UserList";

const page = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin</h1>
      <PendingRequests />
      <hr className="my-6 border-gray-600" />
      <UserList />
    </div>
  );
};

export default page;

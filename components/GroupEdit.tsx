"use client";

import {
  handleEditGroup,
  handleSwitchGroup,
} from "@/app/wizard/_actions/userSettings";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const fetchUserGroup = async () => {
  const response = await fetch("/api/group-details");
  if (!response.ok) throw new Error("Failed to fetch group details");
  return response.json();
};

const GroupEdit = () => {
  const [groupName, setGroupName] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [newGroupCode, setNewGroupCode] = useState("");
  const {
    data: groupDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["group-details"],
    queryFn: fetchUserGroup,
  });

  useEffect(() => {
    if (groupDetails?.group_name) {
      setGroupName(groupDetails.group_name);
    }
  }, [groupDetails]);

  const switchGroupMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("groupCode", newGroupCode);
      await handleSwitchGroup(formData);
    },
    onSuccess: () => {
      toast.success("Successfully moved to the new group!");
      setShowWarning(false);
    },
    onError: (error: Error) => {
      setShowWarning(false);
      toast.error(error.message || "Failed to join the new group.");
    },
  });

  const editGroupMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("groupName", groupName);
      await handleEditGroup(formData);
    },
    onSuccess: () => {
      toast.success("Group name updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to edit the group name.");
    },
  });

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowWarning(true);
  };

  const handleConfirmSwitch = () => {
    switchGroupMutation.mutate();
  };

  const handleCancelSwitch = () => {
    setShowWarning(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editGroupMutation.mutate();
  };

  return (
    <div className="space-y-8 md:flex md:space-x-12 md:space-y-0">
      {/* Edit Group Form */}
      <form onSubmit={handleEditSubmit} className="w-full md:w-1/2 space-y-6">
        <div className="flex flex-col space-y-4">
          <label htmlFor="groupName" className="text-lg font-semibold">
            Edit Your Group Name
          </label>
          <input
            type="text"
            id="groupName"
            name="groupName"
            placeholder="Enter group name"
            className="p-4 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            disabled={isLoading || !!error}
          />
          <p className="text-sm text-gray-500">
            Your group code is: <strong>{groupDetails?.group_id}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Ask your friends to join using this code:{" "}
            <span className="font-bold text-lg text-indigo-800">
              {groupDetails?.group_id}.
            </span>
          </p>
        </div>
        <Button
          type="submit"
          className="w-full py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 rounded-lg"
          disabled={isLoading || !!error}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>

      <div className="flex items-center justify-center text-lg text-gray-600">
        <span>OR</span>
      </div>

      {/* Join Group Form */}
      <form onSubmit={handleJoinSubmit} className="w-full md:w-1/2 space-y-6">
        <div className="flex flex-col space-y-4">
          <label htmlFor="groupCode" className="text-lg font-semibold">
            Join an Existing Group
          </label>
          <input
            type="text"
            id="groupCode"
            name="groupCode"
            placeholder="Enter group code"
            className="p-4 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
            value={newGroupCode}
            onChange={(e) => setNewGroupCode(e.target.value)}
            required
          />
          <p className="text-sm text-gray-500">
            You can join a group by using the{" "}
            <span className="font-bold text-lg text-indigo-800">
              group code
            </span>{" "}
            provided by your friend.
          </p>
        </div>
        <Button
          type="submit"
          className="w-full py-3 text-lg font-medium bg-green-600 hover:bg-green-700 rounded-lg"
          disabled={switchGroupMutation.isPending}
        >
          {switchGroupMutation.isPending ? "Joining..." : "Join Group"}
        </Button>
      </form>

      {/* Confirmation Warning */}
      {showWarning && (
        <div className="mt-6 p-4 bg-yellow-200 text-yellow-800 rounded-lg shadow-md">
          <p>
            You are currently in <strong>{groupDetails?.group_name}</strong>.
            Are you sure you want to leave your current group and join a new
            one?
          </p>
          <div className="mt-4 flex gap-4">
            <Button
              onClick={handleConfirmSwitch}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Yes, Switch Group
            </Button>
            <Button
              onClick={handleCancelSwitch}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupEdit;

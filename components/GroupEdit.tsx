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
    switchGroupMutation.mutate(); // Perform the action to switch groups
  };

  const handleCancelSwitch = () => {
    setShowWarning(false); // Close the warning without making changes
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editGroupMutation.mutate();
  };

  return (
    <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
      <form onSubmit={handleEditSubmit} className="w-full md:w-1/2 space-y-4">
        <div className="flex flex-col">
          <label htmlFor="groupName" className="text-sm font-medium mb-2">
            Edit your Group
          </label>
          <input
            type="text"
            id="groupName"
            name="groupName"
            placeholder="Enter group name"
            className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            disabled={isLoading || !!error} // Disable if loading or error occurs
          />
        </div>
        <Button
          type="submit"
          className="w-full py-3 text-lg font-medium transition-colors duration-200 bg-blue-500 hover:bg-blue-600 rounded-md"
          disabled={isLoading || !!error} // Disable if loading or error occurs
        >
          {isLoading ? "Loading..." : "Save Changes"}
        </Button>
      </form>

      <div className="flex items-center justify-center text-sm text-muted-foreground mt-4 md:mt-0">
        <span>OR</span>
      </div>

      <form onSubmit={handleJoinSubmit} className="w-full md:w-1/2 space-y-4">
        <div className="flex flex-col">
          <label htmlFor="groupCode" className="text-sm font-medium mb-2">
            Join an Existing Group
          </label>
          <input
            type="text"
            id="groupCode"
            name="groupCode"
            placeholder="Enter group code"
            className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            value={newGroupCode}
            onChange={(e) => setNewGroupCode(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full py-3 text-lg font-medium transition-colors duration-200 bg-green-500 hover:bg-green-600 rounded-md"
          disabled={switchGroupMutation.isPending}
        >
          {switchGroupMutation.isPending ? "Joining..." : "Join Group"}
        </Button>
      </form>
      {showWarning && (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-md">
          <p>
            You are currently in <strong>{groupDetails?.group_name}</strong>.
            Are you sure you want to leave your current group and join the new
            one?
          </p>
          <div className="flex space-x-4 mt-2">
            <Button
              onClick={handleConfirmSwitch}
              className="bg-green-500 text-white"
            >
              Yes, Switch Group
            </Button>
            <Button
              onClick={handleCancelSwitch}
              className="bg-red-500 text-white"
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

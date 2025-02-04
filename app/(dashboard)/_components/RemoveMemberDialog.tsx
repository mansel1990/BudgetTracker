"use client";

import React, { ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RemoveMember } from "../_actions/groups";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

interface Props {
  trigger: ReactNode;
  memberId: string;
}

const RemoveMemberDialog = ({ trigger, memberId }: Props) => {
  const queryClient = useQueryClient();
  const memberIdentifier = `member-${memberId}`;

  const removeMutation = useMutation({
    mutationFn: RemoveMember,
    onSuccess: async () => {
      toast.success(`Member removed successfully 🎉`, { id: memberIdentifier });
      await queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
    },
    onError: () => {
      toast.error(`Failed to remove member`, { id: memberIdentifier });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to remove this member?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading(`Removing member...`, { id: memberIdentifier });
              removeMutation.mutate({ userId: memberId });
            }}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveMemberDialog;

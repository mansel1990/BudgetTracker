"use client";

import { useState } from "react";
import GroupEdit from "@/components/GroupEdit";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  successCallback: () => void;
  trigger: React.ReactNode;
}

const EditGroup = ({ successCallback, trigger }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-6 max-w-lg">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>Edit Group</DialogTitle>
        </DialogHeader>
        <GroupEdit />
      </DialogContent>
    </Dialog>
  );
};

export default EditGroup;

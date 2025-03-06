"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import React, { ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "../_actions/transactions";
import { toast } from "sonner";
import { DateToUTCDate } from "@/lib/helpers";

interface Props {
  trigger: ReactNode;
  type: TransactionType;
}

const QUICK_FILL_OPTIONS = [
  { emoji: "🛍️", desc: "Amazon", category: "Shopping" },
  { emoji: "🥦", desc: "Zepto", category: "Daily Essentials" },
  { emoji: "👕", desc: "Dress", category: "Clothing" },
  { emoji: "👨‍👩‍👧", desc: "Sent money to family", category: "Family" },
  { emoji: "🏏", desc: "Cricket / Badminton", category: "Sports" },
  { emoji: "⛽", desc: "Petrol", category: "Transport" },
  { emoji: "🍔", desc: "Eating out/Ordered food", category: "Restaurant" },
  { emoji: "🧸", desc: "Baby toys or needs", category: "Baby" },
  { emoji: "🛩️", desc: "Outing", category: "Trip" },
  { emoji: "💡", desc: "Electricity Bill", category: "Bills" },
  { emoji: "💸", desc: "One-time expense", category: "One Time Expense" },
  { emoji: "🏠", desc: "Monthly rent payment", category: "Rent" },
  { emoji: "🏥", desc: "Doctor visit / Medicines", category: "Medical" },
  { emoji: "📚", desc: "School / Online Courses", category: "Education" },
];

const CreateTransactionDialog = ({ trigger, type }: Props) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
      description: "",
    },
  });

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  const handleQuickFill = useCallback(
    (desc: string, category: string) => {
      form.setValue("description", desc);
      form.setValue("category", category);
    },
    [form]
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      toast.success("Transaction created successfully 🎉", {
        id: "create-transaction",
      });
      form.reset({
        description: "",
        amount: 0,
        date: new Date(),
        type,
        category: undefined,
      });

      // After creating transaction we invalidate query to refetch data
      queryClient.invalidateQueries({
        queryKey: ["overview"],
      });

      setOpen(false);
    },
  });

  const onSubmit = useCallback(
    (values: CreateTransactionSchemaType) => {
      toast.loading("Creating transaction...", {
        id: "create-transaction",
      });

      mutate({
        ...values,
        date: DateToUTCDate(values.date),
      });
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>
            Create a new{" "}
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex-grow min-w-0">
                    <FormLabel>Category: </FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        value={form.getValues("category")} // Change from watch() to getValues()
                        onChange={handleCategoryChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-grow min-w-0">
                    <FormLabel>Transaction date: </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="pl-3 text-left font-normal flex-grow"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 overflow-hidden">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => {
                            if (!value) return;
                            field.onChange(value);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
            {type === "expense" && (
              <div className="grid grid-cols-5 gap-2 py-4">
                {QUICK_FILL_OPTIONS.map(({ emoji, desc, category }) => (
                  <button
                    key={desc}
                    type="button"
                    onClick={() => handleQuickFill(desc, category)}
                    className="p-2 rounded-lg border hover:bg-gray-200"
                  >
                    <span className="text-xl">{emoji}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionDialog;

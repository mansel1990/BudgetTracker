"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import StockSearch from "./StockSearch";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { toast } from "sonner";

// Zod schema for form validation
const tradeSchema = z.object({
  tradeType: z.enum(["buy", "sell"]),
  company_symbol: z.string().min(1, "Stock symbol is required"),
  company_name: z.string().min(1, "Company name is required"),
  price: z.coerce.number().positive("Price must be greater than zero"),
  quantity: z.coerce
    .number()
    .int()
    .positive("Quantity must be a positive integer"),
});

// Type for form values
export type TradeFormValues = z.infer<typeof tradeSchema>;

export type TradeFormRequest = {
  company_symbol: string;
  company_name: string;
  price: number;
  shares: number;
  amount: number;
  type: "buy" | "sell";
  profit_loss: number;
};

// Stock type
export type StockType = {
  company_name: string;
  company_symbol: string;
  current_market_price: number;
};

// API call to fetch stocks
const fetchStocks = async (): Promise<StockType[]> => {
  const { data } = await axios.get("/api/trades/stocks");
  return data.stocks;
};

const TradeForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TradeFormValues>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      tradeType: "buy",
      company_symbol: "",
      company_name: "",
      price: undefined,
      quantity: undefined,
    },
  });

  const tradeType = watch("tradeType");

  const { data: stocks = [], isLoading } = useQuery({
    queryKey: ["stocks"],
    queryFn: fetchStocks,
    staleTime: 60000,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: TradeFormRequest) => {
      const response = await fetch("/api/trades/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success("Trade saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      reset();
    },

    onError: (error) => {
      console.error("Error submitting trade:", error);
    },
  });

  const onSubmit = (data: TradeFormValues) => {
    console.log("Trade Data:", data);
    const formattedData = {
      company_symbol: data.company_symbol,
      company_name: data.company_name,
      price: data.price,
      shares: data.quantity,
      amount: data.price * data.quantity,
      type: data.tradeType,
      profit_loss: 0,
    };
    mutation.mutate(formattedData);
  };

  return (
    <Card
      className={`p-4 border-2 transition-all ${
        tradeType === "buy" ? "border-green-500" : "border-red-500"
      }`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Trade Type Selection */}
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium min-w-[80px]">
            Trade Type -
          </Label>
          <RadioGroup
            value={tradeType}
            onValueChange={(value) =>
              setValue("tradeType", value as "buy" | "sell")
            }
            className="flex gap-4"
          >
            <Label
              className={`px-4 py-1.5 rounded-md border cursor-pointer transition-all ${
                tradeType === "buy"
                  ? "border-green-500 bg-green-50 text-green-600 dark:bg-green-900/20"
                  : "border-muted hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value="buy" className="sr-only" />
              Buy
            </Label>
            <Label
              className={`px-4 py-1.5 rounded-md border cursor-pointer transition-all ${
                tradeType === "sell"
                  ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-900/20"
                  : "border-muted hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value="sell" className="sr-only" />
              Sell
            </Label>
          </RadioGroup>
        </div>

        {/* Stock Selection Component */}
        <SkeletonWrapper isLoading={isLoading} fullWidth={false}>
          <StockSearch
            stocks={stocks}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
        </SkeletonWrapper>

        {/* Price Input */}
        <div className="mt-4">
          <Label>Price</Label>
          <Input
            type="number"
            {...register("price")}
            placeholder="Enter price"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* Quantity Input */}
        <div className="mt-4">
          <Label>Quantity</Label>
          <Input
            type="number"
            {...register("quantity")}
            placeholder="Enter quantity"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm">{errors.quantity.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="mt-4 w-auto px-6">
          Submit
        </Button>
      </form>
    </Card>
  );
};

export default TradeForm;

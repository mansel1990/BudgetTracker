"use client";

import { useState } from "react";
import { UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCombobox } from "downshift";
import { TradeFormValues } from "./TradeForm";

// Define Type for Stock
type Stock = {
  company_name: string;
  company_symbol: string;
  current_market_price: number;
};

// Props for StockSearch Component
type StockSearchProps = {
  stocks: Stock[];
  setValue: UseFormSetValue<TradeFormValues>;
  watch: UseFormWatch<TradeFormValues>;
  errors: FieldErrors<TradeFormValues>;
};

const StockSearch: React.FC<StockSearchProps> = ({
  stocks,
  setValue,
  watch,
  errors,
}) => {
  const [inputValue, setInputValue] = useState("");

  // Filter stocks based on input
  const filteredStocks = stocks
    .filter((stock) =>
      stock.company_name.toLowerCase().includes(inputValue.toLowerCase())
    )
    .filter((stock) => stock.company_symbol);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items: filteredStocks,
    itemToString: (item) => (item ? item.company_name : ""),
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        setValue("company_symbol", selectedItem.company_symbol);
        setValue("company_name", selectedItem.company_name);
        setValue("price", selectedItem.current_market_price);
        setInputValue(selectedItem.company_name);
      }
    },
    onInputValueChange: ({ inputValue }) => {
      setInputValue(inputValue || "");
    },
  });

  return (
    <div className="mt-4 relative">
      <Label>Stock Name</Label>
      <Input
        {...getInputProps()}
        placeholder="Search stock..."
        className="w-full"
      />

      {/* Dropdown Menu */}
      <ul
        {...getMenuProps()}
        className={`absolute z-10 mt-1 w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 shadow-lg rounded-md max-h-48 overflow-auto ${
          isOpen && filteredStocks.length > 0 ? "block" : "hidden"
        }`}
      >
        {isOpen &&
          filteredStocks.map((stock, index) => (
            <li
              key={stock.company_symbol || `fallback-key-${index}`} // Fallback key
              {...getItemProps({ item: stock, index })}
              className={`cursor-pointer p-2 ${
                highlightedIndex === index ? "bg-blue-100 dark:bg-blue-900" : ""
              }`}
            >
              {stock.company_name} ({stock.company_symbol})
            </li>
          ))}
      </ul>

      {/* Error Messages */}
      {errors.company_name && (
        <p className="text-red-500 text-sm">{errors.company_name.message}</p>
      )}
      {errors.company_symbol && (
        <p className="text-red-500 text-sm">{errors.company_symbol.message}</p>
      )}
    </div>
  );
};

export default StockSearch;

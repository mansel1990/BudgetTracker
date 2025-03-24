import React from "react";

type SoldStockProps = {
  name: string;
  lastSoldDate: string;
  amountBought: number;
  amountSold: number;
};

const SoldStockCard: React.FC<SoldStockProps> = ({
  name,
  lastSoldDate,
  amountBought,
  amountSold,
}) => {
  const totalProfitLoss = amountSold - amountBought;
  const isProfit = totalProfitLoss >= 0;
  const profitPercentage = ((amountSold - amountBought) / amountBought) * 100;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg shadow-md bg-white dark:bg-slate-800 hover:shadow-lg transition-all">
      {/* Left Section: Stock Name & Sold Date */}
      <div className="flex-1">
        <div className="text-lg font-semibold">{name}</div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300 mt-1">
          Sold on: {new Date(lastSoldDate).toLocaleDateString()}
        </div>
      </div>

      {/* Right Section: Profit/Loss & Amounts */}
      <div className="flex flex-col items-end">
        <div
          className={`text-lg font-bold ${
            isProfit ? "text-green-600" : "text-red-500"
          }`}
        >
          {isProfit ? "+" : ""}
          {totalProfitLoss.toFixed(2)} ₹
          <span className="ml-1 text-sm font-medium">
            ({isProfit ? "+" : ""}
            {profitPercentage.toFixed(2)}%)
          </span>
        </div>

        <div className="flex gap-2 text-base font-semibold mt-1">
          <span className="text-gray-700 dark:text-gray-200">
            ₹{amountBought.toFixed(2)}
          </span>
          <span className="text-gray-500 dark:text-gray-400">→</span>
          <span className="text-gray-700 dark:text-gray-200">
            ₹{amountSold.toFixed(2)}
          </span>
        </div>

        {/* Small Text: Amount Invested */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Amount Invested: ₹{amountBought.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default SoldStockCard;

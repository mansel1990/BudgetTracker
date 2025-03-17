import { getTransactionHistoryResponseType } from "@/app/api/transactions-history/route";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#ef4444", // Red
  "#9333ea", // Purple
  "#f97316", // Orange
  "#14b8a6", // Teal
  "#8b5cf6", // Indigo
  "#ec4899", // Pink
  "#22c55e", // Emerald
];

const ExpensePieChart = ({
  data,
}: {
  data: getTransactionHistoryResponseType;
}) => {
  // Aggregate expenses by category
  const expenseData = data
    .filter((tx) => tx.type === "expense") // Filter only expenses
    .reduce((acc, tx) => {
      const existing = acc.find((item) => item.name === tx.category);
      if (existing) {
        existing.value += tx.amount ? Number(tx.amount) : 0; // Sum up the amounts
      } else {
        acc.push({
          name: tx.category ?? "Unknown",
          value: tx.amount ? Number(tx.amount) : 0,
        });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  return (
    <div className="flex flex-col justify-center items-center w-full p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg">
      {/* Responsive Container for PieChart */}
      <div className="w-full max-w-[650px] mx-auto">
        <PieChart width={650} height={400}>
          <Pie
            data={expenseData}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            innerRadius="40%"
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
            labelLine={false}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {expenseData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "12px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#4B5563",
            }}
          />
          {/* Ensure Legends are Visible */}
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconSize={16}
            iconType="circle"
            wrapperStyle={{
              paddingTop: "20px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#4B5563",
            }}
          />
        </PieChart>
      </div>
    </div>
  );
};

export default ExpensePieChart;

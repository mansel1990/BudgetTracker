import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CompanyAnalysisType } from "@/schema/companyAnalysis";
import { Input } from "@/components/ui/input";

interface Props {
  data: CompanyAnalysisType[];
}

const getScoreColor = (score: number) => {
  if (score >= 24) return "#10B981"; // Emerald
  if (score >= 12) return "#F59E0B"; // Yellow
  return "#F43F5E"; // Rose
};

const CompanyAnalysisMobile: React.FC<Props> = ({ data = [] }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Add search state

  // Filter data based on search query before getting top 20
  const filteredData = data.filter((company) =>
    Object.values(company).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const top20 = [...filteredData]
    .sort((a, b) => b.final_score - a.final_score)
    .slice(0, 20);

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="w-full space-y-4">
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      {top20.map((company) => (
        <div
          key={company.company_symbol}
          className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-800"
        >
          {/* Basic Details */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">
                {company.company_symbol} - {company.company_name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {company.sector}
              </p>

              {/* Final Score with Bar */}
              <div className="mt-2">
                <p className="text-sm font-medium">
                  Final Score: {company.final_score} / 36
                </p>
                <div className="relative w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-md overflow-hidden">
                  <div
                    className="h-2 rounded-md"
                    style={{
                      width: `${(Number(company.final_score) / 36) * 100}%`,
                      backgroundColor: getScoreColor(
                        Number(company.final_score)
                      ),
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Expand Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleExpand(company.company_symbol)}
            >
              {expanded === company.company_symbol ? (
                <ChevronUp />
              ) : (
                <ChevronDown />
              )}
            </Button>
          </div>

          {/* Expanded Score Details */}
          {expanded === company.company_symbol && (
            <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded-md">
              <p className="text-sm font-semibold mb-2">Score Details</p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart
                  layout="vertical"
                  data={[
                    { name: "PE", score: company.pe_score },
                    { name: "PEG", score: company.peg_score },
                    { name: "DE", score: company.de_score },
                    { name: "Piotroski", score: company.piotroski_score },
                    { name: "Sales", score: company.sales_score },
                    { name: "Profit", score: company.profit_score },
                    { name: "ROE", score: company.score },
                  ]}
                >
                  <XAxis type="number" domain={[0, 1]} hide />
                  <YAxis dataKey="name" type="category" width={50} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#10B981" barSize={6} />
                </BarChart>
              </ResponsiveContainer>

              <p className="text-sm font-semibold mt-3">
                Total Filter Score: {company.Total_Filter_Score} / 36
              </p>
            </div>
          )}
        </div>
      ))}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 italic bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-4">
        In mobile you will only see top 20. Please switch to desktop for more
        details
      </p>
    </div>
  );
};

export default CompanyAnalysisMobile;

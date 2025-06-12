import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const AttendanceChart = ({ data }) => {
  // Process and deduplicate data
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    // Deduplicate by date and sort
    const seenDates = new Set();
    return data
      .map((entry) => ({
        rawDate: new Date(entry.date),
        date: new Date(entry.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: entry.status === "Present" ? 1 : 0,
      }))
      .filter((entry) => {
        const dateKey = entry.date;
        if (!seenDates.has(dateKey) && !isNaN(entry.rawDate)) {
          seenDates.add(dateKey);
          return true;
        }
        return false;
      })
      .sort((a, b) => a.rawDate - b.rawDate);
  }, [data]);

  // Custom tooltip for better formatting
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const status = payload[0].value === 1 ? "Present" : "Absent";
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-emerald-500">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-sm">Status: {status}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 max-w-4xl mx-auto transition-all duration-300 hover:shadow-xl">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <svg
          className="w-6 h-6 mr-2 text-emerald-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
        Attendance Trend
      </h3>

      {chartData.length > 0 ? (
        <div className="relative h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 1]}
                ticks={[0, 1]}
                tickFormatter={(value) => (value === 1 ? "Present" : "Absent")}
                stroke="#6b7280"
                fontSize={12}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="status"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 8, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl text-center">
          <svg
            className="w-12 h-12 text-gray-400 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-600 text-lg font-medium">No attendance data available</p>
          <p className="text-gray-500 text-sm mt-1">Add attendance records to see the trend.</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceChart;
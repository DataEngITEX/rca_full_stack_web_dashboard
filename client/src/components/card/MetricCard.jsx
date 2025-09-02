import React from "react";

const MetricCard = ({ title, value, percentage, color, icon }) => {
  return (
    <div
      className={`p-6 rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 transform hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-500 uppercase">
          {title}
        </span>
        <span
          className={`p-2 rounded-full ${color
            .replace("border-l-4", "")
            .replace("border-blue-500", "bg-blue-100")}`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-4 flex items-baseline">
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {percentage !== null && (
          <span className="ml-2 text-sm font-medium text-gray-500">
            ({percentage}%)
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;

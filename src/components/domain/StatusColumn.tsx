import React from "react";

interface StatusColumnProps {
  title: string;
  children: React.ReactNode;
}

const StatusColumn = ({ title, children }: StatusColumnProps) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow-sm w-full flex-shrink-0 md:w-full">
      <h2 className="text-lg font-semibold text-gray-700 p-4 border-b border-gray-200 bg-white rounded-t-lg">
        {title}
      </h2>
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-230px)]">
        {children}
      </div>
    </div>
  );
};

export default StatusColumn;

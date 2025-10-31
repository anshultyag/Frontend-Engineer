"use client";

import { Spin, Typography } from "antd";

const { Text } = Typography;

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "default" | "large";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = "large",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <Spin size={size} className="mb-4" />
        <Text className="text-gray-600 text-lg">{message}</Text>
      </div>
    </div>
  );
};

export default LoadingSpinner;

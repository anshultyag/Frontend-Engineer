"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuthRedux";
import { CheckCircleOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Typography, Space, Avatar } from "antd";

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const { Title, Text } = Typography;

  return (
    <nav
      className="bg-white/95 backdrop-blur-xl shadow-2xl border-b
     border-indigo-100 sticky top-0 z-50 px-20"
      style={{ paddingLeft: "30px", paddingRight: "30px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex justify-end items-center h-20 "
          style={{ float: "right" }}
        >
          <Button
            onClick={onLogout}
            type="primary"
            icon={<LogoutOutlined />}
            className="bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 border-none shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 font-semibold"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

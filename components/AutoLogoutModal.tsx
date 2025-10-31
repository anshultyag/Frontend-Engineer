import React from "react";
import { Modal, Button, Space } from "antd";
import {
  ExclamationCircleOutlined,
  CheckOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

interface AutoLogoutModalProps {
  show: boolean;
  timeLeft: number;
  onStayLoggedIn: () => void;
  onLogoutNow: () => void;
}

const AutoLogoutModal: React.FC<AutoLogoutModalProps> = ({
  show,
  timeLeft,
  onStayLoggedIn,
  onLogoutNow,
}) => {
  return (
    <>
      <Modal
        open={show}
        onCancel={onStayLoggedIn}
        footer={null}
        closable={false}
        maskClosable={false}
        width={500}
        centered
        className="auto-logout-modal"
        styles={{
          body: {
            padding: "32px",
          },
        }}
      >
        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <ExclamationCircleOutlined className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Session Timeout Warning
            </h3>
            <p className="text-gray-600 mb-6">
              You will be automatically logged out due to inactivity.
            </p>
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg mb-6">
              <div className="text-4xl font-bold text-white">
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </div>
            </div>
          </div>

          <Space size="middle" className="w-full" direction="vertical">
            <Button
              type="primary"
              size="large"
              icon={<CheckOutlined />}
              onClick={onStayLoggedIn}
              block
              className="bg-gradient-to-r from-blue-600 to-blue-700 border-none h-12 font-medium"
            >
              Stay Login
            </Button>
            <Button
              size="large"
              icon={<LogoutOutlined />}
              onClick={onLogoutNow}
              block
              className="h-12 font-medium"
            >
              Logout Now
            </Button>
          </Space>
        </div>
      </Modal>

      {show && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[10001]">
          <div className="bg-blue-50/95 backdrop-blur-sm rounded-xl p-4 max-w-md w-full shadow-lg border border-blue-200/50">
            <div className="text-center">
              <p className="text-sm text-gray-700 font-medium">
                Tip: Keep your session active by interacting with the page
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AutoLogoutModal;

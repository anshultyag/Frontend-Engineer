"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuthRedux";
import { Form, Input, Button, Card, Typography, Alert } from "antd";
import {
  UserOutlined,
  LockOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    form.setFieldsValue({
      username: "emilys",
      password: "emilyspass",
    });
  }, [form]);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (values: any) => {
      setLoading(true);
      setError("");

      try {
        const result = await login(values.username, values.password);

        if (result.success) {
          router.push("/dashboard");
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    [login, router]
  );

  return (
    <div
      className="min-h-screen  
     flex items-center justify-center mt-10 py-2 px-3 sm:py-4 sm:px-4
      md:py-8 md:px-6 lg:py-12 lg:px-8 "
      style={{ width: "50%", margin: "auto", height: "100vh" }}
    >
      <div className="w-1/2 max-w-lg relative z-10">
        <Card className="border-0 rounded-3xl p-8 shadow-2xl ">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <CheckCircleOutlined className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <Title
              level={1}
              className="!text-4xl !font-black !m-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
            >
              TodoMaster
            </Title>
            <Text className="text-gray-600 text-lg font-medium">
              ✨ Welcome back! Please sign in to continue ✨
            </Text>
            <div className="flex justify-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>

          {error && (
            <Alert message={error} type="error" showIcon className="mb-6" />
          )}

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
            className="space-y-6"
          >
            <Form.Item
              name="username"
              label={
                <span className="text-gray-700 font-semibold text-base">
                  Username
                </span>
              }
              rules={[
                { required: true, message: "Please enter your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-indigo-500" />}
                placeholder="Enter your username"
                className="h-14 rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 shadow-sm"
                style={{ fontSize: "16px" }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span className="text-gray-700 font-semibold text-base">
                  Password
                </span>
              }
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-indigo-500" />}
                placeholder="Enter your password"
                className="h-14 rounded-xl border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 shadow-sm"
                style={{ fontSize: "16px" }}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border-none shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105 font-bold text-lg rounded-xl transition-all duration-300"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <CheckCircleOutlined className="mr-2" />
                    Sign In
                  </span>
                )}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6">
            <Text className="text-gray-500">
              Demo credentials: <Text strong>emilys / emilyspass</Text>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

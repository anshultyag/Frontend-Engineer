"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuthRedux";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import AutoLogoutModal from "@/components/AutoLogoutModal";
import Navbar from "@/components/Navbar";
import { APP_CONFIG } from "@/lib/constants/app";
import {
  CheckCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  TableOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Table,
  Button,
  Tag,
  Space,
  Popconfirm,
  Input,
  Tooltip,
  Form,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Todo } from "@/models";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import {
  setTodos,
  setTodosLoading,
  addTodo,
  updateTodo,
  deleteTodo,
  fetchTodos,
} from "@/lib/slices/authSlice";

const DashboardPage: React.FC = () => {
  const { Title, Text, Paragraph } = Typography;
  const { user, logout, isAuthenticated } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState("");
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [showAllTodos, setShowAllTodos] = useState(true);
  const { todos, todosLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (todos.length === 0 && !todosLoading) {
      dispatch(fetchTodos());
    }
  }, [dispatch, todos.length, todosLoading]);

  const filteredTodos = showAllTodos
    ? todos
    : todos.filter((todo: Todo) => todo.userId === user?.id);

  const { showWarning, timeLeft, handleStayLoggedIn, handleLogoutNow } =
    useAutoLogout({
      timeoutMinutes: APP_CONFIG.AUTO_LOGOUT.TIMEOUT_MINUTES,
      warningSeconds: APP_CONFIG.AUTO_LOGOUT.WARNING_SECONDS,
      onLogout: logout,
    });

  const handleCreateTodo = async () => {
    if (!newTodo.trim()) return;

    const newTodoItem: Todo = {
      id: Date.now(),
      todo: newTodo.trim(),
      completed: false,
      userId: user?.id || 1,
    };

    dispatch(addTodo(newTodoItem));
    setNewTodo("");
  };

  const handleUpdateTodo = async (
    id: string,
    todo: string,
    completed: boolean
  ) => {
    dispatch(
      updateTodo({
        id: parseInt(id),
        todo,
        completed,
      })
    );
  };

  const handleDeleteTodo = async (id: string) => {
    dispatch(deleteTodo(parseInt(id)));
  };

  const isEditing = (record: Todo) => record.id === editingKey;

  const edit = (record: Todo) => {
    setEditingText(record.todo);
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(null);
    setEditingText("");
  };

  const save = async (id: number) => {
    try {
      dispatch(
        updateTodo({
          id,
          todo: editingText,
          completed: todos.find((t) => t.id === id)?.completed || false,
        })
      );
      setEditingKey(null);
      setEditingText("");
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  // Computed values
  const todoCount = filteredTodos.length;
  const completedCount = filteredTodos.filter((todo) => todo.completed).length;
  const pendingCount = todoCount - completedCount;

  const progressPercentage =
    todoCount > 0 ? (completedCount / todoCount) * 100 : 0;

  // Table columns definition
  const columns: ColumnsType<Todo> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
      render: (id: number) => (
        <span className="font-mono text-sm text-gray-600">#{id}</span>
      ),
    },
    {
      title: "Task",
      dataIndex: "todo",
      key: "todo",
      render: (text: string, record: Todo) => {
        const editing = isEditing(record);
        return editing ? (
          <Input
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onPressEnter={() => save(record.id)}
            onBlur={() => save(record.id)}
            className="w-full"
            autoFocus
          />
        ) : (
          <span
            className={`text-lg ${
              record.completed ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "completed",
      key: "completed",
      width: 120,
      filters: [
        { text: "Completed", value: true },
        { text: "Pending", value: false },
      ],
      onFilter: (value: any, record: Todo) => record.completed === value,
      render: (completed: boolean) => (
        <Tag
          color={completed ? "success" : "processing"}
          icon={completed ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          className="font-semibold"
        >
          {completed ? "Completed" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 100,
      render: (userId: number) => (
        <div className="flex items-center space-x-2">
          <UserOutlined className="text-gray-400" />
          <span className="font-mono text-sm">{userId}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record: Todo) => {
        const editing = isEditing(record);
        return (
          <Space size="small">
            {editing ? (
              <>
                <Tooltip title="Save">
                  <Button
                    type="primary"
                    size="small"
                    icon={<CheckOutlined />}
                    onClick={() => save(record.id)}
                    className="bg-green-500 hover:bg-green-600"
                  />
                </Tooltip>
                <Tooltip title="Cancel">
                  <Button
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={cancel}
                  />
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Toggle Status">
                  <Button
                    type="primary"
                    size="small"
                    icon={
                      record.completed ? (
                        <ClockCircleOutlined />
                      ) : (
                        <CheckCircleOutlined />
                      )
                    }
                    onClick={() =>
                      handleUpdateTodo(
                        record.id.toString(),
                        record.todo,
                        !record.completed
                      )
                    }
                    className={
                      record.completed
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-500 hover:bg-green-600"
                    }
                  />
                </Tooltip>
                <Tooltip title="Edit">
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => edit(record)}
                    disabled={editingKey !== null}
                  />
                </Tooltip>
                <Popconfirm
                  title="Delete Task"
                  description="Are you sure you want to delete this task?"
                  onConfirm={() => handleDeleteTodo(record.id.toString())}
                  okText="Yes"
                  cancelText="No"
                  okType="danger"
                >
                  <Tooltip title="Delete">
                    <Button danger size="small" icon={<DeleteOutlined />} />
                  </Tooltip>
                </Popconfirm>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Navbar */}
      <Navbar onLogout={logout} />

      <main
        className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
        style={{ paddingLeft: "30px", paddingRight: "30px" }}
      >
        {/* Add Todo Section */}
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200/50 p-8 mb-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full -translate-y-10 -translate-x-10"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <Title
                level={2}
                className="text-2xl font-black text-gray-900"
              ></Title>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>

            <Form
              onFinish={handleCreateTodo}
              className="flex items-center gap-4 w-full"
              layout="inline"
            >
              <Form.Item className="flex-1 mb-0">
                <Input
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What needs to be done? Let's make it happen!"
                  size="large"
                  className="w-full"
                  prefix={<PlusOutlined className="text-blue-600" />}
                  required
                />
              </Form.Item>
              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<PlusOutlined />}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-none shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 font-bold whitespace-nowrap"
                >
                  Add Task
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm">
            <div className="flex items-center">
              <ExclamationCircleOutlined className="h-5 w-5 text-red-400 mr-3" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Todos Section */}
        {todosLoading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-indigo-500 bg-white">
              <LoadingOutlined className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" />
              Loading your tasks...
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
              <ExclamationCircleOutlined className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Error loading tasks
            </h3>
            <p className="text-gray-500 text-lg mb-6">
              Something went wrong while loading your tasks.
            </p>
            <Button
              type="primary"
              onClick={() => window.location.reload()}
              icon={<ExclamationCircleOutlined />}
            >
              Try Again
            </Button>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <FileTextOutlined className="h-12 w-12 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No tasks yet
            </h3>
            <p className="text-gray-500 text-lg mb-6">
              Create your first task above to get started!
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <InfoCircleOutlined className="w-4 h-4 mr-2" />
              Start by adding a task above
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white via-gray-50/30 to-indigo-50/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full -translate-y-20 translate-x-20"></div>

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <TableOutlined className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    All Tasks Table
                  </h3>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="p-6">
              <Table
                columns={columns}
                dataSource={filteredTodos}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} tasks`,
                  pageSizeOptions: ["5", "10", "20", "50"],
                  className: "mt-4",
                }}
                loading={todosLoading}
                size="middle"
                className="rounded-lg overflow-hidden shadow-lg"
                scroll={{ x: 800 }}
                rowClassName={(record) =>
                  record.completed
                    ? "bg-green-50/30 hover:bg-green-100/50"
                    : "bg-white hover:bg-gray-50"
                }
              />
            </div>
          </div>
        )}
      </main>

      {/* Auto-logout modal */}
      <AutoLogoutModal
        show={showWarning}
        timeLeft={timeLeft}
        onStayLoggedIn={handleStayLoggedIn}
        onLogoutNow={handleLogoutNow}
      />
    </div>
  );
};

export default DashboardPage;

"use client";

import React, { useState } from "react";
import { Table, Button, Tag, Space, Popconfirm, Input, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Todo } from "@/models";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { updateTodo, deleteTodo } from "@/lib/slices/authSlice";
import {
  CheckCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface TodoTableProps {
  todos: Todo[];
  editingKey: number | null;
  editingText: string;
  onEdit: (record: Todo) => void;
  onCancel: () => void;
  onSave: (id: number) => void;
  onUpdateTodo: (id: string, todo: string, completed: boolean) => void;
  onDeleteTodo: (id: string) => void;
  onEditTextChange: (text: string) => void;
}

const TodoTable: React.FC<TodoTableProps> = ({
  todos,
  editingKey,
  editingText,
  onEdit,
  onCancel,
  onSave,
  onUpdateTodo,
  onDeleteTodo,
  onEditTextChange,
}) => {
  const isEditing = (record: Todo) => record.id === editingKey;

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
            onChange={(e) => onEditTextChange(e.target.value)}
            onPressEnter={() => onSave(record.id)}
            onBlur={() => onSave(record.id)}
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
                    onClick={() => onSave(record.id)}
                    className="bg-green-500 hover:bg-green-600"
                  />
                </Tooltip>
                <Tooltip title="Cancel">
                  <Button
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={onCancel}
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
                      onUpdateTodo(
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
                    onClick={() => onEdit(record)}
                    disabled={editingKey !== null}
                  />
                </Tooltip>
                <Popconfirm
                  title="Delete Task"
                  description="Are you sure you want to delete this task?"
                  onConfirm={() => onDeleteTodo(record.id.toString())}
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

  return (
    <Table
      columns={columns}
      dataSource={todos}
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
      size="middle"
      className="rounded-lg overflow-hidden shadow-lg"
      scroll={{ x: 800 }}
      rowClassName={(record) =>
        record.completed
          ? "bg-green-50/30 hover:bg-green-100/50"
          : "bg-white hover:bg-gray-50"
      }
    />
  );
};

export default TodoTable;

import React from "react";
import { Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  EventLogsProps,
  LogCategory,
  LogInitiator,
  ScadaLogEntry,
} from "@scada/shared-types";

const { Text } = Typography;

// Словник кольорів для різних категорій логів
const categoryColors: Record<LogCategory, string> = {
  info: "blue",
  command: "cyan",
  warning: "orange",
  critical: "red", // Аварійні ситуації будуть яскраво-червоними
};

export const EventLogs: React.FC<EventLogsProps> = ({ logs }) => {
  // Налаштування колонок таблиці
  const columns: ColumnsType<ScadaLogEntry> = [
    {
      title: "Date and time",
      key: "datetime",
      // Сортування під капотом працює по timestamp для абсолютної точності
      sorter: (a, b) => a.timestamp - b.timestamp,
      defaultSortOrder: "descend", // Нові події завжди зверху
      render: (_, record) => (
        <div style={{ whiteSpace: "nowrap" }}>
          <Text strong>{record.time}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.date}
          </Text>
        </div>
      ),
      width: 180,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: LogCategory) => (
        <Tag
          color={categoryColors[category]}
          style={{
            fontSize: "14px",
            padding: "4px 12px",
            width: "100px",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {category}
        </Tag>
      ),
      // Додаємо зручні фільтри для диспетчера
      filters: [
        { text: "INFO", value: "info" },
        { text: "WARNING", value: "warning" },
        { text: "CRITICAL", value: "critical" },
        { text: "COMMAND", value: "command" },
      ],
      onFilter: (value, record) => record.category === value,
      width: 180,
    },
    {
      title: "Initiator",
      dataIndex: "initiator",
      key: "initiator",
      render: (initiator: LogInitiator) => {
        // Розділяємо візуально дії людини та машини
        const color = initiator === "Operator" ? "geekblue" : "purple";
        return (
          <Tag
            color={color}
            style={{
              fontSize: "14px",
              padding: "4px 12px",
              width: "120px",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {initiator}
          </Tag>
        );
      },
      filters: [
        { text: "Operator", value: "Operator" },
        { text: "Automation", value: "Automation" },
      ],
      onFilter: (value, record) => record.initiator === value,
      width: 130,
    },
    {
      title: "Message (Event description)",
      dataIndex: "message",
      key: "message",
      render: (text, record) => (
        // Якщо подія критична - робимо текст напівжирним і червоним для привернення уваги
        <Text
          type={record.category === "critical" ? "danger" : undefined}
          strong={record.category === "critical"}
          style={{ fontSize: "18px" }}
        >
          {text}
        </Text>
      ),
    },
  ];

  return (
    <div
      style={{
        height: "100%",
        // overflow: "auto",
        // scrollbarWidth: "none",
      }}
    >
      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id" // Antd вимагає унікальний ключ для кожного рядка (наш згенерований ID підходить ідеально)
        pagination={{
          defaultPageSize: 15,
          showSizeChanger: true,
          pageSizeOptions: ["15", "30", "50", "100"],
          showTotal: (total) => `Total records: ${total}`,
        }}
        size="large"
        scroll={{ y: "calc(100vh - 300px)", x: "max-content" }}
        bordered
      />
    </div>
  );
};

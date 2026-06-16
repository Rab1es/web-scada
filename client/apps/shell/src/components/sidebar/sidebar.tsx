import { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  ThunderboltOutlined,
  LineChartOutlined,
  UnorderedListOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

export const Sidebar = () => {
  // Стейт для керування згортанням
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/power", icon: <ThunderboltOutlined />, label: "Power System" },
    { key: "/charts", icon: <LineChartOutlined />, label: "Analytics" },
    { key: "/logs", icon: <UnorderedListOutlined />, label: "Event Log" },
  ];

  return (
    // Вимикаємо стандартний trigger і передаємо наш state
    <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
      {/* Наш кастомний блок з кнопкою */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <Button
          type="primary"
          onClick={() => setCollapsed(!collapsed)}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          style={{
            width: 40,
            height: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

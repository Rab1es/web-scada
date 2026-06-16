import { useState, useEffect } from "react";
import { Layout, Menu, Button, Drawer, Grid } from "antd";
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
const { useBreakpoint } = Grid;

export const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (state: boolean) => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const screens = useBreakpoint();
  const isMobile = screens.md === false;

  const menuItems = [
    { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/power", icon: <ThunderboltOutlined />, label: "Power System" },
    { key: "/charts", icon: <LineChartOutlined />, label: "Analytics" },
    { key: "/logs", icon: <UnorderedListOutlined />, label: "Event Log" },
  ];

  // Спільний контент меню для обох варіантів (Desktop/Mobile)
  const menuContent = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={({ key }) => {
        navigate(key);
        // Якщо ми на мобільному екрані - автоматично закриваємо шторку після переходу
        if (isMobile) {
          setCollapsed(true);
        }
      }}
    />
  );

  // === МОБІЛЬНИЙ ВІДМАЛЬОВУВАЧ (Шторка) ===
  if (isMobile) {
    return (
      <Drawer
        title={
          <span style={{ color: "rgba(255, 255, 255, 0.85)" }}>SCADA Menu</span>
        }
        placement="left"
        onClose={() => setCollapsed(true)}
        // Drawer відкритий, коли collapsed === false
        open={!collapsed}
        width={250}
        styles={{
          header: { background: "#141414", borderBottom: "1px solid #303030" },
          body: { background: "#001529", padding: 0 },
        }}
      >
        {menuContent}
      </Drawer>
    );
  }

  // === ДЕСКТОПНИЙ ВІДМАЛЬОВУВАЧ (Бокова панель) ===
  return (
    <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
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

      {menuContent}
    </Sider>
  );
};

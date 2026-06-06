import { Card, Badge, Typography } from "antd";
import { FireOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const Dashboard = () => {
  return (
    <Card
      title="Головна мнемосхема котельні"
      style={{ width: "100%", minHeight: "600px" }}
    >
      {/* Главный контейнер (холст). Центрируем его. */}
      <div
        style={{
          position: "relative",
          width: "800px",
          height: "500px",
          margin: "0 auto",
          background: "#fafafa",
          border: "1px solid #e8e8e8",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* === СЛОЙ 1: Векторная подложка (SVG) === */}
        <svg
          viewBox="0 0 800 500"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {/* Труба обратки (Холодная вода - синяя) */}
          {/* Идет справа налево, проходит через насос, заходит в котел снизу */}
          <path
            d="M 800 400 L 250 400 L 250 350"
            fill="none"
            stroke="#1890ff"
            strokeWidth="12"
          />
          {/* Труба подачи (Горячая вода - красная) */}
          {/* Выходит из котла сверху, идет направо к потребителю */}
          <path
            d="M 250 150 L 250 100 L 800 100"
            fill="none"
            stroke="#f5222d"
            strokeWidth="12"
          />
          {/* Циркуляционный насос (На трубе обратки) */}
          <circle
            cx="550"
            cy="400"
            r="30"
            fill="#d9d9d9"
            stroke="#8c8c8c"
            strokeWidth="4"
          />
          <polygon points="535,385 535,415 570,400" fill="#595959" />{" "}
          {/* Треугольник потока */}
          <text x="535" y="450" fill="#8c8c8c" fontSize="14" fontWeight="bold">
            Насос М1
          </text>
          {/* Котел (По центру слева) */}
          <rect
            x="150"
            y="150"
            width="200"
            height="200"
            rx="16"
            fill="#f0f0f0"
            stroke="#8c8c8c"
            strokeWidth="6"
          />
          {/* Имитация горелки/топки внутри котла */}
          <rect x="210" y="180" width="80" height="100" rx="8" fill="#595959" />
        </svg>

        {/* === СЛОЙ 2: Интерактивные данные (Ant Design) === */}

        {/* Температура подачи (на красной трубе) */}
        <Card
          size="small"
          style={{
            position: "absolute",
            top: "50px",
            left: "450px",
            width: "130px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Text type="secondary">T подачі (T_out)</Text>
          <br />
          <Text strong style={{ fontSize: "18px", color: "#cf1322" }}>
            78.5 °C
          </Text>
        </Card>

        {/* Давление воды (на синей трубе, перед котлом) */}
        <Card
          size="small"
          style={{
            position: "absolute",
            top: "320px",
            left: "300px",
            width: "130px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Text type="secondary">Тиск мережі</Text>
          <br />
          <Text strong style={{ fontSize: "18px", color: "#096dd9" }}>
            1.6 Bar
          </Text>
        </Card>

        {/* Статус насоса и частота ЧРП */}
        <div
          style={{
            position: "absolute",
            top: "350px",
            left: "540px",
            background: "#fff",
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #d9d9d9",
          }}
        >
          <Badge status="processing" text="50.0 Hz" />
        </div>

        {/* Концентрация метана (CH4) - защита */}
        <Card
          size="small"
          style={{
            position: "absolute",
            top: "160px",
            left: "370px",
            width: "110px",
            border: "1px solid #faad14",
          }}
        >
          <Text type="secondary">CH4 (Газ)</Text>
          <br />
          <Text strong style={{ fontSize: "16px" }}>
            0.00 %
          </Text>
        </Card>

        {/* Индикатор пламени (поверх топки котла) */}
        <div
          style={{
            position: "absolute",
            top: "215px",
            left: "235px",
            fontSize: "32px",
            color: "#fa541c",
          }}
        >
          <FireOutlined />
        </div>
      </div>
    </Card>
  );
};

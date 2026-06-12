import React, { useState, useEffect } from "react";
import { Slider as LibrarySlider, Button, Space, Typography } from "antd";

const { Text } = Typography;

export const Slider = ({
  title, // Название (например, "Уставки температури (°C)")
  min, // Минимальное значение шкалы
  max, // Максимальное значение шкалы
  currentValue, // Текущее значение (число ИЛИ массив чисел [min, max])
  onApply, // Функция, которая вызовется при нажатии "Застосувати"
  isRange = false, // true = две точки (массив), false = одна точка (число)
  unit = "", // Единица измерения для тултипа (например, "°C" или "%")
  disabled = false, // Для блокировки во время блэкаута
}) => {
  const [localValue, setLocalValue] = useState(currentValue);
  const [isEditing, setIsEditing] = useState(false);

  // Синхронизация с ПЛК, если данные обновились извне и мы не находимся в режиме редактирования
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(currentValue);
    }
  }, [currentValue, isEditing]);

  const handleChange = (newValue) => {
    setLocalValue(newValue);
    setIsEditing(true);
  };

  const handleApplyClick = () => {
    // Просто отдаем наружу то, что накрутил диспетчер
    onApply(localValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalValue(currentValue);
    setIsEditing(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <Text strong>{title}</Text>

      <LibrarySlider
        range={isRange ? { draggableTrack: true } : false}
        min={min}
        max={max}
        value={localValue}
        onChange={handleChange}
        disabled={disabled}
        tooltip={{
          open: true,
          placement: "top",
          formatter: (value) => `${value}${unit}`,
        }}
        style={{ marginTop: "30px", marginBottom: "20px" }}
      />

      {isEditing && (
        <Space
          style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          <Button onClick={handleCancel}>Скасувати</Button>
          <Button type="primary" onClick={handleApplyClick}>
            Застосувати
          </Button>
        </Space>
      )}
    </div>
  );
};

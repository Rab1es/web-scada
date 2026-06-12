// @ts-ignore
import React, { Component, ReactNode } from "react";
import { Result, Button } from "antd";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMsg: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("MFE Crash:", error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, errorMsg: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "50px",
            background: "#fff",
            borderRadius: "8px",
            margin: "20px",
          }}
        >
          <Result
            status="500"
            title="Помилка завантаження модуля"
            subTitle="Мікрофронтенд тимчасово недоступний або сталася помилка."
            extra={
              <Button type="primary" onClick={this.resetErrorBoundary}>
                Перезавантажити сторінку
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

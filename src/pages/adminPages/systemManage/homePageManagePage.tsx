//src/pages/adminPages/systemManage/homePageManagePage.tsx
import { useEffect, useState } from "react";
import {
  Tabs,
  Form,
  Breadcrumb,
  Card,
  Typography,
  Button,
  Space,
  Tooltip,
} from "antd";
import { FormInput } from "../../../components/ui/Form/FormInput.tsx";
import { FormMarkDown } from "../../../components/ui/Form/FormMarkDown.tsx";
import ReactMarkdown from "react-markdown";
import {
  HomeOutlined,
  FileTextOutlined,
  EditOutlined,
  EyeOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useStaticPages } from "../../../hooks/systemHooks/useStaticPages.ts";
import type { TabKey } from "../../../hooks/systemHooks/useStaticPages.ts";
import "./homepageManage.scss";

const { TabPane } = Tabs;
const { Title } = Typography;

export default function HomepageManage() {
  const [form] = Form.useForm();
  const { mode, setMode, savedContent, handleSave } = useStaticPages();
  const [activeKey, setActiveKey] = useState<TabKey>("about");

  // Chuyển tab sẽ nạp nội dung cũ vào form
  useEffect(() => {
    if (savedContent[activeKey]) {
      form.setFieldsValue(savedContent[activeKey]);
    }
  }, [activeKey, savedContent, form]);

  // Hiển thị nội dung
  const renderTabContent = (key: TabKey) => {
    return mode[key] === "edit" ? (
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleSave(values, key)}
        style={{ marginTop: 10 }}
      >
        <FormInput name="title" label="Tiêu đề" placeholder="Nhập tiêu đề" />

        <Form.Item name="content" label="Nội dung">
          <FormMarkDown width="100%" folder={key} />
        </Form.Item>

        <Form.Item style={{ marginTop: 20 }}>
          <Space size="middle">
            <Tooltip title="Lưu nội dung">
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => form.submit()}
                style={{ background: "#4d940e", borderColor: "#4d940e" }}
              >
                Lưu
              </Button>
            </Tooltip>

            <Tooltip title="Xem trước nội dung">
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  setMode((prev) => ({ ...prev, [key]: "preview" }))
                }
              >
                Xem trước
              </Button>
            </Tooltip>
          </Space>
        </Form.Item>
      </Form>
    ) : (
      <div className="preview-mode">
        <div
          className="preview-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 className="preview-title">{savedContent[key].title}</h2>

          <Tooltip title="Chỉnh sửa nội dung">
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => setMode((prev) => ({ ...prev, [key]: "edit" }))}
            >
              Chỉnh sửa
            </Button>
          </Tooltip>
        </div>

        <div className="preview-body" style={{ marginTop: 16 }}>
          <div className="preview-content markdown-body">
            <ReactMarkdown>{savedContent[key].content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="panel-homepage-admin"
      style={{ padding: 24, background: "#f4f6f9", minHeight: "100vh" }}
    >
      {/* Điều hướng breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined />
          <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FileTextOutlined />
          <span>Trang tĩnh</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <EditOutlined />
          <span>Quản lý nội dung</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Tiêu đề */}
      <Title
        level={3}
        style={{
          marginBottom: 20,
          fontWeight: 700,
          color: "#111",
        }}
      >
        Quản lý Nội dung Trang Tĩnh
      </Title>

      {/* Vùng tab chỉnh sửa */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          padding: 16,
        }}
      >
        <Tabs
          defaultActiveKey="about"
          type="card"
          onChange={(key) => setActiveKey(key as TabKey)}
        >
          <TabPane tab="Giới thiệu" key="about">
            {renderTabContent("about")}
          </TabPane>
          <TabPane tab="Điều khoản" key="terms">
            {renderTabContent("terms")}
          </TabPane>
          <TabPane tab="Chính sách" key="policies">
            <Tabs
              defaultActiveKey="privacy_policy"
              type="line"
              onChange={(key) => setActiveKey(key as TabKey)}
            >
              <TabPane tab="Chính sách bảo mật" key="privacy_policy">
                {renderTabContent("privacy_policy")}
              </TabPane>
              <TabPane tab="Chính sách hoàn tiền" key="refund_policy">
                {renderTabContent("refund_policy")}
              </TabPane>
              <TabPane tab="Chính sách thanh toán" key="payment_policy">
                {renderTabContent("payment_policy")}
              </TabPane>
              <TabPane tab="Chính sách hủy" key="cancellation_policy">
                {renderTabContent("cancellation_policy")}
              </TabPane>
              <TabPane tab="Chính sách vận chuyển" key="shipping_policy">
                {renderTabContent("shipping_policy")}
              </TabPane>
            </Tabs>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

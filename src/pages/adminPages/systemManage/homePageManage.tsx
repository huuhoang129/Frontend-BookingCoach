import { useEffect, useState } from "react";
import { Tabs, Form } from "antd";
import { FormInput } from "../../../components/ui/Form/FormInput";
import { FormMarkDown } from "../../../components/ui/Form/FormMarkDown";
import SaveButton from "../../../components/ui/Button/Create";
import PreviewButton from "../../../components/ui/Button/quickView";
import EditButton from "../../../components/ui/Button/Edit";
import ReactMarkdown from "react-markdown";

import { useStaticPages } from "../../../hooks/useStaticPages.ts";
import type { TabKey } from "../../../hooks/useStaticPages.ts";
import "./homepageManage.scss";

const { TabPane } = Tabs;

export default function HomepageManage() {
  const [form] = Form.useForm();
  const { mode, setMode, savedContent, handleSave } = useStaticPages();

  const [activeKey, setActiveKey] = useState<TabKey>("about");

  useEffect(() => {
    if (savedContent[activeKey]) {
      form.setFieldsValue(savedContent[activeKey]);
    }
  }, [activeKey, savedContent, form]);

  const renderTabContent = (key: TabKey) => {
    return mode[key] === "edit" ? (
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleSave(values, key)}
      >
        <FormInput name="title" label="Tiêu đề" placeholder="Nhập tiêu đề" />

        <Form.Item name="content" label="Nội dung">
          <FormMarkDown width="1230px" folder={key} />
        </Form.Item>

        <Form.Item>
          <SaveButton onClick={() => form.submit()} />
          <PreviewButton
            onClick={() => setMode((prev) => ({ ...prev, [key]: "preview" }))}
          />
        </Form.Item>
      </Form>
    ) : (
      <div className="preview-mode">
        <div className="preview-header">
          <h2 className="preview-title">{savedContent[key].title}</h2>
          <EditButton
            onClick={() => setMode((prev) => ({ ...prev, [key]: "edit" }))}
          />
        </div>

        <div className="preview-body">
          <div className="preview-content markdown-body">
            <ReactMarkdown>{savedContent[key].content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="panel-homepage-admin">
      <div className="title-homepage">
        <h2>Quản Lý Nội Dung Trang Tĩnh</h2>
      </div>

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
            <TabPane tab="Chính Sách: Bảo Mật" key="privacy_policy">
              {renderTabContent("privacy_policy")}
            </TabPane>
            <TabPane tab="Chính Sách: Hoàn Tiền" key="refund_policy">
              {renderTabContent("refund_policy")}
            </TabPane>
            <TabPane tab="Chính Sách: Thanh Toán" key="payment_policy">
              {renderTabContent("payment_policy")}
            </TabPane>
            <TabPane tab="Chính Sách: Hoàn Huỷ" key="cancellation_policy">
              {renderTabContent("cancellation_policy")}
            </TabPane>
            <TabPane tab="Chính Sách: Vận Chuyển" key="shipping_policy">
              {renderTabContent("shipping_policy")}
            </TabPane>
          </Tabs>
        </TabPane>
      </Tabs>
    </div>
  );
}

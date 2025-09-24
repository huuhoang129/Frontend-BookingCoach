import { useState } from "react";
import { DatePicker, Radio, Button, TreeSelect } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  SearchOutlined,
  SendOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "../../styles/Form/FormInputSearchCoach.scss";
import { LOCATIONS } from "../../../constants/locations.ts";
import type { TreeSelectProps } from "antd";

export default function BookingForm() {
  const [tripType, setTripType] = useState("oneway");
  const [departureDate, setDepartureDate] = useState(dayjs());
  const [returnDate, setReturnDate] = useState(dayjs().add(1, "day"));
  const [from, setFrom] = useState<{ value: string; label: string }>();
  const [to, setTo] = useState<{ value: string; label: string }>();
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  const handleSearch = () => {
    console.log("===== Booking Data =====");
    console.log("Loại chuyến đi:", tripType);
    console.log("Điểm đi:", from);
    console.log("Điểm đến:", to);
    console.log("Ngày đi:", departureDate?.format("DD/MM/YYYY"));
    if (tripType === "round") {
      console.log("Ngày về:", returnDate?.format("DD/MM/YYYY"));
    }
    console.log("========================");
  };

  const treeData = LOCATIONS.map((p) => ({
    title: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <span>{p.label}</span>
        <DownOutlined
          style={{
            fontSize: 14,
            color: "#fff",
            marginLeft: "auto",
          }}
        />
      </div>
    ),
    value: p.value,
    key: p.value,
    selectable: false,
    children: (p.children || []).map((c) => ({
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <EnvironmentOutlined style={{ color: "#007bff" }} />
          <span>{c.label}</span>
        </div>
      ),
      value: `${p.value}/${c.value}`,
      key: `${p.value}/${c.value}`,
      isLeaf: true,
    })),
  }));

  type TreeNode = NonNullable<TreeSelectProps["treeData"]>[number];

  const filterTree = (data: TreeNode[], keyword: string): TreeNode[] => {
    if (!keyword) return data;
    return data
      .map((node) => {
        if (node.children) {
          const filteredChildren = filterTree(node.children, keyword);
          if (filteredChildren.length > 0) {
            return { ...node, children: filteredChildren };
          }
        }
        if (String(node.title).toLowerCase().includes(keyword.toLowerCase())) {
          return node;
        }
        return null;
      })
      .filter((n): n is TreeNode => n !== null);
  };

  return (
    <div className="booking-form">
      <div className="booking-form__trip-type">
        <Radio.Group
          value={tripType}
          onChange={(e) => setTripType(e.target.value)}
          className="booking-form__radio-group"
        >
          <Radio value="oneway">Một chiều</Radio>
          <Radio value="round">Khứ hồi</Radio>
        </Radio.Group>
      </div>

      <div className="booking-form__inputs">
        {/* Điểm đi */}
        <div className="booking-form__field">
          <div className="booking-form__icon">
            <SendOutlined style={{ transform: "rotate(320deg)" }} />
          </div>
          <div className="booking-form__content">
            <label className="booking-form__field-label">Điểm đi</label>
            <TreeSelect
              treeData={filterTree(treeData, searchFrom)}
              placeholder="Chọn điểm đi"
              value={from}
              switcherIcon={null}
              labelInValue
              onChange={(val) =>
                setFrom(val as { value: string; label: string })
              }
              className="booking-form__field-input"
              treeDefaultExpandAll={false}
              treeExpandAction="click"
              showSearch={false}
              dropdownMatchSelectWidth={true}
              getPopupContainer={(triggerNode) =>
                triggerNode.closest(".booking-form__field") as HTMLElement
              }
              dropdownRender={(menu) => (
                <div>
                  <div
                    style={{
                      textAlign: "center",
                      fontWeight: 600,
                      padding: "4px 0",
                    }}
                  >
                    Xuất Phát
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={searchFrom}
                      onChange={(e) => setSearchFrom(e.target.value)}
                      style={{
                        width: "95%",
                        padding: "10px 8px",
                        margin: "6px auto",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        display: "block",
                        fontFamily: "Lexend, sans-serif",
                      }}
                    />
                  </div>
                  <div>{menu}</div>
                </div>
              )}
            />
          </div>
        </div>

        {/* Điểm đến */}
        {/* Điểm đến */}
        <div className="booking-form__field">
          <div className="booking-form__icon">
            <EnvironmentOutlined />
          </div>
          <div className="booking-form__content">
            <label className="booking-form__field-label">Điểm đến</label>
            <TreeSelect
              treeData={filterTree(treeData, searchTo)}
              placeholder="Chọn điểm đến"
              value={to}
              switcherIcon={null}
              labelInValue
              onChange={(val) => setTo(val as { value: string; label: string })}
              className="booking-form__field-input"
              treeDefaultExpandAll={false}
              treeExpandAction="click"
              showSearch={false}
              dropdownMatchSelectWidth={true}
              getPopupContainer={(triggerNode) =>
                triggerNode.closest(".booking-form__field") as HTMLElement
              }
              dropdownRender={(menu) => (
                <div>
                  <div
                    style={{
                      textAlign: "center",
                      fontWeight: 600,
                      padding: "4px 0",
                    }}
                  >
                    Điểm Đến
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={searchTo}
                      onChange={(e) => setSearchTo(e.target.value)}
                      style={{
                        width: "95%",
                        padding: "10px 8px",
                        margin: "6px auto",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        display: "block",
                        fontFamily: "Lexend, sans-serif",
                      }}
                    />
                  </div>
                  <div>{menu}</div>
                </div>
              )}
            />
          </div>
        </div>

        {/* Ngày đi */}
        <div className="booking-form__field">
          <div className="booking-form__icon">
            <CalendarOutlined />
          </div>
          <div className="booking-form__content">
            <label className="booking-form__field-label">Ngày đi</label>
            <DatePicker
              value={departureDate}
              onChange={(date) => setDepartureDate(date!)}
              format="DD/MM/YYYY"
              className="booking-form__field-input"
              suffixIcon={null}
            />
          </div>
        </div>

        {/* Ngày về */}
        {tripType === "round" && (
          <div className="booking-form__field">
            <div className="booking-form__icon">
              <CalendarOutlined />
            </div>
            <div className="booking-form__content">
              <label className="booking-form__field-label">Ngày về</label>
              <DatePicker
                value={returnDate}
                onChange={(date) => setReturnDate(date!)}
                format="DD/MM/YYYY"
                className="booking-form__field-input"
                suffixIcon={null}
              />
            </div>
          </div>
        )}

        <Button
          type="primary"
          icon={<SearchOutlined />}
          className="booking-form__button"
          onClick={handleSearch}
        >
          Tìm ngay
        </Button>
      </div>
    </div>
  );
}

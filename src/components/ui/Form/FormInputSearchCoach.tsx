import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import type { TreeSelectProps } from "antd";
import { getLocationsTree } from "../../../services/stationServices/locationServices";

export default function BookingForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // lấy từ query param
  const qpFrom = searchParams.get("fromLocationId");
  const qpTo = searchParams.get("toLocationId");
  const qpStart = searchParams.get("tripDateStart");
  const qpEnd = searchParams.get("tripDateEnd");
  const qpRound = searchParams.get("roundTrip");

  const [tripType, setTripType] = useState(
    qpRound === "both" ? "round" : "oneway"
  );
  const [departureDate, setDepartureDate] = useState(
    qpStart ? dayjs(qpStart) : dayjs()
  );
  const [returnDate, setReturnDate] = useState(
    qpEnd ? dayjs(qpEnd) : dayjs().add(1, "day")
  );
  const [from, setFrom] = useState<
    { value: string; label: string } | undefined
  >(qpFrom ? { value: qpFrom, label: "" } : undefined);
  const [to, setTo] = useState<{ value: string; label: string } | undefined>(
    qpTo ? { value: qpTo, label: "" } : undefined
  );

  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [treeData, setTreeData] = useState<any[]>([]);

  const handleSearch = () => {
    if (!from || !to || !departureDate) return;

    let url = `/booking?fromLocationId=${from.value}&toLocationId=${
      to.value
    }&tripDateStart=${departureDate.format("YYYY-MM-DD")}`;

    if (tripType === "round" && returnDate) {
      url += `&tripDateEnd=${returnDate.format("YYYY-MM-DD")}`;
    }
    url += `&roundTrip=${tripType === "round" ? "both" : "one"}`;

    navigate(url);
  };

  // load tree data
  useEffect(() => {
    getLocationsTree().then((res) => {
      if (res.data && Array.isArray(res.data.data)) {
        const mapped = res.data.data.map((p: any) => ({
          title: (
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <span>{p.label}</span>
              <DownOutlined
                style={{ fontSize: 14, color: "#fff", marginLeft: "auto" }}
              />
            </div>
          ),
          label: p.label,
          value: p.value,
          key: p.value,
          selectable: false,
          children: (p.children || []).map((c: any) => ({
            title: (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <EnvironmentOutlined style={{ color: "#007bff" }} />
                <span>{c.label}</span>
              </div>
            ),
            label: c.label,
            value: c.value,
            key: c.value,
            isLeaf: true,
          })),
        }));
        setTreeData(mapped);

        // gán lại label cho from/to
        if (qpFrom) {
          const found = mapped
            .flatMap((p: any) => p.children)
            .find((c: any) => c.value === qpFrom);
          if (found) setFrom({ value: found.value, label: found.label });
        }
        if (qpTo) {
          const found = mapped
            .flatMap((p: any) => p.children)
            .find((c: any) => c.value === qpTo);
          if (found) setTo({ value: found.value, label: found.label });
        }
      }
    });
  }, []);

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
        if (
          (node as any).label?.toLowerCase().includes(keyword.toLowerCase())
        ) {
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

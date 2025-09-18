import { useState } from "react";
import { DatePicker, Radio, Button, Select } from "antd";
import {
  SearchOutlined,
  SendOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "../../styles/Form/FormInputSearchCoach.scss";

const { Option } = Select;

export default function BookingForm() {
  const [tripType, setTripType] = useState("round");
  const [departureDate, setDepartureDate] = useState(dayjs());
  const [returnDate, setReturnDate] = useState(dayjs().add(1, "day"));

  return (
    <div className="booking-form">
      {/* Loại chuyến đi */}
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
            <Select
              placeholder="Chọn điểm đi"
              className="booking-form__field-input"
            >
              <Option value="hn">Hà Nội</Option>
              <Option value="qn">Quảng Ninh</Option>
              <Option value="hp">Hải Phòng</Option>
            </Select>
          </div>
        </div>

        {/* Điểm đến */}
        <div className="booking-form__field">
          <div className="booking-form__icon">
            <EnvironmentOutlined />
          </div>
          <div className="booking-form__content">
            <label className="booking-form__field-label">Điểm đến</label>
            <Select
              placeholder="Chọn điểm đến"
              className="booking-form__field-input"
            >
              <Option value="hn">Hà Nội</Option>
              <Option value="qn">Quảng Ninh</Option>
              <Option value="hp">Hải Phòng</Option>
            </Select>
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

        {/* Ngày về (chỉ hiện khi khứ hồi) */}
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

        {/* Nút tìm */}
        <Button
          type="primary"
          icon={<SearchOutlined />}
          className="booking-form__button"
        >
          Tìm ngay
        </Button>
      </div>
    </div>
  );
}

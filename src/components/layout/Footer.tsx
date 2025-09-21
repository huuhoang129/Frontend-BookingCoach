import type { JSX } from "react/jsx-runtime";
import "./Footer.scss";

// Icon assets
import locationIcon from "../../assets/icon/location.svg";
import emailIcon from "../../assets/icon/email.svg";
import websiteIcon from "../../assets/icon/website.svg";
import phoneIcon from "../../assets/icon/call-phone.svg";

// Logo
import Logo from "../../assets/logo/Logo-HuongDuong.jpg";

export default function Footer(): JSX.Element {
  return (
    <footer className="app-footer" role="contentinfo" aria-label="Footer">
      <div className="footer">
        <div className="footer-wp">
          <div className="container">
            <div className="row">
              {/* ======================== 
                  Cột 1: Thông tin công ty 
              ======================== */}
              <div className="row-1">
                <img src={Logo} alt="Logo Hương Dương" className="logo" />
                <h4 className="footer-heading">
                  CÔNG TY TNHH NHÀ XE HƯƠNG DƯƠNG
                </h4>
                <p className="registration">
                  Giấy chứng nhận ĐKKD số 5702037190 do Sở KH và ĐT Tỉnh Quảng
                  Ninh cấp lần đầu ngày 13/03/2020
                </p>

                {/* Địa chỉ */}
                <div className="contact-icon gap">
                  <img src={locationIcon} alt="Địa chỉ" className="icon" />
                  <span>
                    Trụ sở chính: 136 Đ. Hồ Tùng Mậu, Cầu Diễn, Nam Từ Liêm, Hà
                    Nội 100000, Việt Nam
                  </span>
                </div>

                {/* Email */}
                <div className="contact-icon gap">
                  <img src={emailIcon} alt="Email" className="icon" />
                  <a
                    href="mailto:congtyhuongduong@gmail.com"
                    className="text-primary-hover"
                  >
                    Congtyhuongduong@gmail.com
                  </a>
                </div>

                {/* Website */}
                <div className="contact-icon gap">
                  <img src={websiteIcon} alt="Website" className="icon" />
                  <a
                    href="http://localhost:5173/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Hãng xe khách Hương Dương
                  </a>
                </div>

                {/* Hotline */}
                <div className="contact-icon gap">
                  <img src={phoneIcon} alt="Hotline Hà Nội" className="icon" />
                  <a href="tel:+8419002640">
                    Hotline Hà Nội: 1900 2640 - 02033 991991
                  </a>
                </div>

                <div className="contact-icon gap">
                  <img src={phoneIcon} alt="Hotline Hà Nam" className="icon" />
                  <a href="tel:+8419002640">
                    Hotline Hà Nam: 1900 2640 - 02033 991991
                  </a>
                </div>

                <div className="contact-icon gap">
                  <img
                    src={phoneIcon}
                    alt="Hotline Thanh Hóa"
                    className="icon"
                  />
                  <a href="tel:+8419002640">
                    Hotline Thanh Hóa: 1900 2640 - 02033 991991
                  </a>
                </div>
              </div>

              {/* ======================== 
                  Cột 2: Về chúng tôi 
              ======================== */}
              <div className="row-2">
                <h2>Về Chúng Tôi</h2>
                <ul>
                  <li>
                    <a href="/about">Giới thiệu</a>
                  </li>
                  <li>
                    <a href="/term">Điều khoản quy định chung</a>
                  </li>
                </ul>
              </div>

              {/* ======================== 
                  Cột 3: Hỗ trợ 
              ======================== */}
              <div className="row-3">
                <h2>Hỗ Trợ</h2>
                <ul>
                  <li>
                    <a href="/privacy_policy">Chính sách bảo mật</a>
                  </li>
                  <li>
                    <a href="/refund_policy">Chính sách đổi trả</a>
                  </li>
                  <li>
                    <a href="/payment_policy">Chính sách thanh toán</a>
                  </li>
                  <li>
                    <a href="/cancellation_policy">Chính sách hoàn hủy</a>
                  </li>
                  <li>
                    <a href="/shipping_policy">Chính sách vận chuyển</a>
                  </li>
                </ul>
              </div>

              {/* ======================== 
                  Cột 4: Lộ trình phổ biến 
              ======================== */}
              <div className="row-4">
                <h2>Lộ Trình Phổ Biến</h2>
                <ul>
                  <li>
                    <a href="/lo-trinh/hn-hp">Hà Nội - Hải Phòng</a>
                  </li>
                  <li>
                    <a href="/lo-trinh/hn-hl">Hà Nội - Hạ Long</a>
                  </li>
                  <li>
                    <a href="/lo-trinh/th-hn">Thanh Hóa - Hà Nội</a>
                  </li>
                  <li>
                    <a href="/lo-trinh/hn-tq">Hà Nội - Tuyên Quang</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* ======================== 
                Footer bottom 
            ======================== */}
            <div className="footer-bottom">
              Copyright © {new Date().getFullYear()} Hãng xe khách Hương Dương -
              All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

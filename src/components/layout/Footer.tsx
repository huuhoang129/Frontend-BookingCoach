import "./Footer.scss";

// import icons (điều chỉnh đường dẫn theo structure của bạn)
import locationIcon from "../../assets/icon/location.svg";
import emailIcon from "../../assets/icon/email.svg";
import websiteIcon from "../../assets/icon/website.svg";
import phoneIcon from "../../assets/icon/call-phone.svg";
import Logo from "../../assets/logo/Logo-HuongDuong.jpg";

export default function Footer() {
  return (
    <footer className="app-footer" role="contentinfo" aria-label="Footer">
      <div className="footer">
        <div className="footer-wp">
          <div className="container">
            <div className="row">
              <div className="row-1">
                <img src={Logo} alt="" className="logo" />
                <h4 className="footer-heading">
                  CÔNG TY TNHH NHÀ XE HƯƠNG DƯƠNG
                </h4>
                <p className="registration">
                  Giấy chứng nhận ĐKKD số 5702037190 do Sở KH và ĐT Tỉnh Quảng
                  Ninh cấp lần đầu ngày 13/03/2020
                </p>
                <div className="contact-icon gap">
                  <img src={locationIcon} alt="Địa chỉ" className="icon" />
                  <span>
                    Trụ sở chính: 136 Đ. Hồ Tùng Mậu, Cầu Diễn, Nam Từ Liêm, Hà
                    Nội 100000, Việt Nam
                  </span>
                </div>

                <div className="contact-icon gap">
                  <img src={emailIcon} alt="Email" className="icon" />
                  <a
                    href="mailto:congtyhuongduong@gmail.com"
                    className="text-primary-hover"
                  >
                    Congtyhuongduong@gmail.com
                  </a>
                </div>

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

                <div className="contact-icon gap">
                  <img src={phoneIcon} alt="Hotline" className="icon" />
                  <a href="tel:+8419002640">
                    Hotline Hà Nội: 1900 2640 - 02033 991991
                  </a>
                </div>

                <div className="contact-icon gap">
                  <img src={phoneIcon} className="icon" />
                  <a href="tel:+8419002640">
                    Hotline Hà Nam: 1900 2640 - 02033 991991
                  </a>
                </div>

                <div className="contact-icon gap">
                  <img src={phoneIcon} className="icon" />
                  <a href="tel:+8419002640">
                    Hotline Thanh Hóa: 1900 2640 - 02033 991991
                  </a>
                </div>
              </div>

              <div className="row-2">
                <h2>Về Chúng Tôi</h2>
                <ul>
                  <li>
                    <a href="/gioi-thieu">Giới thiệu</a>
                  </li>
                  <li>
                    <a href="/dieu-khoan">Điều khoản quy định chung</a>
                  </li>
                </ul>
              </div>

              <div className="row-3">
                <h2>Hỗ Trợ</h2>
                <ul>
                  <li>
                    <a href="/quy-che">Quy chế hoạt động của Website</a>
                  </li>
                  <li>
                    <a href="/bao-mat">Chính sách bảo mật</a>
                  </li>
                  <li>
                    <a href="/huong-dan">Hướng dẫn đặt xe và thanh toán</a>
                  </li>
                  <li>
                    <a href="/hoan-huy">Chính sách hoàn hủy và đổi trả</a>
                  </li>
                </ul>
              </div>

              <div className="row-4">
                <h2>Lộ Trình Phổ Biến</h2>
                <ul>
                  <li>
                    <a href="/hoan-huy">Hà Nội - Hải Phòng</a>
                  </li>
                  <li>
                    <a href="/hoan-huy">Hà Nội - Hạ Long</a>
                  </li>
                  <li>
                    <a href="/hoan-huy">Thanh Hóa - Hà Nội</a>
                  </li>
                  <li>
                    <a href="/hoan-huy">Hà Nội - Tuyên Quang</a>
                  </li>
                </ul>
              </div>
            </div>
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

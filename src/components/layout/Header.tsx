import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import "./Header.scss";

// Assets
import dropIcon from "../../assets/icon/drop-down.svg";
import vietNam from "../../assets/icon/vietnam.svg";
import Logo from "../../assets/logo/Logo-HuongDuong.jpg";

export default function Header(): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <div className="header">
      <div className="header-container">
        {/* ========================
            Logo
        ======================== */}
        <div className="header-logo">
          <a href="/">
            <img src={Logo} alt="Logo Hương Dương" />
          </a>
        </div>

        {/* ========================
            Navigation menu
        ======================== */}
        <div className="header-nav">
          <div className="header-nav-menu">
            <ul>
              <li>
                <a
                  href="/"
                  className={location.pathname === "/" ? "active" : ""}
                >
                  Trang chủ
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className={location.pathname === "/about" ? "active" : ""}
                >
                  Giới Thiệu
                </a>
              </li>
              <li>
                <a href="#">Tin Tức</a>
              </li>
              <li>
                <a
                  href="/contact"
                  className={location.pathname === "/contact" ? "active" : ""}
                >
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ========================
            Language selector
        ======================== */}
        <div className="header-lang">
          {/* Nút chọn ngôn ngữ */}
          <div className="header-lang-vien" onClick={() => setOpen(!open)}>
            <img src={vietNam} alt="Vietnam" className="icon" />
            <img src={dropIcon} alt="Dropdown" className="icon" />
          </div>

          {/* Dropdown */}
          {open && (
            <div className="header-lang-dropdown">
              <ul>
                <li>
                  <a href="#">
                    <img src={vietNam} alt="Vietnam" className="icon" /> VI
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src={vietNam} alt="English" className="icon" /> EN
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

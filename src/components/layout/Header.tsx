import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import "./Header.scss";

import dropIcon from "../../assets/icon/drop-down.svg";
import vietNam from "../../assets/icon/vietnam.svg";
import Logo from "../../assets/logo/Logo-HuongDuong.jpg";

export default function Header(): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <div className="header">
      <div className="header-container">
        <div className="header-logo">
          <a href="/">
            <img src={Logo} alt="" />
          </a>
        </div>
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
                  href="/gioithieu"
                  className={location.pathname === "/gioithieu" ? "active" : ""}
                >
                  Giới Thiệu
                </a>
              </li>
              <li>
                <a href="#">Tin Tức</a>
              </li>
              <li>
                <a href="#">Liên hệ</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="header-lang">
          <div className="header-lang-vien" onClick={() => setOpen(!open)}>
            <img src={vietNam} className="icon" />
            <img src={dropIcon} className="icon" />
          </div>
          {open && (
            <div className="header-lang-dropdown">
              <ul>
                <li>
                  <a href="#">
                    <img src={vietNam} className="icon" /> VI
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src={vietNam} className="icon" /> EN
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

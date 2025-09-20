import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "./contactPage.scss";

export default function ContactPage() {
  const offices = [
    {
      title: "Văn phòng bến Mỹ Đình",
      address: "76 Trần Vỹ - Mai Dịch - Cầu Giấy - Hà Nội",
      phone: "02373833552",
    },
    {
      title: "Văn phòng bến Giáp Bát",
      address: "Quầy T1; Phòng vé số 16; Chỗ đỗ xe A3-12",
      phone: "02373833552",
    },
    {
      title: "Văn phòng bến Thọ Xuân",
      address: "Nhà xe Ngọc Sơn, khu 5, thị trấn Thọ Xuân, Thanh Hoá",
      phone: "02373833552",
    },
  ];

  return (
    <div className="contact-page">
      {/* Phần 1: Liên hệ chính */}
      <section className="contact-main">
        <div className="contact-info">
          <h2>Liên hệ với chúng tôi</h2>

          <div className="info-item">
            <PhoneOutlined className="icon phone" />
            <div>
              <strong>HOTLINE CSKH</strong>
              <p>02378 888 888</p>
            </div>
          </div>

          <div className="info-item">
            <MailOutlined className="icon email" />
            <div>
              <strong>EMAIL</strong>
              <p>dichvuvantaivananh.jsc@gmail.com</p>
            </div>
          </div>

          <div className="info-item">
            <EnvironmentOutlined className="icon address" />
            <div>
              <strong>ĐỊA CHỈ</strong>
              <p>Hàm Rồng, Thành phố Thanh Hoá, Tỉnh Thanh Hoá, Việt Nam</p>
              <a
                href="https://maps.google.com/?q=Nguyen+Chi+Thanh,+Thanh+Hoa"
                target="_blank"
                rel="noopener noreferrer"
              >
                SHOW ON MAP
              </a>
            </div>
          </div>
        </div>

        {/* Google map */}
        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.598632119693!2d105.76716231501755!3d19.806184986154665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3136fcb9cf9f1f2d%3A0x9b89e969c96f1!2zMyBOZ3V54buFbiBDaMOtIFRoYW5oLCBQaMO6bmcgSMOgbSBS4bq_bmcsIFRoYW5oIEjDoCwgVmnhu4d0IE5hbQ!5e0!3m2!1sen!2s!4v1695064908321!5m2!1sen!2s"
            width="100%"
            height="350"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* Phần 2: Hệ thống phòng vé */}
      <section className="office-system">
        <h3>Hệ thống phòng vé</h3>
        <div className="office-list">
          {offices.map((office, idx) => (
            <div className="office-item" key={idx}>
              <HomeOutlined className="icon home" />
              <div>
                <h4>{office.title}</h4>
                <p>{office.address}</p>
                <p>
                  <span>Điện thoại đặt vé: </span>
                  <strong>{office.phone}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

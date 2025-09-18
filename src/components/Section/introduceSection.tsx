import bookTicket from "../../assets/introduce/book-ticket.svg";
import multipleService from "../../assets/introduce/multiple-service.svg";
import qualityService from "../../assets/introduce/service-quality.svg";
import "../styles/Section/introduceSection.scss";

export default function ServiceIntro() {
  const services = [
    {
      icon: bookTicket,
      title: "Dễ dàng đặt xe",
      desc: "Đặt xe và trải nghiệm các dịch vụ của Vân Đồn Xanh chỉ với vài thao tác đơn giản.",
    },
    {
      icon: multipleService,
      title: "Dịch vụ đa dạng",
      desc: "Phục vụ mọi nhu cầu di chuyển của bạn.",
    },
    {
      icon: qualityService,
      title: "Thuận tiện và nhanh chóng",
      desc: "Vân Đồn Xanh Taxi sẽ đưa bạn đi mọi nơi mọi lúc bạn muốn với tốc độ và dịch vụ tốt nhất.",
    },
  ];

  return (
    <div className="service-intro">
      {services.map((s, i) => (
        <div className="service-item" key={i}>
          <div className="service-icon">
            <img src={s.icon} alt={s.title} />
          </div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

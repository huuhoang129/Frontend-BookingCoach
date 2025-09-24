export interface Location {
  value: string;
  label: string;
  children?: Location[];
  disabled?: boolean;
}

export const LOCATIONS: Location[] = [
  {
    value: "hn",
    label: "Hà Nội",
    children: [
      { value: "lb", label: "Long Biên" },
      { value: "tx", label: "Thanh Xuân" },
      { value: "th", label: "Tây Hồ" },
      { value: "sb", label: "Sân Bay Nội Bài" },
      { value: "bt", label: "Bắc Từ Liêm" },
    ],
  },
  {
    value: "qn",
    label: "Quảng Ninh",
    children: [
      { value: "hl", label: "Hạ Long" },
      { value: "vd", label: "Vân Đồn" },
      { value: "cp", label: "Cẩm Phả" },
      { value: "mc", label: "Móng Cái" },
    ],
  },
  {
    value: "hp",
    label: "Hải Phòng",
    children: [
      { value: "cb", label: "Cát Bà" },
      { value: "ds", label: "Đồ Sơn" },
    ],
  },
  {
    value: "th",
    label: "Thanh Hóa",
    children: [
      { value: "ss", label: "Sầm Sơn" },
      { value: "hh", label: "Hải Hòa" },
      { value: "pl", label: "Pù Luông" },
      { value: "ht", label: "Hải Thanh" },
      { value: "tn", label: "Thành Nhà Hồ" },
      { value: "bht", label: "Biển Hải Tiến" },
      { value: "lk", label: "Lam Kinh" },
    ],
  },
  {
    value: "nb",
    label: "Ninh Bình",
    children: [
      { value: "ta", label: "Tràng An" },
      { value: "tc", label: "Tam Cốc - Bích Động" },
      { value: "cp", label: "Cúc Phương" },
    ],
  },
  {
    value: "na",
    label: "Nghệ An",
    children: [
      { value: "cl", label: "Cửa Lò" },
      { value: "qc", label: "Quỳ Châu" },
      { value: "pq", label: "Phủ Quỳ" },
    ],
  },
];

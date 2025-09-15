interface InputSearchProps {
  placeholder?: string;
}

export default function InputSearch({
  placeholder = "Tìm kiếm...",
}: InputSearchProps) {
  return (
    <div>
      <input type="text" placeholder={placeholder} />
      <button>Tìm</button>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export default function BackButton({ label = "Kembali" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className="btn btn-light d-inline-flex align-items-center border mb-3"
      style={{ color: "black", cursor: "pointer", backgroundColor: "white" }}
    >
      {/* <i className="bi bi-arrow-left-short " /> */}
      {label}
    </button>
  );
}

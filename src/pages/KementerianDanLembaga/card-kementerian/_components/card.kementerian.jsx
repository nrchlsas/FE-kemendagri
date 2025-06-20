import React from "react";
import { Link } from "react-router-dom";

export default function CardKementerian({ title, desc }) {
  return (
    <Link
      to={`/component-kl/${encodeURIComponent(title)}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        className="card shadow-sm border h-100 d-flex align-items-center justify-content-center text-center card-animate"
        style={{ borderColor: "#dee2e6", minHeight: "200px" }}
      >
        <div>
          <img
            src="https://pelita.kemendagri.go.id/img/image1.png"
            alt="Gambar Kementerian"
            className="mb-3"
            style={{ maxHeight: "80px", objectFit: "contain" }}
          />
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-muted">{desc}</p>
        </div>
      </div>
    </Link>
  );
}

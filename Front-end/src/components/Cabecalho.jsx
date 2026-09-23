import { Building2 } from "lucide-react";

export default function Cabecalho() {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-icon">
          <Building2 size={23} />
        </div>
        <div>
          <strong>GrandStay</strong>
          <span>Gestão de Hotel</span>
        </div>
      </div>

      <nav>
        <a className="active" href="#cadastro">
          Cadastro
        </a>
        <a href="#hospedes">Hóspedes</a>
      </nav>

      <div className="hotel-status">
        <span className="status-dot" />
        Sistema online
      </div>
    </header>
  );
}
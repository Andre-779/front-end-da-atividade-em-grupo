import { UsersRound, BedDouble, ClipboardList } from "lucide-react";

export function Estatisticas({ totalHospedes, quartosOcupados, diarias }) {
  return (
    <section className="stats">
      <div className="stat-card">
        <div className="stat-icon teal">
          <UsersRound size={20} />
        </div>
        <div>
          <span>Hóspedes cadastrados</span>
          <strong>{totalHospedes}</strong>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon blue">
          <BedDouble size={20} />
        </div>
        <div>
          <span>Quartos ocupados</span>
          <strong>{quartosOcupados}</strong>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon orange">
          <ClipboardList size={20} />
        </div>
        <div>
          <span>Diárias no cadastro atual</span>
          <strong>{diarias || "—"}</strong>
        </div>
      </div>
    </section>
  );
}

export default Estatisticas;
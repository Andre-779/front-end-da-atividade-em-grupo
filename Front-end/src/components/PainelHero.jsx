import { BedDouble } from "lucide-react";

export function PainelHero({ quartosDisponiveis }) {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">PAINEL DE RECEPÇÃO</p>
        <h1>Cadastro de hóspedes</h1>
        <p>
          Registre a hospedagem e consulte o endereço automaticamente usando o CEP.
        </p>
      </div>
      <div className="hero-card">
        <BedDouble size={22} />
        <div>
          <span>Quartos disponíveis</span>
          <strong>{quartosDisponiveis}</strong>
        </div>
      </div>
    </section>
  );
}

export default PainelHero;

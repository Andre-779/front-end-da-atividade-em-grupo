import { ClipboardList, Trash2 } from "lucide-react";

export function TabelaHospedes({ hospedes, aoRemoverHospede }) {
  return (
    <section id="hospedes" className="panel">
      <div className="panel-heading">
        <div className="heading-icon">
          <ClipboardList size={20} />
        </div>
        <div>
          <h2>Hóspedes cadastrados</h2>
          <p>Lista local para demonstração do front-end.</p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Hóspede</th>
              <th>Quarto</th>
              <th>Período</th>
              <th>Endereço</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {hospedes.map((guest) => (
              <tr key={guest.id}>
                <td>
                  <div className="guest-cell">
                    <div className="avatar">
                      {guest.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong>{guest.nome}</strong>
                      <span>{guest.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="room-badge">Quarto {guest.quarto}</span>
                </td>
                <td>
                  <strong>{guest.checkin || "—"}</strong>
                  <span className="table-sub">
                    até {guest.checkout || "—"}
                  </span>
                </td>
                <td>
                  <strong>
                    {guest.cidade || "—"}
                    {guest.uf ? ` - ${guest.uf}` : ""}
                  </strong>
                  <span className="table-sub">
                    {guest.logradouro || "Endereço não informado"}
                  </span>
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => aoRemoverHospede(guest.id)}
                    aria-label={`Remover ${guest.nome}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TabelaHospedes;
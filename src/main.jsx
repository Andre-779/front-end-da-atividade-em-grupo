import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BedDouble,
  Building2,
  CheckCircle2,
  ClipboardList,
  LoaderCircle,
  MapPin,
  Search,
  Trash2,
  UserRound,
  UsersRound,
  XCircle
} from "lucide-react";
import "./styles.css";

const emptyForm = {
  nome: "",
  email: "",
  telefone: "",
  quarto: "",
  checkin: "",
  checkout: "",
  cep: "",
  logradouro: "",
  bairro: "",
  cidade: "",
  uf: "",
  numero: "",
  complemento: ""
};

const initialGuests = [
  {
    id: 1,
    nome: "Mariana Oliveira",
    email: "mariana@email.com",
    telefone: "(11) 98888-1122",
    quarto: "204",
    checkin: "2026-09-20",
    checkout: "2026-09-24",
    cep: "01001-000",
    logradouro: "Praça da Sé",
    bairro: "Sé",
    cidade: "São Paulo",
    uf: "SP",
    numero: "10",
    complemento: ""
  }
];

function App() {
  const [form, setForm] = useState(emptyForm);
  const [guests, setGuests] = useState(() => {
    const saved = localStorage.getItem("hotel-guests");
    return saved ? JSON.parse(saved) : initialGuests;
  });
  const [cepStatus, setCepStatus] = useState("idle");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem("hotel-guests", JSON.stringify(guests));
  }, [guests]);

  const occupiedRooms = guests.length;
  const availableRooms = Math.max(0, 40 - occupiedRooms);

  const nights = useMemo(() => {
    if (!form.checkin || !form.checkout) return 0;
    const start = new Date(form.checkin + "T00:00:00");
    const end = new Date(form.checkout + "T00:00:00");
    return Math.max(0, Math.ceil((end - start) / 86400000));
  }, [form.checkin, form.checkout]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (name === "cep") {
      setCepStatus("idle");
      setMessage(null);
    }
  }

  async function buscarCep() {
    const cep = form.cep.replace(/\D/g, "");

    if (!/^\d{8}$/.test(cep)) {
      setCepStatus("error");
      setMessage({
        type: "error",
        text: "Digite um CEP válido com 8 números."
      });
      return;
    }

    setCepStatus("loading");
    setMessage(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

      if (!response.ok) {
        throw new Error("Falha na comunicação com a ViaCEP.");
      }

      const data = await response.json();

      if (data.erro) {
        setCepStatus("error");
        setMessage({
          type: "error",
          text: "CEP válido, mas não encontrado. Confira o número informado."
        });
        return;
      }

      setForm((current) => ({
        ...current,
        cep: `${cep.slice(0, 5)}-${cep.slice(5)}`,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || ""
      }));

      setCepStatus("success");
      setMessage({
        type: "success",
        text: "Endereço preenchido automaticamente pela ViaCEP."
      });
    } catch {
      setCepStatus("error");
      setMessage({
        type: "error",
        text: "Não foi possível consultar o CEP. Tente novamente."
      });
    }
  }

  function handleCepKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      buscarCep();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.nome || !form.email || !form.quarto || !form.cep) {
      setMessage({
        type: "error",
        text: "Preencha nome, e-mail, quarto e CEP antes de cadastrar."
      });
      return;
    }

    if (form.checkout && form.checkin && form.checkout <= form.checkin) {
      setMessage({
        type: "error",
        text: "A data de saída deve ser posterior à entrada."
      });
      return;
    }

    const newGuest = {
      ...form,
      id: Date.now()
    };

    setGuests((current) => [newGuest, ...current]);
    setForm(emptyForm);
    setCepStatus("idle");
    setMessage({
      type: "success",
      text: "Hóspede cadastrado com sucesso!"
    });
  }

  function removeGuest(id) {
    setGuests((current) => current.filter((guest) => guest.id !== id));
    setMessage({
      type: "success",
      text: "Cadastro removido da listagem."
    });
  }

  return (
    <div className="app-shell">
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
          <a className="active" href="#cadastro">Cadastro</a>
          <a href="#hospedes">Hóspedes</a>
        </nav>

        <div className="hotel-status">
          <span className="status-dot" />
          Sistema online
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">PAINEL DE RECEPÇÃO</p>
            <h1>Cadastro de hóspedes</h1>
            <p>
              Registre a hospedagem e consulte o endereço automaticamente
              usando o CEP.
            </p>
          </div>
          <div className="hero-card">
            <BedDouble size={22} />
            <div>
              <span>Quartos disponíveis</span>
              <strong>{availableRooms}</strong>
            </div>
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon teal"><UsersRound size={20} /></div>
            <div><span>Hóspedes cadastrados</span><strong>{guests.length}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><BedDouble size={20} /></div>
            <div><span>Quartos ocupados</span><strong>{occupiedRooms}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><ClipboardList size={20} /></div>
            <div><span>Diárias no cadastro atual</span><strong>{nights || "—"}</strong></div>
          </div>
        </section>

        <section id="cadastro" className="panel">
          <div className="panel-heading">
            <div className="heading-icon"><UserRound size={20} /></div>
            <div>
              <h2>Novo cadastro</h2>
              <p>Preencha os dados do hóspede e da hospedagem.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="section-title">Dados do hóspede</div>
            <div className="form-grid">
              <label className="field field-span-2">
                <span>Nome completo *</span>
                <input name="nome" value={form.nome} onChange={updateField} placeholder="Ex.: João da Silva" />
              </label>

              <label className="field">
                <span>E-mail *</span>
                <input type="email" name="email" value={form.email} onChange={updateField} placeholder="joao@email.com" />
              </label>

              <label className="field">
                <span>Telefone</span>
                <input name="telefone" value={form.telefone} onChange={updateField} placeholder="(11) 99999-9999" />
              </label>
            </div>

            <div className="section-title">Hospedagem</div>
            <div className="form-grid">
              <label className="field">
                <span>Quarto *</span>
                <select name="quarto" value={form.quarto} onChange={updateField}>
                  <option value="">Selecione</option>
                  {Array.from({ length: 12 }, (_, i) => 101 + i).map((room) => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Check-in</span>
                <input type="date" name="checkin" value={form.checkin} onChange={updateField} />
              </label>

              <label className="field">
                <span>Check-out</span>
                <input type="date" name="checkout" value={form.checkout} onChange={updateField} />
              </label>
            </div>

            <div className="section-title address-title">
              <span>Endereço</span>
              <small>Consulta automática via ViaCEP</small>
            </div>

            <div className="cep-row">
              <label className="field cep-field">
                <span>CEP *</span>
                <div className="input-with-icon">
                  <MapPin size={17} />
                  <input
                    name="cep"
                    value={form.cep}
                    onChange={updateField}
                    onKeyDown={handleCepKeyDown}
                    placeholder="00000-000"
                    inputMode="numeric"
                    maxLength={9}
                  />
                </div>
              </label>
              <button type="button" className="secondary-button" onClick={buscarCep} disabled={cepStatus === "loading"}>
                {cepStatus === "loading" ? <LoaderCircle className="spin" size={17} /> : <Search size={17} />}
                {cepStatus === "loading" ? "Consultando..." : "Buscar CEP"}
              </button>
            </div>

            <div className="form-grid address-grid">
              <label className="field field-span-2">
                <span>Logradouro</span>
                <input name="logradouro" value={form.logradouro} onChange={updateField} placeholder="Preenchido pela ViaCEP" />
              </label>
              <label className="field">
                <span>Número</span>
                <input name="numero" value={form.numero} onChange={updateField} placeholder="123" />
              </label>
              <label className="field">
                <span>Complemento</span>
                <input name="complemento" value={form.complemento} onChange={updateField} placeholder="Apto, bloco..." />
              </label>
              <label className="field">
                <span>Bairro</span>
                <input name="bairro" value={form.bairro} onChange={updateField} placeholder="Preenchido pela ViaCEP" />
              </label>
              <label className="field">
                <span>Cidade</span>
                <input name="cidade" value={form.cidade} onChange={updateField} placeholder="Preenchido pela ViaCEP" />
              </label>
              <label className="field">
                <span>UF</span>
                <input name="uf" value={form.uf} onChange={updateField} placeholder="UF" maxLength={2} />
              </label>
            </div>

            {message && (
              <div className={`feedback ${message.type}`}>
                {message.type === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                {message.text}
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="ghost-button" onClick={() => { setForm(emptyForm); setMessage(null); setCepStatus("idle"); }}>
                Limpar
              </button>
              <button type="submit" className="primary-button">
                <UserRound size={18} />
                Cadastrar hóspede
              </button>
            </div>
          </form>
        </section>

        <section id="hospedes" className="panel">
          <div className="panel-heading">
            <div className="heading-icon"><ClipboardList size={20} /></div>
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
                {guests.map((guest) => (
                  <tr key={guest.id}>
                    <td>
                      <div className="guest-cell">
                        <div className="avatar">{guest.nome.charAt(0).toUpperCase()}</div>
                        <div><strong>{guest.nome}</strong><span>{guest.email}</span></div>
                      </div>
                    </td>
                    <td><span className="room-badge">Quarto {guest.quarto}</span></td>
                    <td>
                      <strong>{guest.checkin || "—"}</strong>
                      <span className="table-sub">até {guest.checkout || "—"}</span>
                    </td>
                    <td>
                      <strong>{guest.cidade || "—"}{guest.uf ? ` - ${guest.uf}` : ""}</strong>
                      <span className="table-sub">{guest.logradouro || "Endereço não informado"}</span>
                    </td>
                    <td>
                      <button className="delete-button" onClick={() => removeGuest(guest.id)} aria-label={`Remover ${guest.nome}`}>
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer>
        <span>GrandStay • Front-end React</span>
        <span>Consulta de endereço: ViaCEP</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
import { useState, useEffect, useMemo } from "react";
import Cabecalho from "./components/Cabecalho.jsx";
import PainelHero from "./components/PainelHero.jsx";
import Estatisticas from "./components/Estatisticas.jsx";
import FormularioCadastro from "./components/FormularioCadastro.jsx";
import TabelaHospedes from "./components/TabelaHospedes.jsx";
import Rodape from "./components/Rodape.jsx";
import "./index.css";

const API_URL = "http://localhost:3000/api/hospedes";

const formularioVazio = {
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
  complemento: "",
};

export default function App() {
  const [form, setForm] = useState(formularioVazio);
  const [guests, setGuests] = useState([]);
  const [cepStatus, setCepStatus] = useState("idle");
  const [message, setMessage] = useState(null);

  // 1. Carregar hóspedes do MySQL ao iniciar a aplicação
  useEffect(() => {
    async function carregarHospedes() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao carregar dados do servidor");
        
        const dados = await response.json();
        setGuests(dados);
      } catch (error) {
        console.error("Erro ao procurar hóspedes:", error);
        setMessage({
          type: "error",
          text: "Não foi possível ligar ao servidor para carregar os hóspedes.",
        });
      }
    }

    carregarHospedes();
  }, []);

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
        text: "Digite um CEP válido com 8 números.",
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
          text: "CEP válido, mas não encontrado. Confira o número informado.",
        });
        return;
      }

      setForm((current) => ({
        ...current,
        cep: `${cep.slice(0, 5)}-${cep.slice(5)}`,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
      }));

      setCepStatus("success");
      setMessage({
        type: "success",
        text: "Endereço preenchido automaticamente pela ViaCEP.",
      });
    } catch {
      setCepStatus("error");
      setMessage({
        type: "error",
        text: "Não foi possível consultar o CEP. Tente novamente.",
      });
    }
  }

  function handleCepKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      buscarCep();
    }
  }

  // 2. Enviar o cadastro para a base de dados via POST
  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.nome || !form.email || !form.quarto || !form.cep) {
      setMessage({
        type: "error",
        text: "Preencha nome, e-mail, quarto e CEP antes de cadastrar.",
      });
      return;
    }

    if (form.checkout && form.checkin && form.checkout <= form.checkin) {
      setMessage({
        type: "error",
        text: "A data de saída deve ser posterior à entrada.",
      });
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Erro ao guardar na base de dados");

      const resultado = await response.json();

      // Adiciona o novo registo à lista com o ID devolvido pelo MySQL
      setGuests((current) => [{ ...form, id: resultado.id }, ...current]);
      setForm(formularioVazio);
      setCepStatus("idle");
      setMessage({
        type: "success",
        text: "Hóspede cadastrado com sucesso no MySQL!",
      });
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setMessage({
        type: "error",
        text: "Não foi possível salvar o hóspede. Verifique a conexão com o servidor.",
      });
    }
  }

  // 3. Remover o registo na base de dados via DELETE
  async function removeGuest(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao remover do servidor");

      setGuests((current) => current.filter((guest) => guest.id !== id));
      setMessage({
        type: "success",
        text: "Cadastro removido do banco de dados com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao apagar:", error);
      setMessage({
        type: "error",
        text: "Não foi possível remover o registo no servidor.",
      });
    }
  }

  return (
    <div className="app-shell">
      <Cabecalho />

      <main className="container">
        <PainelHero quartosDisponiveis={availableRooms} />

        <Estatisticas
          totalHospedes={guests.length}
          quartosOcupados={occupiedRooms}
          diarias={nights}
        />

        <FormularioCadastro
          formulario={form}
          aoAtualizarCampo={updateField}
          aoBuscarCep={buscarCep}
          aoPressionarTeclaCep={handleCepKeyDown}
          aoEnviar={handleSubmit}
          aoLimpar={() => {
            setForm(formularioVazio);
            setMessage(null);
            setCepStatus("idle");
          }}
          statusCep={cepStatus}
          mensagem={message}
        />

        <TabelaHospedes hospedes={guests} aoRemoverHospede={removeGuest} />
      </main>

      <Rodape />
    </div>
  );
}
import {
  UserRound,
  MapPin,
  Search,
  LoaderCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export function FormularioCadastro({
  formulario,
  aoAtualizarCampo,
  aoBuscarCep,
  aoPressionarTeclaCep,
  aoEnviar,
  aoLimpar,
  statusCep,
  mensagem,
}) {
  return (
    <section id="cadastro" className="panel">
      <div className="panel-heading">
        <div className="heading-icon">
          <UserRound size={20} />
        </div>
        <div>
          <h2>Novo cadastro</h2>
          <p>Preencha os dados do hóspede e da hospedagem.</p>
        </div>
      </div>

      <form onSubmit={aoEnviar}>
        <div className="section-title">Dados do hóspede</div>
        <div className="form-grid">
          <label className="field field-span-2">
            <span>Nome completo *</span>
            <input
              name="nome"
              value={formulario.nome}
              onChange={aoAtualizarCampo}
              placeholder="Ex.: João da Silva"
            />
          </label>

          <label className="field">
            <span>E-mail *</span>
            <input
              type="email"
              name="email"
              value={formulario.email}
              onChange={aoAtualizarCampo}
              placeholder="joao@email.com"
            />
          </label>

          <label className="field">
            <span>Telefone</span>
            <input
              name="telefone"
              value={formulario.telefone}
              onChange={aoAtualizarCampo}
              placeholder="(11) 99999-9999"
            />
          </label>
        </div>

        <div className="section-title">Hospedagem</div>
        <div className="form-grid">
          <label className="field">
            <span>Quarto *</span>
            <select
              name="quarto"
              value={formulario.quarto}
              onChange={aoAtualizarCampo}
            >
              <option value="">Selecione</option>
              {Array.from({ length: 12 }, (_, i) => 101 + i).map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Check-in</span>
            <input
              type="date"
              name="checkin"
              value={formulario.checkin}
              onChange={aoAtualizarCampo}
            />
          </label>

          <label className="field">
            <span>Check-out</span>
            <input
              type="date"
              name="checkout"
              value={formulario.checkout}
              onChange={aoAtualizarCampo}
            />
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
                value={formulario.cep}
                onChange={aoAtualizarCampo}
                onKeyDown={aoPressionarTeclaCep}
                placeholder="00000-000"
                inputMode="numeric"
                maxLength={9}
              />
            </div>
          </label>
          <button
            type="button"
            className="secondary-button"
            onClick={aoBuscarCep}
            disabled={statusCep === "loading"}
          >
            {statusCep === "loading" ? (
              <LoaderCircle className="spin" size={17} />
            ) : (
              <Search size={17} />
            )}
            {statusCep === "loading" ? "Consultando..." : "Buscar CEP"}
          </button>
        </div>

        <div className="form-grid address-grid">
          <label className="field field-span-2">
            <span>Logradouro</span>
            <input
              name="logradouro"
              value={formulario.logradouro}
              onChange={aoAtualizarCampo}
              placeholder="Preenchido pela ViaCEP"
            />
          </label>
          <label className="field">
            <span>Número</span>
            <input
              name="numero"
              value={formulario.numero}
              onChange={aoAtualizarCampo}
              placeholder="123"
            />
          </label>
          <label className="field">
            <span>Complemento</span>
            <input
              name="complemento"
              value={formulario.complemento}
              onChange={aoAtualizarCampo}
              placeholder="Apto, bloco..."
            />
          </label>
          <label className="field">
            <span>Bairro</span>
            <input
              name="bairro"
              value={formulario.bairro}
              onChange={aoAtualizarCampo}
              placeholder="Preenchido pela ViaCEP"
            />
          </label>
          <label className="field">
            <span>Cidade</span>
            <input
              name="cidade"
              value={formulario.cidade}
              onChange={aoAtualizarCampo}
              placeholder="Preenchido pela ViaCEP"
            />
          </label>
          <label className="field">
            <span>UF</span>
            <input
              name="uf"
              value={formulario.uf}
              onChange={aoAtualizarCampo}
              placeholder="UF"
              maxLength={2}
            />
          </label>
        </div>

        {mensagem && (
          <div className={`feedback ${mensagem.type}`}>
            {mensagem.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <XCircle size={18} />
            )}
            {mensagem.text}
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="ghost-button" onClick={aoLimpar}>
            Limpar
          </button>
          <button type="submit" className="primary-button">
            <UserRound size={18} />
            Cadastrar hóspede
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioCadastro;
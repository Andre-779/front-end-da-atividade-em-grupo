import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(ev) {
        ev.preventDefault();
        setSucesso('');
        setErro('');
        
        try {
            const resposta = await api.post('/login', { email, senha });
            
            localStorage.setItem('token', resposta.data.token);
            localStorage.setItem('usuario', JSON.stringify(resposta.data.usuario));
            
            // Define a mensagem primeiro para o usuário conseguir ler
            setSucesso('Login realizado com sucesso! Redirecionando...');
            
            // Aguarda 1.5 segundos antes de mudar de página
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
            
        } catch (erroRequisicao) {
            const mensagem = erroRequisicao.response?.data?.erro || 'Erro ao realizar login.';
            setErro(mensagem);
        }
    }

    return (
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Senha
                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                </label>
                
                {erro && <p className="erro">{erro}</p>}
                {sucesso && <p className="sucesso">{sucesso}</p>} {/* Adicionado para mostrar a mensagem de sucesso na tela */}
                
                <button type="submit">Entrar</button>
            </form>
            <p>
                Não tem conta? <Link to="/cadastrar">Cadastre-se</Link>
            </p>
        </div>
    );
} // <-- Essa chave estava faltando para fechar a função Login()

export default Login;

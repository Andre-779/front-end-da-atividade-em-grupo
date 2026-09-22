import db from '../config/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// NOVA FUNÇÃO: Listar todos os usuários
export const listarUsuarios = async (req, res) => {
    try {
        // Seleciona apenas os campos públicos (exclui a senha por segurança)
        const [usuarios] = await db.query("SELECT id, nome, email, role, created_at FROM usuarios");
        return res.status(200).json(usuarios);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: "Erro ao listar usuários" });
    }
}

export const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
    }

    try {
        const [existente] = await db.query("SELECT id FROM usuarios WHERE email = ?", [email]);
        if (existente && existente.length > 0) {
            return res.status(409).json({ mensagem: "O email já foi cadastrado" });
        }

        const senhaCriptor = await bcrypt.hash(senha, 10);

        // CORREÇÃO: Alterado "usuario" para "user" para bater com a ENUM('admin', 'user') do MySQL
        await db.query(
            "INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)", 
            [nome, email, senhaCriptor, "user"]
        );

        return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
        }

        const [resultado] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (resultado.length === 0) {
            return res.status(401).json({ mensagem: "Email ou senha inválidos" });
        } 

        const usuario = resultado[0];
        const senhaConfere = await bcrypt.compare(senha, usuario.senha);

        if (!senhaConfere) {
            return res.status(401).json({ mensagem: "Email ou senha inválidos" });
        }

        const payload = {
            id: usuario.id,
            email: usuario.email,
            role: usuario.role
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'fallback_secret_mude_isso',
            { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
        );

        return res.status(200).json({ 
            mensagem: "Login realizado com sucesso",
            token,
            usuario: payload
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: "Erro ao fazer login" });
    }
}

export const perfil = async (req, res) => {
    return res.status(200).json({
        usuario: req.usuario
    });
}
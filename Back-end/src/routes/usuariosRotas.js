import express from "express";
import verificarToken from "../middleware/auth.js";

import {
    cadastrarUsuario,
    login,
    perfil,
    listarUsuarios
} from "../controllers/usuariosControllers.js";

const router = express.Router();

// GET /usuarios
router.get("/", listarUsuarios);

// POST /usuarios/cadastrar
router.post("/cadastrar", cadastrarUsuario);

// POST /usuarios/login
router.post("/login", login);

// GET /usuarios/perfil
router.get("/perfil", verificarToken, perfil);

export default router;
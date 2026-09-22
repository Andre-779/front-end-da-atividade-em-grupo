import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function verificarToken(req, res, next){
    const authHeader = req.headers['authorization']; // Bearer token 

    if(!authHeader){
        return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    const token = authHeader.split(' ')[1]; // Pega o token após "Bearer"

    jwt.verify(token, process.env.jwt_secret, (err, usuarioDecodificado) =>{
        if(err){
            return res.status(403).json({ mensagem: "Token inválido ou expirado" });
        }

        req.usuario = usuarioDecodificado; // Adiciona os dados do usuário decodificado à requisição
        next();
   })
}

export default verificarToken;
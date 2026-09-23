import express from 'express';
import "dotenv/config.js"
import cors from 'cors';
import usuarioRotas from './src/routes/usuariosRotas.js';
import hospedesRotas from './src/routes/hospedesRotas.js';





const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ... suas rotas aqui ...


app.use("/usuarios", usuarioRotas);
app.use('/api/hospedes', hospedesRotas);



export default app;
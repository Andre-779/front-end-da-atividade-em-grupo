import db from '../config/db.js';

const listarHospedes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hospedes ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar hóspedes:', error);
    res.status(500).json({ mensagem: 'Erro interno ao consultar banco de dados.' });
  }
};

const criarHospede = async (req, res) => {
  const {
    nome, email, telefone, quarto, checkin, checkout,
    cep, logradouro, numero, complemento, bairro, cidade, uf
  } = req.body;

  if (!nome || !email || !quarto || !cep) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios ausentes.' });
  }

  try {
    const sql = `
      INSERT INTO hospedes 
      (nome, email, telefone, quarto, checkin, checkout, cep, logradouro, numero, complemento, bairro, cidade, uf)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      nome, email, telefone, quarto,
      checkin || null, checkout || null,
      cep, logradouro, numero, complemento, bairro, cidade, uf
    ];

    const [result] = await db.query(sql, values);

    res.status(201).json({
      id: result.insertId,
      mensagem: 'Hóspede cadastrado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao salvar no banco:', error);
    res.status(500).json({ mensagem: 'Erro interno ao salvar o registro.' });
  }
};

const deletarHospede = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM hospedes WHERE id = ?', [id]);
    res.json({ mensagem: 'Hóspede removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar hóspede:', error);
    res.status(500).json({ mensagem: 'Erro interno ao excluir registro.' });
  }
};

// EXPORTAÇÃO DEFAULT AQUI:
export default {
  listarHospedes,
  criarHospede,
  deletarHospede
};
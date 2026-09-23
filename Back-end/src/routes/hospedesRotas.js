import express from 'express';
import hospedesController from '../controllers/hospedesController.js';


const router = express.Router();

router.get('/', hospedesController.listarHospedes);
router.post('/', hospedesController.criarHospede);
router.delete('/:id', hospedesController.deletarHospede);


export default router;
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productos.controller');
const upload = require('../middleware/upload');

router.get('/', ctrl.listar);
router.get('/nuevo', ctrl.formNuevo);
router.post('/', upload.single('imagen'), ctrl.crear);
router.get('/:id/editar', ctrl.formEditar);
router.put('/:id', upload.single('imagen'), ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;

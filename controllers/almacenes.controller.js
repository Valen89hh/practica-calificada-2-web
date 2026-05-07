const pool = require('../config/db');

exports.listar = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM almacenes ORDER BY id_almacen ASC'
        );
        res.render('almacenes/index', {
            title: 'Almacenes',
            almacenes: rows,
            mensaje: req.query.mensaje || null
        });
    } catch (err) {
        next(err);
    }
};

exports.formNuevo = (req, res) => {
    res.render('almacenes/form', {
        title: 'Nuevo Almacen',
        almacen: { id_almacen: '', nombre: '' },
        accion: '/almacenes',
        metodo: 'POST',
        error: null
    });
};

exports.crear = async (req, res, next) => {
    try {
        const nombre = (req.body.nombre || '').trim();
        if (!nombre) {
            return res.status(400).render('almacenes/form', {
                title: 'Nuevo Almacen',
                almacen: { id_almacen: '', nombre },
                accion: '/almacenes',
                metodo: 'POST',
                error: 'El nombre es obligatorio.'
            });
        }
        await pool.query(
            'INSERT INTO almacenes (nombre) VALUES ($1)',
            [nombre]
        );
        res.redirect('/almacenes?mensaje=Almacen creado correctamente');
    } catch (err) {
        next(err);
    }
};

exports.formEditar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(
            'SELECT * FROM almacenes WHERE id_almacen = $1',
            [id]
        );
        if (rows.length === 0) {
            return res.redirect('/almacenes?mensaje=Almacen no encontrado');
        }
        res.render('almacenes/form', {
            title: 'Editar Almacen',
            almacen: rows[0],
            accion: `/almacenes/${id}?_method=PUT`,
            metodo: 'POST',
            error: null
        });
    } catch (err) {
        next(err);
    }
};

exports.actualizar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const nombre = (req.body.nombre || '').trim();
        if (!nombre) {
            return res.status(400).render('almacenes/form', {
                title: 'Editar Almacen',
                almacen: { id_almacen: id, nombre },
                accion: `/almacenes/${id}?_method=PUT`,
                metodo: 'POST',
                error: 'El nombre es obligatorio.'
            });
        }
        await pool.query(
            'UPDATE almacenes SET nombre = $1 WHERE id_almacen = $2',
            [nombre, id]
        );
        res.redirect('/almacenes?mensaje=Almacen actualizado correctamente');
    } catch (err) {
        next(err);
    }
};

exports.eliminar = async (req, res, next) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM almacenes WHERE id_almacen = $1', [id]);
        res.redirect('/almacenes?mensaje=Almacen eliminado correctamente');
    } catch (err) {
        next(err);
    }
};

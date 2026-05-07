const pool = require('../config/db');
const cloudinary = require('../config/cloudinary');

// Listar productos con el nombre de su almacen (JOIN)
exports.listar = async (req, res, next) => {
    try {
        const { rows } = await pool.query(`
            SELECT p.id_producto,
                   p.nombre,
                   p.imagen,
                   p.id_almacen,
                   a.nombre AS almacen_nombre
            FROM productos p
            INNER JOIN almacenes a ON a.id_almacen = p.id_almacen
            ORDER BY p.id_producto ASC
        `);
        res.render('productos/index', {
            title: 'Productos',
            productos: rows,
            mensaje: req.query.mensaje || null
        });
    } catch (err) {
        next(err);
    }
};

exports.formNuevo = async (req, res, next) => {
    try {
        const { rows: almacenes } = await pool.query(
            'SELECT id_almacen, nombre FROM almacenes ORDER BY nombre ASC'
        );
        res.render('productos/form', {
            title: 'Nuevo Producto',
            producto: { id_producto: '', nombre: '', imagen: '', id_almacen: '' },
            almacenes,
            accion: '/productos',
            metodo: 'POST',
            error: null
        });
    } catch (err) {
        next(err);
    }
};

exports.crear = async (req, res, next) => {
    try {
        const nombre = (req.body.nombre || '').trim();
        const id_almacen = req.body.id_almacen;
        const imagen = req.file ? req.file.path : null;

        if (!nombre || !id_almacen) {
            const { rows: almacenes } = await pool.query(
                'SELECT id_almacen, nombre FROM almacenes ORDER BY nombre ASC'
            );
            return res.status(400).render('productos/form', {
                title: 'Nuevo Producto',
                producto: { id_producto: '', nombre, imagen, id_almacen },
                almacenes,
                accion: '/productos',
                metodo: 'POST',
                error: 'El nombre y el almacen son obligatorios.'
            });
        }

        await pool.query(
            'INSERT INTO productos (nombre, imagen, id_almacen) VALUES ($1, $2, $3)',
            [nombre, imagen, id_almacen]
        );
        res.redirect('/productos?mensaje=Producto creado correctamente');
    } catch (err) {
        next(err);
    }
};

exports.formEditar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [{ rows: productos }, { rows: almacenes }] = await Promise.all([
            pool.query('SELECT * FROM productos WHERE id_producto = $1', [id]),
            pool.query('SELECT id_almacen, nombre FROM almacenes ORDER BY nombre ASC')
        ]);
        if (productos.length === 0) {
            return res.redirect('/productos?mensaje=Producto no encontrado');
        }
        res.render('productos/form', {
            title: 'Editar Producto',
            producto: productos[0],
            almacenes,
            accion: `/productos/${id}?_method=PUT`,
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
        const id_almacen = req.body.id_almacen;
        const nuevaImagen = req.file ? req.file.path : null;

        if (!nombre || !id_almacen) {
            const { rows: almacenes } = await pool.query(
                'SELECT id_almacen, nombre FROM almacenes ORDER BY nombre ASC'
            );
            return res.status(400).render('productos/form', {
                title: 'Editar Producto',
                producto: { id_producto: id, nombre, imagen: nuevaImagen, id_almacen },
                almacenes,
                accion: `/productos/${id}?_method=PUT`,
                metodo: 'POST',
                error: 'El nombre y el almacen son obligatorios.'
            });
        }

        if (nuevaImagen) {
            // Borrar la imagen anterior de Cloudinary si existia
            const { rows } = await pool.query(
                'SELECT imagen FROM productos WHERE id_producto = $1',
                [id]
            );
            const anterior = rows[0]?.imagen;
            if (anterior) {
                try {
                    const publicId = extraerPublicId(anterior);
                    if (publicId) await cloudinary.uploader.destroy(publicId);
                } catch (e) {
                    console.warn('No se pudo borrar la imagen anterior:', e.message);
                }
            }
            await pool.query(
                'UPDATE productos SET nombre = $1, imagen = $2, id_almacen = $3 WHERE id_producto = $4',
                [nombre, nuevaImagen, id_almacen, id]
            );
        } else {
            await pool.query(
                'UPDATE productos SET nombre = $1, id_almacen = $2 WHERE id_producto = $3',
                [nombre, id_almacen, id]
            );
        }

        res.redirect('/productos?mensaje=Producto actualizado correctamente');
    } catch (err) {
        next(err);
    }
};

exports.eliminar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(
            'SELECT imagen FROM productos WHERE id_producto = $1',
            [id]
        );
        const imagen = rows[0]?.imagen;
        await pool.query('DELETE FROM productos WHERE id_producto = $1', [id]);
        if (imagen) {
            try {
                const publicId = extraerPublicId(imagen);
                if (publicId) await cloudinary.uploader.destroy(publicId);
            } catch (e) {
                console.warn('No se pudo borrar la imagen de Cloudinary:', e.message);
            }
        }
        res.redirect('/productos?mensaje=Producto eliminado correctamente');
    } catch (err) {
        next(err);
    }
};

// Extrae el public_id de una URL de Cloudinary para poder eliminar el archivo
function extraerPublicId(url) {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
    return match ? match[1] : null;
}

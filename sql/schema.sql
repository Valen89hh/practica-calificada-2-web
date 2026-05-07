-- Esquema de base de datos para el CRUD de Almacenes y Productos
-- Ejecutar este script una sola vez en la base de datos Postgres de Render

CREATE TABLE IF NOT EXISTS almacenes (
    id_almacen SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    imagen TEXT,
    id_almacen INTEGER NOT NULL REFERENCES almacenes(id_almacen) ON DELETE CASCADE
);

-- Datos de ejemplo
INSERT INTO almacenes (nombre) VALUES
    ('Almacen Central Lima'),
    ('Almacen Norte Trujillo'),
    ('Almacen Sur Arequipa')
ON CONFLICT DO NOTHING;

# Practica calificada 2 - CRUD de Almacenes y Productos

Aplicacion web hecha con Node.js y Express para gestionar almacenes y productos, con carga de imagenes y base de datos relacional.

Curso: Diseño de Aplicaciones Web Avanzado - TECSUP.

## Que hace

- Listar, crear, editar y eliminar almacenes.
- Listar, crear, editar y eliminar productos.
- Cada producto pertenece a un almacen (relacion 1 a N).
- Subir una imagen por producto.
- Si se elimina un almacen, sus productos tambien se eliminan (cascada).

## Tecnologias usadas

- Node.js + Express
- PostgreSQL (Render)
- EJS para las vistas + Bootstrap 5
- Multer + Cloudinary para las imagenes
- pg, dotenv, method-override

## Estructura

```
config/         conexion a BD y a Cloudinary
controllers/    logica de almacenes y productos
middleware/     subida de archivos con multer
routes/         rutas de almacenes y productos
views/          plantillas EJS
public/         CSS
sql/            script para crear las tablas
server.js       archivo principal
```

## Como correrlo en local

1. Clonar el repositorio e instalar dependencias:

```bash
git clone https://github.com/Valen89hh/practica-calificada-2-web.git
cd practica-calificada-2-web
npm install
```

2. Crear una base de datos PostgreSQL (puede ser en local, en Render o Neon) y ejecutar el script `sql/schema.sql` para crear las tablas.

3. Crear una cuenta gratis en https://cloudinary.com y copiar las credenciales del dashboard.

4. Crear un archivo `.env` (puedes copiar `.env.example`) con:

```
PORT=3000
DATABASE_URL=postgres://usuario:password@host:5432/nombre_db
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

5. Levantar el servidor:

```bash
npm run dev
```

Y abrir http://localhost:3000

## Despliegue en Render

1. Crear una base de datos PostgreSQL en Render (plan free) y ejecutar `sql/schema.sql`.
2. Subir el repo a GitHub.
3. En Render, crear un Web Service apuntando al repo:
   - Build command: `npm install`
   - Start command: `npm start`
4. Agregar las variables de entorno (`DATABASE_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
5. Crear el servicio y esperar el deploy.

Nota: el plan free duerme tras 15 minutos de inactividad, asi que la primera carga puede demorar unos 30 segundos.

## Tablas

```sql
almacenes (id_almacen, nombre)
productos (id_producto, nombre, imagen, id_almacen)
```

`productos.id_almacen` referencia a `almacenes.id_almacen` con `ON DELETE CASCADE`.

## Rutas principales

Almacenes: `/almacenes` (GET, POST), `/almacenes/nuevo`, `/almacenes/:id/editar`, `/almacenes/:id` (PUT, DELETE).

Productos: `/productos` (GET, POST), `/productos/nuevo`, `/productos/:id/editar`, `/productos/:id` (PUT, DELETE).

## Autor

Rodrigo Vasquez

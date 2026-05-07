# CRUD de Almacenes y Productos

Sistema CRUD desarrollado con **Express.js** y **PostgreSQL**, con carga de imagenes en **Cloudinary** y relacion entre dos tablas (almacenes y productos).

> Examen Semana 8 - Diseño de Aplicaciones Web Avanzado - TECSUP

---

## Funcionalidades

- CRUD completo de **Almacenes** (id_almacen, nombre)
- CRUD completo de **Productos** (id_producto, nombre, imagen, id_almacen)
- Relacion 1:N entre almacenes y productos (cada producto pertenece a un almacen)
- Carga de imagenes con **Multer + Cloudinary** (almacenamiento en la nube, persistente)
- Listado de productos mostrando el nombre del almacen asociado (JOIN SQL)
- Validacion de campos obligatorios en el backend
- Interfaz con **Bootstrap 5** + iconos
- Eliminacion en cascada de productos al borrar un almacen

---

## Stack tecnico

| Tecnologia | Uso |
|------------|-----|
| Express.js | Framework backend |
| PostgreSQL | Base de datos relacional |
| `pg` | Driver de Postgres para Node |
| EJS + express-ejs-layouts | Motor de vistas |
| Bootstrap 5 | Estilos |
| Multer | Middleware de subida de archivos |
| Cloudinary | Almacenamiento de imagenes en la nube |
| method-override | Soporte para PUT/DELETE en formularios HTML |
| dotenv | Variables de entorno |

---

## Estructura del proyecto

```
.
├── config/
│   ├── cloudinary.js       # Configuracion de Cloudinary
│   └── db.js               # Pool de conexion a Postgres
├── controllers/
│   ├── almacenes.controller.js
│   └── productos.controller.js
├── middleware/
│   └── upload.js           # Multer + CloudinaryStorage
├── public/
│   └── css/styles.css
├── routes/
│   ├── almacenes.routes.js
│   └── productos.routes.js
├── sql/
│   └── schema.sql          # Script para crear tablas
├── views/
│   ├── almacenes/ (index.ejs, form.ejs)
│   ├── productos/ (index.ejs, form.ejs)
│   ├── layout.ejs
│   ├── index.ejs
│   └── error.ejs
├── .env.example
├── package.json
└── server.js
```

---

## Instalacion local

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPO>
cd Semana8
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Crear cuenta en Cloudinary (gratis)
- Ve a https://cloudinary.com/users/register/free
- En el Dashboard veras: **Cloud Name**, **API Key**, **API Secret**

### 4. Crear base de datos Postgres
Puedes usar Postgres local o un servicio gratuito como [Neon](https://neon.tech) o [Supabase](https://supabase.com).

Ejecuta el script `sql/schema.sql` para crear las tablas.

### 5. Configurar variables de entorno
Copia `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

```env
PORT=3000
DATABASE_URL=postgres://usuario:password@host:5432/nombre_db
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 6. Levantar el servidor
```bash
npm run dev
```

Abre http://localhost:3000

---

## Despliegue en Render

### Paso 1: Crear base de datos Postgres en Render
1. Inicia sesion en https://render.com
2. Click en **New +** → **PostgreSQL**
3. Elige el plan **Free** y crea la base
4. Copia la **Internal Database URL** (la usaras como `DATABASE_URL`)
5. Conectate con un cliente (ej. pgAdmin, DBeaver, o `psql`) y ejecuta `sql/schema.sql`

### Paso 2: Subir el repo a GitHub
```bash
git init
git add .
git commit -m "CRUD almacenes y productos"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### Paso 3: Crear el Web Service en Render
1. Click en **New +** → **Web Service**
2. Conecta tu repo de GitHub
3. Configuracion:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
4. En **Environment Variables**, agrega:
   - `DATABASE_URL` → la URL de tu base Postgres en Render
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
5. Click en **Create Web Service**

Render desplegara automaticamente y te dara una URL publica (ej. `https://tu-app.onrender.com`).

> **Nota:** El plan Free de Render duerme tras 15 min de inactividad. La primera peticion despues de dormir tarda ~30s.

---

## Validaciones implementadas

- **Almacenes:** el campo `nombre` es obligatorio.
- **Productos:** los campos `nombre` e `id_almacen` son obligatorios.
- **Imagen:** opcional, solo formatos `jpg/jpeg/png/gif/webp`, maximo 5 MB.
- **Eliminacion:** al borrar un almacen se eliminan en cascada sus productos.
- **Imagenes huerfanas:** al actualizar o eliminar un producto, la imagen anterior se borra de Cloudinary.

---

## Rutas del sistema

### Almacenes
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/almacenes` | Listar |
| GET | `/almacenes/nuevo` | Formulario nuevo |
| POST | `/almacenes` | Crear |
| GET | `/almacenes/:id/editar` | Formulario editar |
| PUT | `/almacenes/:id` | Actualizar |
| DELETE | `/almacenes/:id` | Eliminar |

### Productos
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/productos` | Listar (con JOIN al almacen) |
| GET | `/productos/nuevo` | Formulario nuevo |
| POST | `/productos` | Crear (con upload de imagen) |
| GET | `/productos/:id/editar` | Formulario editar |
| PUT | `/productos/:id` | Actualizar (con upload opcional) |
| DELETE | `/productos/:id` | Eliminar |

---

## Autor

Rodrigo Vasquez - TECSUP - 2026

# CLAUDE.md

Contexto del proyecto para continuar el trabajo en sesiones futuras.

## Que es esto

**Examen Semana 8** del curso *Diseño de Aplicaciones Web Avanzado* (TECSUP, 5to ciclo).

Sistema CRUD de **Almacenes** y **Productos** con relacion 1:N y carga de imagenes.

### Requisitos del examen (rubrica)

| Item | Puntos |
|---|---|
| CRUD funcional de ambas tablas | 6 |
| Relacion entre tablas | 4 |
| Carga de imagen funcional | 3 |
| Despliegue en hosting | 4 |
| Codigo estructurado + README | 3 |
| **Total** | **20** |

**Entregables:** codigo fuente + repo en GitHub + URL desplegada + video de maximo 5 minutos explicando.

**Tablas requeridas:**
- `almacenes` (id_almacen, nombre)
- `productos` (id_producto, nombre, imagen, id_almacen)

> Nota: el enunciado original mencionaba MySQL, pero se decidio usar **Postgres** para facilitar el despliegue. La rubrica habla solo de "base de datos relacional con relacion entre tablas", asi que es valido.

## Decisiones tecnicas

- **Postgres** en vez de MySQL → Render ofrece Postgres gratis, MySQL no.
- **Render** como hosting → Express corre nativo (Vercel obligaria a serverless y complica multer).
- **Cloudinary** para imagenes → el disco de Render free es efimero, las imagenes se perderian al redeploy. Cloudinary tiene free tier generoso y persiste.
- **EJS + Bootstrap 5** → simple, sin build step, suficiente para la rubrica.
- **cloudinary v1.x** (no v2) → `multer-storage-cloudinary@4` aun requiere peer dep v1.

## Stack

Express + pg + EJS + express-ejs-layouts + Multer + multer-storage-cloudinary + cloudinary + method-override + dotenv.

## Estado actual

✅ **Hecho:**
- Estructura MVC completa (config, controllers, routes, middleware, views)
- CRUD de almacenes y productos funcionando (con validacion backend)
- Relacion JOIN mostrando nombre del almacen en lista de productos
- Upload de imagenes a Cloudinary (con borrado de imagen anterior al editar/eliminar)
- UI con Bootstrap 5 e iconos
- README con instrucciones de despliegue
- `sql/schema.sql` con datos de ejemplo
- `npm install` corre sin errores, sintaxis verificada

⏳ **Pendiente (lo hace el usuario):**
1. Crear cuenta en Cloudinary → llenar `CLOUDINARY_*` en `.env`
2. Crear Postgres en Render → ejecutar `sql/schema.sql`
3. Crear `.env` local desde `.env.example` y probar con `npm run dev`
4. Subir repo a GitHub
5. Crear Web Service en Render conectado al repo, agregar las 4 env vars
6. Grabar video de 5 min explicando el funcionamiento

## Estructura de archivos

```
server.js                          # bootstrap Express
config/
  db.js                            # pool Postgres con SSL para Render
  cloudinary.js                    # cliente Cloudinary
middleware/
  upload.js                        # multer + CloudinaryStorage (5MB max)
controllers/
  almacenes.controller.js          # CRUD almacenes
  productos.controller.js          # CRUD productos + JOIN + borrado imagenes
routes/
  almacenes.routes.js
  productos.routes.js
views/
  layout.ejs                       # layout principal con navbar
  index.ejs                        # home
  error.ejs                        # 404 / 500
  almacenes/{index,form}.ejs
  productos/{index,form}.ejs
public/css/styles.css
sql/schema.sql                     # CREATE TABLE + seeds
.env.example                       # plantilla de variables
README.md                          # instrucciones detalladas de despliegue
```

## Variables de entorno necesarias

```
PORT=3000
DATABASE_URL=postgres://user:pass@host:5432/db
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Comandos utiles

```bash
npm install           # instalar deps
npm run dev           # nodemon en local
npm start             # produccion (lo que corre Render)
node -c server.js     # verificar sintaxis sin ejecutar
```

## Puntos a tener en cuenta

- El plan free de Render duerme tras 15 min de inactividad → primera peticion despues tarda ~30s. Mencionarlo en el video.
- `extraerPublicId()` en `productos.controller.js` parsea la URL de Cloudinary para borrar imagenes huerfanas. Si Cloudinary cambia el formato de URL en el futuro, ajustar el regex.
- `ON DELETE CASCADE` en `productos.id_almacen` borra los productos cuando se elimina su almacen. Esto es deseable para la rubrica, no es un bug.
- Multer 1.x tiene avisos de seguridad pero `multer-storage-cloudinary` aun no es compatible con Multer 2.x. Para un examen academico no es bloqueante.

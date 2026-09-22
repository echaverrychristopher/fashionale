# Fashion Ale — Tienda con panel de administrador

Catálogo de ropa de mujer con panel privado para subir productos y botón de
WhatsApp para que las clientas reserven directo.

## Cómo desplegar en Vercel (5 minutos)

1. **Sube este proyecto a GitHub** (crea un repo nuevo y sube todos estos archivos).
2. Entra a [vercel.com](https://vercel.com), inicia sesión y elige **Add New → Project**.
3. Selecciona tu repositorio. Vercel detecta Next.js automáticamente — dale a **Deploy**.
4. Cuando termine el primer deploy, ve a **Settings → Environment Variables** y agrega:
   - `ADMIN_PASSWORD` → la contraseña que quieras usar para entrar a `/admin`.
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` → tu número con código de país, sin `+` ni espacios (ej. `50588888888`).
5. Para que las fotos que subas desde el panel **no se borren**, activa el
   almacenamiento gratuito de Vercel:
   - En tu proyecto, ve a la pestaña **Storage → Create Database → Blob**.
   - Créalo y conéctalo al proyecto (Vercel agrega la variable
     `BLOB_READ_WRITE_TOKEN` automáticamente).
6. Ve a **Deployments** y dale **Redeploy** para que tome las variables nuevas.
7. Listo — tu sitio queda en una URL tipo `tu-proyecto.vercel.app`.

## Cómo usarla

- **Tienda pública:** `tu-sitio.vercel.app` — muestra el catálogo.
- **Panel de administrador:** `tu-sitio.vercel.app/admin` — inicia sesión con
  la contraseña que pusiste en `ADMIN_PASSWORD`. Desde ahí puedes:
  - Agregar productos (foto, nombre, precio, categoría, descripción).
  - Marcar un producto como reservado/disponible.
  - Editar o eliminar productos.
- Cada producto tiene un botón **"Reservar por WhatsApp"** que abre un chat
  con un mensaje ya escrito mencionando esa prenda.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # y edita la contraseña y el número de WhatsApp
npm run dev
```

Sin `BLOB_READ_WRITE_TOKEN`, los productos se guardan en un archivo local
(`data/products.json`) — perfecto para probar, pero en Vercel siempre conecta
Blob Storage (paso 5) para que los datos no se pierdan entre despliegues.

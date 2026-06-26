# Analytics Dashboard — AguaYa

Dashboard de métricas consolidadas del ecosistema **AguaYa**. Consume las APIs de las apps del sistema (Seller, Feedback, etc.) para ofrecer una visión unificada del negocio.

**Deploy:** https://etapa-3-analytics-dashboard-agua-ya.vercel.app/

## Acceso

| Rol | Credenciales |
|---|---|
| **Analyst** | Iniciar sesión con Google. El usuario debe tener el rol `analyst` en Clerk (publicMetadata). |

> Para desarrollo, el role check puede descomentarse temporalmente en `src/lib/auth-utils.ts`.

## Stack

`Next.js 16` · `React 19` · `TypeScript` · `Tailwind v4` · `Clerk` · `Recharts`

## Scripts

```bash
npm install   # Instalar dependencias
npm run dev   # Servidor de desarrollo
npm run build # Build de producción
```

# ⚡ Desktop App Core (Plantilla Electron)

Una plantilla moderna y lista para producción para construir aplicaciones de escritorio multiplataforma utilizando **Electron**, **React** y **TypeScript**.

Este template viene pre-configurado con un sistema de UI personalizado (Shadcn/UI + Tailwind v4), una Barra de Título personalizada (Custom TitleBar) y las herramientas de desarrollo esenciales ya instaladas.

## 🚀 Tecnologías (Tech Stack)

- **Motor:** Electron v39+
- **Frontend:** React v19 + TypeScript
- **Construcción:** Electron-Vite (HMR Rápido)
- **Estilos:** Tailwind CSS **v4** + Shadcn/UI
- **Navegación:** React Router DOM (HashRouter)
- **Formularios:** React Hook Form + Zod (Pre-configurado)
- **Iconos:** Lucide React
- **Notificaciones:** Sonner
- **Base de Datos:** Preparado para `better-sqlite3`

## ✨ Características Clave

- **🎨 Barra de Título Personalizada:** Se eliminó el marco nativo de Windows. Incluye una barra totalmente funcional (minimizar, maximizar, cerrar) e integrada con el tema.
- **🌗 Sistema de Temas:** Variables CSS mapeadas a Tailwind v4. Cambia los colores en un solo archivo (`main.css`) y toda la app se actualiza.
- **📱 Layout Profesional:** Estructura lista con `Sidebar` fijo + Área de Contenido con Scroll independiente.
- **🤖 Preparado para IA:** Incluye el archivo `AI_CONTEXT.md` para ayudar a las IAs (ChatGPT, Claude, Gemini) a entender la estructura del proyecto al instante.
- **🔒 Bridge Seguro:** Aislamiento de contexto (Context Isolation) activado. Comunicación segura entre Main y Renderer vía `window.api`.

## 🛠️ Primeros Pasos

### 1. Clonar e Instalar

```bash
# Clonar el repositorio
git clone [https://github.com/tu-usuario/desktop-app-core.git](https://github.com/tu-usuario/desktop-app-core.git) mi-nueva-app

# Entrar en la carpeta
cd mi-nueva-app

# Instalar dependencias
npm install
```

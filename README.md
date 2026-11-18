# ServiTec – Gestión de solicitudes de servicio técnico

Aplicación web para registrar y administrar reparaciones de celulares.

## Tecnologías
- Frontend: React + Vite.
- Backend: Node.js + Express.
- Persistencia: archivo JSON local (`backend/data/requests.json`).
- Comunicación: API REST con JSON.

## Arquitectura Hexagonal
- **Dominio (`backend/src/domain`)**: entidad `ServiceRequest`.
- **Aplicación (`backend/src/application`)**: casos de uso y puerto abstracto `ServiceRequestRepository`.
- **Infraestructura (`backend/src/infrastructure`)**: adaptador de persistencia basado en archivo JSON.
- **Adaptadores (`backend/src/adapters/http`)**: adaptador de entrada HTTP que expone la API REST.
- **Frontend (`frontend/src`)**: interfaz React que consume la API.

El caso de uso depende del contrato del repositorio y no de la tecnología de almacenamiento. El adaptador JSON implementa ese contrato. Esto permite cambiar la persistencia por SQLite o una base de datos sin reescribir las reglas del negocio.

## Principios SOLID
- **S – Responsabilidad única**: cada clase/módulo tiene una responsabilidad concreta.
- **O – Abierto/cerrado**: se puede incorporar otro adaptador de persistencia sin cambiar los casos de uso.
- **L – Sustitución de Liskov**: cualquier implementación compatible con el puerto puede sustituir al repositorio JSON.
- **I – Segregación de interfaces**: el contrato expone operaciones específicas de solicitudes.
- **D – Inversión de dependencias**: `ServiceRequestUseCases` recibe el repositorio por constructor y depende de una abstracción.

## Código limpio y refactorización
Se usan nombres descriptivos, responsabilidades separadas, validaciones en los casos de uso, inyección de dependencias y consultas HTTP separadas de las reglas del negocio. La estructura facilita modificar y probar cada parte de forma independiente.

## Funcionalidades
- Registrar una solicitud.
- Consultar todas las solicitudes.
- Cambiar el estado: Pendiente, En reparación o Entregado.
- Eliminar solicitudes.
- Ver contadores por estado.

## Requisitos
Node.js 18 o superior y npm.

## Ejecución
En la carpeta raíz del proyecto, abrir una terminal y ejecutar:

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173` en el navegador. El backend se ejecuta en `http://localhost:5000`.

Los registros se guardan automáticamente en `backend/data/requests.json`.

## Endpoints
- `GET /api/health`: verificar el backend.
- `GET /api/requests`: listar solicitudes.
- `POST /api/requests`: crear solicitud.
- `PATCH /api/requests/:id`: cambiar estado.
- `DELETE /api/requests/:id`: eliminar solicitud.

## Publicación
Crear un repositorio público en GitHub llamado `servitec-arquitectura-hexagonal` y subir todos los archivos de este proyecto.

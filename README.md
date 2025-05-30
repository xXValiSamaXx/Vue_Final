# 📚 Sistema de Gestión de Biblioteca con Vue

## 🚀 Inicio Rápido

Si ya tienes Vue y JSON Server instalados, simplemente ejecuta:

```bash
npm install
npm run dev
```

## 📋 Instalación Completa (Primera vez)

### Configuración del proyecto
```bash
npm install
```

### Instalar Vue (si no está instalado)
```bash
npm install vue
```

### Instalar Vuetify
```bash
vue add vuetify
```

### Instalar vuelidate
```bash
npm install vuelidate --save
```

### Instalar JSON Server (si no está instalado globalmente)
```bash
npm install -g json-server
```

## 🏃‍♂️ Comandos de Ejecución

### Compilar y ejecutar en desarrollo (solo Vue)
```bash
npm run serve
```

### Ejecutar JSON Server (solo API)
```bash
json-server --watch db.json --port 5000
```

### Ejecutar Todo el Sistema (Vue + JSON Server)
```bash
npm run dev
```

## 📖 Acerca del Proyecto

Sistema completo de gestión de biblioteca desarrollado con **Vue.js**, **Vuex**, **JSON Server** y **Vuetify**. Incluye manejo de libros, usuarios y sistema de préstamos con proceso completo de 3 tablas relacionadas.

## 🛠️ Tecnologías Utilizadas

- **Vue.js 2.7** - Framework principal
- **Vuex** - Manejo de estado global
- **JSON Server** - API REST simulada
- **Vuetify** - Componentes UI Material Design
- **Vuelidate** - Validación de formularios
- **Axios** - Cliente HTTP

## 🎯 Funcionalidades del Sistema

### 📚 **Gestión de Libros**
- ✅ **Colección** - Visualizar todos los libros de la colección
- ✅ **Agregar Libro** - Agregar nuevos libros con validación completa
- ✅ **Eliminar Libro** - Eliminar libros de la colección
- ✅ **Libros Favoritos** - Marcar/desmarcar libros favoritos

### 🔄 **Sistema de Préstamos (Proceso de 3 Tablas)**
- ✅ **Crear Préstamo** - Asignar libro a usuario (actualiza libros, usuarios, préstamos)
- ✅ **Control de Multas** - Cálculo automático por retrasos
- ✅ **Devolución de Libros** - Proceso completo de retorno
- ✅ **Renovación** - Extender préstamos (máximo 2 renovaciones)
- ✅ **Préstamos Activos** - Vista en tiempo real
- ✅ **Préstamos Vencidos** - Control de multas y penalizaciones

## 🧩 Navegación y Componentes

### 🗂️ **Menú Principal**
- **Colección** - Todos los libros disponibles
- **Libros Favoritos** - Lista de libros marcados como favoritos
- **Préstamos** - ⭐ **NUEVO** Sistema completo de gestión
- **Agregar Libro** - Formulario para agregar libros
- **Eliminar Libro** - Eliminar libros de la colección

### 📖 **Página de Colección**
- Obtiene todos los libros desde JSON Server
- Muestra: Título, Autor, Portada del libro
- Opciones de favoritos dinámicas:
  - Si es favorito: opción "Remover de favoritos"
  - Si no es favorito: opción "Agregar a favoritos"
- Encabezado y menú de navegación

### ❤️ **Libros Favoritos**
- Lista todos los libros marcados como favoritos
- Mensaje por defecto si no hay libros en la lista

### ➕ **Agregar Libro**
- Validación con **Vuelidate**
- Formularios con 3 campos requeridos:
  - Título del libro
  - Autor del libro
  - URL de la portada
- Botón Enviar para agregar a la colección
- Mensaje de éxito al agregar
- Redirección automática a Colección
- Botón Limpiar para limpiar formulario

### 🗑️ **Eliminar Libro**
- Muestra todos los libros de la colección
- Cada libro tiene opción de eliminar
- Mensaje de confirmación al eliminar

### 🆕 **Gestión de Préstamos** (Proceso de 3 Tablas)

#### ➕ **Crear Préstamo**
- Selección de usuario activo
- Selección de libro disponible
- Creación automática de registro de préstamo
- Actualización de disponibilidad del libro

#### 📊 **Préstamos Activos**
- Vista completa con datos de las 3 tablas:
  - Información del libro (título, autor, portada)
  - Datos del usuario (nombre, email)
  - Detalles del préstamo (fechas, renovaciones)
- Indicadores visuales de fechas de vencimiento
- Opciones de devolver y renovar

#### ⚠️ **Control de Multas**
- Cálculo automático de multas por retraso
- $10 MXN por día de retraso
- Actualización de estatus a "vencido"
- Vista especial para préstamos con multa

#### 🔄 **Funciones Avanzadas**
- **Renovación**: Hasta 2 renovaciones por préstamo
- **Devolución con multa**: Proceso de pago de penalizaciones
- **Cálculo masivo**: Actualización automática de todas las multas

## 🎨 **Características de Interfaz**

- **Diseño Material** con Vuetify
- **Diseño Responsivo** - Compatible con móviles
- **Navegación lateral** con animaciones
- **Indicadores visuales** para fechas y estados
- **Tablas dinámicas** con ordenamiento y filtros
- **Diálogos de confirmación** para acciones importantes
- **Mensajes de éxito/error** informativos

## 🔧 **APIs y Puntos de Conexión**

El sistema utiliza JSON Server para simular una API REST completa:

```
GET    /books     - Obtener todos los libros
POST   /books     - Crear nuevo libro
PUT    /books/:id - Actualizar libro
DELETE /books/:id - Eliminar libro

GET    /users     - Obtener todos los usuarios
POST   /users     - Crear nuevo usuario

GET    /loans     - Obtener todos los préstamos
POST   /loans     - Crear nuevo préstamo
PATCH  /loans/:id - Actualizar préstamo
```

## 📁 **Estructura del Proyecto**

```
src/
├── components/
│   ├── bookStore/          # Gestión de libros
│   │   ├── BookStore.vue
│   │   ├── AddBook.vue
│   │   ├── DeleteBook.vue
│   │   └── Favourite.vue
│   ├── loans/              # Sistema de préstamos
│   │   └── LoanManagement.vue
│   └── common/             # Componentes compartidos
│       ├── Header.vue
│       └── Menu.vue
├── store/
│   ├── modules/
│   │   ├── books.js        # Estado de libros
│   │   └── loans.js        # Estado de préstamos (3 tablas)
│   └── store.js
└── routes.js               # Configuración de rutas
```

## 🎯 **Proceso Completo de 3 Tablas**

### Flujo del Sistema de Préstamos:

1. **Usuario solicita préstamo**
   - Consulta tabla `usuarios` (verificar usuario activo)
   - Consulta tabla `libros` (verificar disponibilidad)
   - Crea registro en tabla `préstamos`

2. **Sistema gestiona préstamo**
   - Actualiza `libros.disponible = false`
   - Registra fechas en `préstamos`
   - Relaciona `usuarios.id` con `libros.id`

3. **Control automático**
   - Calcula multas basado en `préstamos.fechaVencimiento`
   - Actualiza `préstamos.multa` y `préstamos.estatus`
   - Mantiene historial completo

4. **Proceso de devolución**
   - Actualiza `préstamos.fechaDevolucion` y `préstamos.estatus`
   - Cambia `libros.disponible = true`
   - Libera libro para nuevos préstamos

## 📝 **Notas del Proyecto**

- Sistema completo de biblioteca con proceso de 3 tablas relacionadas
- Implementa CRUD completo en todas las entidades
- Validaciones en frontend y simulación de API REST
- Interfaz moderna y responsiva
- Lógica de negocio para biblioteca real

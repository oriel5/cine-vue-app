# CineVue - Sistema de Gestión de Cartelera

> **Proyecto Final - Programación II (2026)**  
> **Docente:** Jose Olivera  
> **Autores:** Agustín Gabriel Almazán & Oriel Elias Cardoso

---

## Resumen Ejecutivo y Propósito

**CineVue** es una plataforma web digital y de gestión de contenidos diseñada para complejos cinematográficos. El sistema resuelve la administración integral de la cartelera y su proyección en tiempo real hacia los monitores públicos del cine, donde los espectadores pueden visualizar los estrenos vigentes y calificarlos al instante.

El proyecto separa de forma lógica la gestión interna de la visualización pública:

* **Panel Administrativo:** Permite al administrador autenticar su identidad para dar de alta películas y salas, ejecutar operaciones CRUD (crear, leer, actualizar y borrar funciones) sobre la grilla horaria, auditar la cartelera en vivo mediante una vista previa integrada y consultar estadísticas de audiencia.
* **Pantalla Pública:** Es una interfaz web rápida y ligera diseñada para funcionar de forma autónoma en los monitores del cine sin intervención manual. Muestra las funciones del día ordenadas por mejor puntuación, cuenta con un reloj interno que oculta automáticamente las funciones que ya comenzaron e incluye una encuesta interactiva táctil para que el público puntúe las películas de 1 a 5 estrellas.

---

## Arquitectura Tecnológica

El sistema prescinde de un servidor físico propio conectándose directamente a **Supabase** en la nube para gestionar la base de datos, autenticación y eventos en tiempo real. La aplicación se divide en los siguientes módulos:

| Módulo / Capa | Tecnología | Función Principal |
| :--- | :--- | :--- |
| **Panel de Administración** | Vue.js 3 + Vite | Gestiona toda la administración interna de forma reactiva y modular mediante componentes independientes (Login, CRUD, Estadísticas e Historial). |
| **Pantalla Pública** | HTML5, CSS3 y JavaScript | Interfaz ligera sin librerías pesadas, optimizada para correr de forma continua en los monitores del cine sin degradar el rendimiento. |
| **Estilos Visuales** | CSS Independiente | Todo el diseño oscuro y la identidad visual están centralizados en `admin-styles.css` para mantener el código limpio y escalable. |
| **Base de Datos y Backend** | Supabase (PostgreSQL) | Almacena los datos de forma relacional, valida el acceso del administrador y sincroniza los cambios en vivo con las pantallas públicas. |

---

## Estructura de la Base de Datos (Supabase)

La base de datos está normalizada y organizada en **5 tablas principales** conectadas entre sí para garantizar la integridad referencial y evitar la redundancia de datos:

1. **`peliculas`**: Catálogo general del cine (`id`, `titulo`, `poster_url`, `genero`, `descripcion`, `fecha_estreno`).
2. **`salas`**: Espacios físicos disponibles (`id`, `nombre`, `capacidad`).
3. **`funciones`**: Relaciona una película con una sala y un horario (`id`, `pelicula_id`, `sala_id`, `horario`, `idioma`).
4. **`puntuaciones`**: Registra cada voto de 1 a 5 estrellas emitido por los espectadores (`id`, `pelicula_id`, `estrellas`, `creado_en`).
5. **`vistas_peliculas`**: Contabiliza cada confirmación de visualización para nutrir las estadísticas (`id`, `pelicula_id`, `fecha_vista`).

### Vistas Automáticas (SQL Views)
Para optimizar el rendimiento y delegar los cálculos matemáticos al motor de base de datos, se implementaron dos vistas automáticas:

* **`ranking_ciclo_vida_peliculas`**: Contabiliza las visualizaciones de cada película exclusivamente durante su ciclo activo de 3 semanas (21 días) desde su fecha de estreno.
* **`historial_peliculas_retiradas`**: Filtra automáticamente las películas que superaron los 21 días en cartelera, calcula su promedio final de estrellas y las ordena de mayor a menor calificación.

> *Nota: Si subes la captura del diagrama entidad-relación (por ejemplo en `docs/db-schema.png`), puedes enlazarla aquí usando `![Diagrama BD](docs/db-schema.png)`.*

---

## Organización del Proyecto

```text
CineVue/
├── index.html                        # Punto de entrada principal de la aplicación
├── package.json                      # Dependencias y scripts del proyecto
├── vite.config.js                    # Configuración del entorno de desarrollo Vite
├── public/
│   └── cartelera.html                # Pantalla pública independiente para monitores
└── src/
    ├── main.js                       # Arranque de Vue y carga de estilos globales
    ├── supabaseClient.js             # Configuración y credenciales de conexión a Supabase
    ├── App.vue                       # Controlador principal de sesión y rutas
    ├── assets/
    │   └── admin-styles.css          # Hoja de estilos unificada (modo oscuro)
    └── components/
        ├── Login.vue                 # Formulario de autenticación del administrador
        ├── PanelCartelera.vue        # Dashboard principal y acceso a vista previa
        ├── CrearPeliculaSalas.vue    # Alta de nuevas películas y salas
        ├── CarteleraCrear.vue        # Formulario para programar funciones (Create)
        ├── CarteleraLista.vue        # Listado y eliminación de funciones (Read / Delete)
        ├── CarteleraActualizar.vue   # Edición de funciones programadas (Update)
        ├── VistaCarteleraAdmin.vue   # Vista previa integrada con encuesta interactiva
        ├── EstadisticasAdmin.vue     # Métricas de películas más y menos vistas
        └── HistorialRetiradas.vue    # Archivo histórico ordenado por calificación
```

---

## Funcionamiento Principal

* **Seguridad de Acceso:** Al ingresar al sistema se valida el estado de la sesión. Si no hay un administrador autenticado, se bloquea el acceso al panel y se redirige al formulario de Login. Dentro del panel, el botón *"Ver Cartelera en Vivo"* permite auditar la pantalla pública sin cerrar la sesión.
* **Actualización en Tiempo Real (Realtime):** Cualquier alta, modificación o baja de funciones realizada desde el panel administrativo se refleja automáticamente en todas las pantallas públicas conectadas sin necesidad de recargar el navegador.
* **Limpieza Automática por Horario:** Un temporizador interno verifica la hora cada minuto en la cartelera pública; si el horario de una función ya pasó, su tarjeta se oculta automáticamente.
* **Ordenamiento por Calidad y Encuesta:** Las películas se ordenan dinámicamente priorizando aquellas con mejor promedio de calificación. Cada tarjeta incluye una interacción rápida (*"¿Viste la película?"*):
  * Al seleccionar **"Sí, la vi"**, se registra una nueva visualización en las estadísticas y se despliega el selector de 1 a 5 estrellas.
  * Al seleccionar **"Todavía no"**, se muestra un mensaje incentivando al espectador a disfrutarla.

---

## Instalación y Ejecución Local

Sigue estos pasos para levantar el proyecto en tu entorno local:

### 1. Preparar la Base de Datos
1. Crea un proyecto en [Supabase](https://supabase.com/).
2. Ejecuta el script SQL correspondiente en el **SQL Editor** para generar las 5 tablas y las 2 vistas automáticas.
3. Activa la opción **Realtime** en la tabla `funciones`.

### 2. Configurar las Credenciales
Abre el archivo `src/supabaseClient.js` y reemplaza los valores con la **URL** y la **Anon Key** pública de tu proyecto de Supabase.

### 3. Instalar Dependencias y Ejecutar
Si descargaste el proyecto comprimido (`.zip`), descomprímelo y abre la carpeta raíz en **Visual Studio Code**. Luego, abre la terminal integrada y ejecuta:

```bash
# Instalar las dependencias del proyecto
npm install

# Iniciar el servidor de desarrollo local
npm run dev
```

### 4. Acceder al Sistema
Una vez iniciado el servidor, abre tu navegador e ingresa a la URL local asignada (por defecto `http://localhost:5173/`) para iniciar sesión en el panel de administración.
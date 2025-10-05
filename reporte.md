# Informe de Desarrollo: Aplicación del Clima

Este documento detalla el proceso de desarrollo de una aplicación web para consultar el clima, creada como parte de la actividad académica.

## 1. Explicación del Código JavaScript (`script.js`)

El archivo `script.js` contiene toda la lógica de la aplicación. A continuación, se explican sus partes principales:

- **Evento `DOMContentLoaded`**: Para asegurar que el script no se ejecute hasta que toda la página esté cargada, todo el código está dentro de este evento.
  ```javascript
  document.addEventListener('DOMContentLoaded', () => {
      // ... todo el código ...
  });
  ```

- **Selección de Elementos del DOM**: Se guardan en constantes las referencias a los elementos HTML que se van a manipular, como el campo de texto, el botón y los lugares donde se mostrará la información.
  ```javascript
  const campoCiudad = document.getElementById('city-input');
  const botonBusqueda = document.getElementById('search-btn');
  // ... otros elementos ...
  ```

- **Manejadores de Eventos**:
  - Se añade un evento `click` al botón para que, al presionarlo, se llame a la función `realizarBusqueda`.
  - Se añade un evento `keyup` al campo de texto para que la búsqueda también se active al presionar la tecla "Enter".

- **Función `realizarBusqueda()`**: Esta función toma el valor del campo de texto, y si no está vacío, llama a la función `obtenerClima`.

- **Función Asíncrona `obtenerClima(ciudad)`**: Esta es la función más importante. Es `async` porque necesita esperar las respuestas de las APIs sin bloquear la página.
  - **Estado de Carga**: Al iniciar, deshabilita el botón de búsqueda y cambia su texto a "Buscando..." para informar al usuario que algo está pasando.
  - **Bloque `try...catch...finally`**: Se usa para manejar posibles errores. El código dentro de `try` se ejecuta, y si algo falla, se ejecuta el `catch`. El bloque `finally` se ejecuta siempre al final, para volver a habilitar el botón.

- **Funciones de Visualización**:
  - `mostrarClimaActual(datos, nombreCiudad)`: Pinta en la pantalla los datos del clima del día.
  - `mostrarDetallesClima(datos)`: Muestra información adicional como el viento y la precipitación.
  - `mostrarPronosticoDiario(datos)`: Crea y muestra el pronóstico para los siguientes días.
  - `obtenerIconoClima(codigo)`: Devuelve un icono diferente según el código de clima que envía la API.

## 2. Explicación de la Consulta a la API

La aplicación usa la **API de Open-Meteo**. El proceso es el siguiente:

1.  **Geocodificación**: Se envía el nombre de la ciudad a la API de Geocodificación para obtener su latitud y longitud.
2.  **Pronóstico del Clima**: Con las coordenadas, se hace una segunda llamada a la API de Pronóstico para obtener los datos del clima de esa ubicación.

Ambas consultas se hacen con `fetch`, que es la forma moderna en JavaScript para hacer peticiones a servidores.

## 3. Explicación del Proceso de Despliegue

La aplicación se desplegó usando **GitHub Pages**:

1.  Se creó un repositorio en GitHub.
2.  Se usaron los comandos de Git (`git init`, `git add`, `git commit`, `git push`) para subir los archivos del proyecto al repositorio.
3.  En la configuración del repositorio, en la sección "Pages", se seleccionó la rama `master` para que se publicara el contenido.

## 4. Dirección URL del Despliegue

La aplicación está disponible en la siguiente URL:

[https://andruv10.github.io/aplicacion-web/](https://andruv10.github.io/aplicacion-web/)

## 5. Enlace del Código Fuente

El código fuente completo está disponible en el siguiente repositorio de GitHub:

[https://github.com/andruv10/aplicacion-web](https://github.com/andruv10/aplicacion-web)

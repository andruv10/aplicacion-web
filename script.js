document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const campoCiudad = document.getElementById('city-input');
    const botonBusqueda = document.getElementById('search-btn');

    // Elementos para el clima actual
    const iconoClimaImg = document.getElementById('weather-icon-img');
    const valorTemperatura = document.getElementById('temp-value');
    const nombreCiudadEl = document.getElementById('city-name');
    const fechaEl = document.getElementById('date');
    const horaEl = document.getElementById('time');

    // Elementos para los detalles del clima
    const sensacionTermica = document.getElementById('feels-like');
    const humedad = document.getElementById('humidity');
    const velocidadViento = document.getElementById('wind-speed');
    const precipitacion = document.getElementById('precipitation');

    // Contenedor para el pronóstico diario
    const contenedorPronostico = document.getElementById('forecast-container');

    // Evento de clic en el botón de búsqueda
    botonBusqueda.addEventListener('click', () => {
        const nombreCiudad = campoCiudad.value.trim();
        if (nombreCiudad) {
            obtenerClima(nombreCiudad);
        } else {
            alert('Por favor, introduce el nombre de una ciudad.');
        }
    });

    // Función asíncrona para obtener los datos del clima
    async function obtenerClima(ciudad) {
        console.log('Buscando clima para:', ciudad);
        const urlApiGeocodificacion = `https://geocoding-api.open-meteo.com/v1/search?name=${ciudad}&count=1&language=es&format=json`;

        try {
            // Primero, obtenemos las coordenadas de la ciudad
            const respuestaGeo = await fetch(urlApiGeocodificacion);
            const datosGeo = await respuestaGeo.json();
            console.log('Respuesta de la API de geocodificación:', datosGeo);

            if (datosGeo.results && datosGeo.results.length > 0) {
                const { latitude, longitude, name } = datosGeo.results[0];
                
                // Luego, obtenemos el clima para esas coordenadas
                const urlApiClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
                
                const respuestaClima = await fetch(urlApiClima);
                const datosClima = await respuestaClima.json();
                console.log('Respuesta de la API del clima:', datosClima);

                mostrarClimaActual(datosClima, name);
                mostrarDetallesClima(datosClima);
                mostrarPronosticoDiario(datosClima);
            } else {
                alert('Ciudad no encontrada.');
            }
        } catch (error) {
            console.error('Error al obtener los datos del clima:', error);
            alert('No se pudieron obtener los datos del clima. Por favor, inténtalo de nuevo.');
        }
    }

    // Función para mostrar el clima actual
    function mostrarClimaActual(datos, nombreCiudad) {
        if (datos && datos.current_weather) {
            const { temperature, weathercode, time } = datos.current_weather;
            
            valorTemperatura.textContent = Math.round(temperature);
            nombreCiudadEl.textContent = nombreCiudad;
            iconoClimaImg.src = obtenerIconoClima(weathercode);

            const fechaActual = new Date(time);
            fechaEl.textContent = fechaActual.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' });
            horaEl.textContent = fechaActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        }
    }

    // Función para mostrar los detalles del clima
    function mostrarDetallesClima(datos) {
        if (datos && datos.current_weather) {
            const { windspeed } = datos.current_weather;
            const { temperature_2m_min, temperature_2m_max, precipitation_sum } = datos.daily;

            sensacionTermica.textContent = `${Math.round(temperature_2m_min[0])}°C / ${Math.round(temperature_2m_max[0])}°C`;
            humedad.textContent = `--%`; // La API no proporciona la humedad en esta respuesta
            velocidadViento.textContent = `${windspeed} km/h`;
            precipitacion.textContent = `${precipitation_sum[0]} mm`;
        }
    }

    // Función para mostrar el pronóstico diario
    function mostrarPronosticoDiario(datos) {
        if (datos && datos.daily) {
            contenedorPronostico.innerHTML = '';
            const { time, weathercode, temperature_2m_max, temperature_2m_min } = datos.daily;

            for (let i = 1; i < 6; i++) {
                const fecha = new Date(time[i]);
                const dia = fecha.toLocaleDateString('es-ES', { weekday: 'short' });

                const itemPronostico = `
                    <div class="forecast-item">
                        <div class="day">${dia}</div>
                        <img src="${obtenerIconoClima(weathercode[i])}" alt="Icono del Clima">
                        <div class="temp">${Math.round(temperature_2m_min[i])}°/${Math.round(temperature_2m_max[i])}°</div>
                    </div>
                `;
                contenedorPronostico.innerHTML += itemPronostico;
            }
        }
    }

    // Función para obtener el icono del clima según el código
    function obtenerIconoClima(codigo) {
        if (codigo >= 0 && codigo <= 1) return 'https://img.icons8.com/fluency/96/sun.png';
        if (codigo === 2) return 'https://img.icons8.com/fluency/96/partly-cloudy-day.png';
        if (codigo === 3) return 'https://img.icons8.com/fluency/96/cloud.png';
        if (codigo >= 45 && codigo <= 48) return 'https://img.icons8.com/fluency/96/fog-day.png';
        if (codigo >= 51 && codigo <= 67) return 'https://img.icons8.com/fluency/96/rain.png';
        if (codigo >= 71 && codigo <= 77) return 'https://img.icons8.com/fluency/96/snow.png';
        if (codigo >= 80 && codigo <= 82) return 'https://img.icons8.com/fluency/96/rain.png';
        if (codigo >= 85 && codigo <= 86) return 'https://img.icons8.com/fluency/96/snow.png';
        if (codigo >= 95 && codigo <= 99) return 'https://img.icons8.com/fluency/96/storm.png';
        return 'https://img.icons8.com/fluency/96/sun.png'; // Icono por defecto
    }
});

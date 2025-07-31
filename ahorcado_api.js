// Este archivo usa una API externa para obtener palabras aleatorias en español
// y permite elegir la cantidad de letras antes de comenzar el juego

let palabraSecreta = "";
let intentosRestantes = 6;
let palabraAdivinada = [];
let juegoIniciado = false;

async function obtenerPalabra(longitud) {
    // API: https://palabras-aleatorias-public-api.herokuapp.com/
    const url = `https://palabras-aleatorias-public-api.herokuapp.com/random?Length=${longitud}`;
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        // La API devuelve la palabra en data.body.Word
        return data.body.Word.toLowerCase();
    } catch (e) {
        // Fallback si la API falla
        const palabrasFallback = ["gato", "perro", "casa", "arbol", "raton", "camion", "escuela", "jardin"]; 
        return palabrasFallback.find(p => p.length === longitud) || "ahorcado";
    }
}

function crearTeclado() {
    const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ'.split('');
    const tecladoDiv = document.getElementById('teclado');
    tecladoDiv.innerHTML = '';
    letras.forEach(letra => {
        const btn = document.createElement('button');
        btn.textContent = letra;
        btn.className = 'tecla';
        btn.onclick = function() {
            if (!btn.disabled && juegoIniciado) {
                adivinarLetraTeclado(letra.toLowerCase());
                btn.disabled = true;
                btn.style.opacity = 0.5;
            }
        };
        btn.style.margin = '2px';
        btn.style.width = '36px';
        btn.style.height = '36px';
        btn.style.fontSize = '1em';
        btn.style.borderRadius = '6px';
        btn.style.border = '1px solid #b2bec3';
        btn.style.background = '#e3f0fa';
        btn.style.cursor = 'pointer';
        tecladoDiv.appendChild(btn);
    });
}

async function iniciarJuego() {
    const longitud = parseInt(document.getElementById("longitud").value);
    palabraSecreta = await obtenerPalabra(longitud);
    intentosRestantes = 6;
    palabraAdivinada = Array(palabraSecreta.length).fill("_");
    juegoIniciado = true;
    document.getElementById("mensaje").textContent = "";
    crearTeclado();
    actualizarPantalla();
}

function actualizarPantalla() {
    document.getElementById("palabra").textContent = palabraAdivinada.join(" ");
    document.getElementById("intentos").textContent = intentosRestantes;
}

function adivinarLetra() {
    if (!juegoIniciado) return;
    const letra = document.getElementById("letra").value.toLowerCase();
    document.getElementById("letra").value = "";
    document.getElementById("mensaje").textContent = "";
    if (letra.length !== 1 || !/^[a-záéíóúñ]$/i.test(letra)) {
        document.getElementById("mensaje").textContent = "Por favor, ingresa una sola letra válida.";
        return;
    }
    let acierto = false;
    for (let i = 0; i < palabraSecreta.length; i++) {
        if (palabraSecreta[i] === letra && palabraAdivinada[i] === "_") {
            palabraAdivinada[i] = letra;
            acierto = true;
        }
    }
    if (!acierto) intentosRestantes--;
    if (intentosRestantes === 0) {
        document.getElementById("mensaje").textContent = `¡Perdiste! La palabra era: ${palabraSecreta}`;
        document.getElementById("letra").disabled = true;
        juegoIniciado = false;
    } else if (!palabraAdivinada.includes("_")) {
        document.getElementById("mensaje").textContent = "¡Ganaste!";
        document.getElementById("letra").disabled = true;
        juegoIniciado = false;
    }
    actualizarPantalla();
}

function adivinarLetraTeclado(letra) {
    if (!juegoIniciado) return;
    document.getElementById("mensaje").textContent = "";
    let acierto = false;
    for (let i = 0; i < palabraSecreta.length; i++) {
        if (palabraSecreta[i] === letra && palabraAdivinada[i] === "_") {
            palabraAdivinada[i] = letra;
            acierto = true;
        }
    }
    if (!acierto) intentosRestantes--;
    if (intentosRestantes === 0) {
        document.getElementById("mensaje").textContent = `¡Perdiste! La palabra era: ${palabraSecreta}`;
        juegoIniciado = false;
        deshabilitarTeclado();
    } else if (!palabraAdivinada.includes("_")) {
        document.getElementById("mensaje").textContent = "¡Ganaste!";
        juegoIniciado = false;
        deshabilitarTeclado();
    }
    actualizarPantalla();
}

function deshabilitarTeclado() {
    const botones = document.querySelectorAll('#teclado button');
    botones.forEach(btn => btn.disabled = true);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("letra").addEventListener("keyup", function(e) {
        if (e.key === "Enter") adivinarLetra();
    });
});

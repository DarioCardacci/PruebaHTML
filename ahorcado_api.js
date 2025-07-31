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

async function iniciarJuego() {
    const longitud = parseInt(document.getElementById("longitud").value);
    palabraSecreta = await obtenerPalabra(longitud);
    intentosRestantes = 6;
    palabraAdivinada = Array(palabraSecreta.length).fill("_");
    juegoIniciado = true;
    document.getElementById("letra").disabled = false;
    document.getElementById("mensaje").textContent = "";
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

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("letra").addEventListener("keyup", function(e) {
        if (e.key === "Enter") adivinarLetra();
    });
});

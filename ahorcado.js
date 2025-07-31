const palabras = ["javascript", "html", "css", "programacion", "ahorcado"];
const palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)];
let intentosRestantes = 6;
let palabraAdivinada = Array(palabraSecreta.length).fill("_");

function actualizarPantalla() {
    document.getElementById("palabra").textContent = palabraAdivinada.join(" ");
    document.getElementById("intentos").textContent = intentosRestantes;
}

function adivinarLetra() {
    const letra = document.getElementById("letra").value.toLowerCase();
    document.getElementById("letra").value = "";
    document.getElementById("mensaje").textContent = "";

    if (letra.length !== 1) {
        document.getElementById("mensaje").textContent = "Por favor, ingresa una sola letra.";
        return;
    }

    if (palabraSecreta.includes(letra)) {
        for (let i = 0; i < palabraSecreta.length; i++) {
            if (palabraSecreta[i] === letra) {
                palabraAdivinada[i] = letra;
            }
        }
    } else {
        intentosRestantes--;
    }

    if (intentosRestantes === 0) {
        document.getElementById("mensaje").textContent = "¡Perdiste! La palabra era: " + palabraSecreta;
        document.getElementById("letra").disabled = true;
    } else if (!palabraAdivinada.includes("_")) {
        document.getElementById("mensaje").textContent = "¡Ganaste!";
        document.getElementById("letra").disabled = true;
    }

    actualizarPantalla();
}

actualizarPantalla();

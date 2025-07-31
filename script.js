function calcularPrecioFinal() {
    var producto = document.getElementById('producto').value;
    var precioOriginal = parseFloat(document.getElementById('precio').value);
    var formaPago = document.getElementById('formaPago').value;
    var ajusteManual = parseFloat(document.getElementById('ajusteManual').value);

    if (isNaN(precioOriginal) || precioOriginal <= 0) {
        document.getElementById('resultado').innerText = "Por favor, ingresa un precio válido mayor a cero.";
        return;
    }

    if (isNaN(ajusteManual)) {
        ajusteManual = 0;
    }

    var ajuste = 0;
    switch (formaPago) {
        case 'efectivo':
            ajuste = -20;
            break;
        case 'tarjeta':
            ajuste = 10;
            break;
        case 'transferencia':
            ajuste = -10;
            break;
        case 'otro':
            ajuste = ajusteManual;
            break;
    }

    // Siempre sumar el ajuste manual, excepto si la forma es "otro" que ya se asignó
    //if (formaPago !== 'otro') {
    //    ajuste += ajusteManual;
    //}

    var precioFinal = precioOriginal + precioOriginal * (ajuste / 100);

    var formaPagoTexto = '';
    if (formaPago === 'efectivo') formaPagoTexto = 'Efectivo';
    else if (formaPago === 'tarjeta') formaPagoTexto = 'Tarjeta';
    else if (formaPago === 'transferencia') formaPagoTexto = 'Transferencia';
    else if (formaPago === 'otro') formaPagoTexto = 'Otro';

    document.getElementById('resultado').innerText =
        "Producto: " + producto +
        ", Precio original: $" + precioOriginal.toFixed(2) + ",\n" +
        "Forma de pago: " + formaPagoTexto +
        ", Ajuste aplicado: " + ajuste.toFixed(2) + "%" +
        ", Precio final: $" + precioFinal.toFixed(2);
}

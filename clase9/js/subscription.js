// REFERENCIAS AL DOM
const form = document.getElementById('form-suscripcion');
const tituloSaludo = document.getElementById('titulo-saludo');
const cartel = document.getElementById('cartel-resultado');
const cartelTitulo = document.getElementById('cartel-titulo');
const cartelCuerpo = document.getElementById('cartel-cuerpo');
const btnCerrarCartel = document.getElementById('btn-cerrar-cartel');

const campos = {
    nombre:    document.getElementById('nombre'),
    email:     document.getElementById('email'),
    password:  document.getElementById('password'),
    password2: document.getElementById('password2'),
    edad:      document.getElementById('edad'),
    telefono:  document.getElementById('telefono'),
    direccion: document.getElementById('direccion'),
    ciudad:    document.getElementById('ciudad'),
    cp:        document.getElementById('cp'),
    dni:       document.getElementById('dni'),
};

// FUNCIONES DE VALIDACIÓN
function validarNombre(val) {
    if (val.trim().length <= 6)   return 'Debe tener más de 6 letras.';
    if (!val.trim().includes(' ')) return 'Debe incluir al menos un espacio.';
    return '';
}

function validarEmail(val) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) return 'Ingresá un email válido. Ej: nombre@dominio.com';
    return '';
}

function validarPassword(val) {
    if (val.length < 8)          return 'Debe tener al menos 8 caracteres.';
    if (!/[a-zA-Z]/.test(val))   return 'Debe contener letras.';
    if (!/[0-9]/.test(val))      return 'Debe contener números.';
    return '';
}

function validarPassword2(val) {
    if (val !== campos.password.value) return 'Las contraseñas no coinciden.';
    return '';
}

function validarEdad(val) {
    const num = parseInt(val);
    if (isNaN(num) || !Number.isInteger(num)) return 'Ingresá un número entero.';
    if (num < 18) return 'Debés tener al menos 18 años.';
    return '';
}

function validarTelefono(val) {
    if (/[\s\-()]/.test(val))   return 'No se permiten espacios, guiones ni paréntesis.';
    if (!/^\d{7,}$/.test(val))  return 'Debe tener al menos 7 dígitos numéricos.';
    return '';
}

function validarDireccion(val) {
    if (val.trim().length < 5)    return 'Debe tener al menos 5 caracteres.';
    if (!val.trim().includes(' ')) return 'Debe incluir letras, números y un espacio.';
    return '';
}

function validarCiudad(val) {
    if (val.trim().length < 3) return 'Debe tener al menos 3 caracteres.';
    return '';
}

function validarCp(val) {
    if (val.trim().length < 3) return 'Debe tener al menos 3 caracteres.';
    return '';
}

function validarDni(val) {
    if (!/^\d{7,8}$/.test(val)) return 'Debe tener 7 u 8 dígitos numéricos.';
    return '';
}

// Mapa: campo → función validadora
const validaciones = {
    nombre:    validarNombre,
    email:     validarEmail,
    password:  validarPassword,
    password2: validarPassword2,
    edad:      validarEdad,
    telefono:  validarTelefono,
    direccion: validarDireccion,
    ciudad:    validarCiudad,
    cp:        validarCp,
    dni:       validarDni,
};


// MOSTRAR / OCULTAR ERRORES
function mostrarError(id, mensaje) {
    const span = document.getElementById('error-' + id);
    const input = campos[id];
    span.textContent = mensaje;
    if (mensaje) {
        input.classList.add('input-error');
    } else {
        input.classList.remove('input-error');
    }
}

function ocultarError(id) {
    mostrarError(id, '');
}


// EVENTOS blur Y focus
Object.keys(campos).forEach(function(id) {
    const input = campos[id];

    input.addEventListener('blur', function() {
        const error = validaciones[id](input.value);
        mostrarError(id, error);
    });

    input.addEventListener('focus', function() {
        ocultarError(id);
    });
});



// título dinámico
campos.nombre.addEventListener('keydown', function() {
    // usamos setTimeout 0 para leer el valor después de que
    // el navegador procese la tecla presionada
    setTimeout(function() {
        const nombre = campos.nombre.value.trim();
        tituloSaludo.textContent = nombre ? 'HOLA ' + nombre.toUpperCase() : 'HOLA';
    }, 0);
});

campos.nombre.addEventListener('focus', function() {
    setTimeout(function() {
        const nombre = campos.nombre.value.trim();
        tituloSaludo.textContent = nombre ? 'HOLA ' + nombre.toUpperCase() : 'HOLA';
    }, 0);
});


form.addEventListener('submit', function(e) {
    e.preventDefault(); // evita que la página se recargue

    let todoBien = true;
    const erroresCartel = [];

    // Validar todos los campos
    Object.keys(campos).forEach(function(id) {
        const error = validaciones[id](campos[id].value);
        mostrarError(id, error);
        if (error) {
            todoBien = false;
            erroresCartel.push(error);
        }
    });

    // Mostrar cartel
    cartel.classList.remove('oculto');

    if (todoBien) {
        form.reset(); 
        tituloSaludo.textContent = 'HOLA'; 
        // Éxito
        cartelTitulo.textContent = 'Suscripción recibida';
        cartelTitulo.style.color = '#27ae60';

        cartelCuerpo.innerHTML = `
            <p><span class="dato-label">Nombre:</span> ${campos.nombre.value}</p>
            <p><span class="dato-label">Email:</span> ${campos.email.value}</p>
            <p><span class="dato-label">Edad:</span> ${campos.edad.value}</p>
            <p><span class="dato-label">Teléfono:</span> ${campos.telefono.value}</p>
            <p><span class="dato-label">Dirección:</span> ${campos.direccion.value}</p>
            <p><span class="dato-label">Ciudad:</span> ${campos.ciudad.value}</p>
            <p><span class="dato-label">Código postal:</span> ${campos.cp.value}</p>
            <p><span class="dato-label">DNI:</span> ${campos.dni.value}</p>
        `;
    } else {
        // Error: mostrar lista de errores
        cartelTitulo.textContent = '❌ Hay errores en el formulario';
        cartelTitulo.style.color = '#e74c3c';

        const lista = erroresCartel
            .map(err => `<p class="error-cartel">• ${err}</p>`)
            .join('');
        cartelCuerpo.innerHTML = lista;
    }
});

// Cerrar el cartel
btnCerrarCartel.addEventListener('click', function() {
    cartel.classList.add('oculto');
});
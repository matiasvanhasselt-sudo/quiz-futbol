// ==========================================
// PREGUNTAS INICIALES
// ==========================================

const preguntasIniciales = [

    {
        id: "inicial-1",
        tipo: "4-opciones",
        pregunta: "¿Quién ganó el Mundial de Qatar 2022?",
        opciones: [
            "Francia",
            "Argentina",
            "Brasil",
            "Alemania"
        ],
        correcta: 1,
        explicacion:
            "Argentina derrotó a Francia en la final del Mundial de Qatar 2022."
    },

    {
        id: "inicial-2",
        tipo: "2-opciones",
        pregunta:
            "¿Colo-Colo tiene más títulos de Primera División que Universidad de Chile?",
        opciones: [
            "Sí",
            "No"
        ],
        correcta: 0,
        explicacion:
            "Sí. Colo-Colo es el club con más títulos de Primera División del fútbol chileno."
    },

    {
        id: "inicial-3",
        tipo: "verdadero-falso",
        pregunta:
            "Colo-Colo fue campeón de la Copa Libertadores en 1973.",
        opciones: [
            "VERDADERO",
            "FALSO"
        ],
        correcta: 1,
        explicacion:
            "Falso. Colo-Colo llegó a la final de 1973, pero perdió ante Independiente de Argentina."
    }

];


// ==========================================
// CARGAR PREGUNTAS GUARDADAS
// ==========================================

let preguntasGuardadas =
    JSON.parse(
        localStorage.getItem("preguntasQuiz")
    ) || [];


// Dar ID a preguntas antiguas
preguntasGuardadas.forEach(pregunta => {

    if (!pregunta.id) {

        pregunta.id =
            "pregunta-" +
            Date.now() +
            Math.random();

    }

});


localStorage.setItem(
    "preguntasQuiz",
    JSON.stringify(preguntasGuardadas)
);


// Todas las preguntas
let preguntas = [
    ...preguntasIniciales,
    ...preguntasGuardadas
];


// ==========================================
// VARIABLES
// ==========================================

let preguntaActual = 0;

let puntaje = 0;

let preguntaEditando = null;

let preguntasPartida = [];


// ==========================================
// ELEMENTOS
// ==========================================

const menu =
    document.getElementById("menu");

const quiz =
    document.getElementById("quiz");

const crearPregunta =
    document.getElementById("crear-pregunta");

const banco =
    document.getElementById("banco-preguntas");
const configuracion =
    document.getElementById(
        "configuracion-partida"
    );

// ==========================================
// COMENZAR QUIZ
// ==========================================

function comenzarQuiz() {

    menu.style.display = "none";

    crearPregunta.style.display = "none";

    banco.style.display = "none";

    quiz.style.display = "block";

    preguntaActual = 0;

    puntaje = 0;

    mostrarPregunta();

}


// ==========================================
// MOSTRAR PREGUNTA
// ==========================================

function mostrarPregunta() {

    const pregunta =
    preguntasPartida[preguntaActual];

    if (!pregunta) {

        mostrarResultadoFinal();

        return;

    }


    let html = `

        <div class="quiz-header">

            <span>
                Pregunta
                ${preguntaActual + 1}
                /
                ${preguntasPartida.length}
            </span>

            <span>
                Puntaje:
                ${puntaje}
            </span>

        </div>


        <div class="tipo-pregunta">

            ${obtenerNombreTipo(
                pregunta.tipo
            )}

        </div>


        <h2>
            ${pregunta.pregunta}
        </h2>

    `;


    // ======================================
    // VERDADERO / FALSO
    // ======================================

  if (
    window.modoPartida === "oral"
) {

    html += `

        <div class="modo-oral">

            <div class="icono-oral">
                🗣️
            </div>

            <h3>
                RESPONDE EN LA VIDA REAL
            </h3>

            <p>
                Piensa tu respuesta antes
                de revelar la solución.
            </p>

        </div>


        <button
            class="siguiente-btn"
            onclick="revelarRespuestaOral()">

            👀 REVELAR RESPUESTA

        </button>


        <div id="resultado"></div>

    `;

}

else if (
    pregunta.tipo ===
    "verdadero-falso"
) {

    html += `

        <div class="modo-voz">

            <p>
                🤔 Responde en voz alta
            </p>

            <p>
                Cuando estés listo:
            </p>

        </div>


        <button
            class="siguiente-btn"
            onclick="revelarVerdaderoFalso()">

            SIGUIENTE →

        </button>


        <div id="resultado"></div>

    `;

}


    // ======================================
    // ALTERNATIVAS
    // ======================================

    else {

        html += `

            <div class="opciones">

        `;


        pregunta.opciones.forEach(
            (opcion, index) => {

                html += `

                    <button
                        class="opcion"
                        onclick="responder(${index})">

                        ${opcion}

                    </button>

                `;

            }
        );


        html += `

            </div>


            <div id="resultado"></div>


            <button
                id="siguiente-btn"
                onclick="siguientePregunta()"
                style="display:none;">

                SIGUIENTE →

            </button>

        `;

    }


    quiz.innerHTML = html;

}


// ==========================================
// NOMBRE DEL TIPO
// ==========================================

function obtenerNombreTipo(tipo) {

    if (tipo === "4-opciones") {

        return "4 ALTERNATIVAS";

    }


    if (tipo === "2-opciones") {

        return "2 ALTERNATIVAS";

    }


    if (tipo === "verdadero-falso") {

        return "VERDADERO O FALSO";

    }


    return "PREGUNTA";

}


// ==========================================
// RESPONDER ALTERNATIVAS
// ==========================================

function responder(indice) {

    const pregunta =
        preguntas[preguntaActual];


    const botones =
        document.querySelectorAll(
            ".opcion"
        );


    const resultado =
        document.getElementById(
            "resultado"
        );


    botones.forEach(boton => {

        boton.disabled = true;

    });


    if (
        indice ===
        pregunta.correcta
    ) {

        puntaje++;


        botones[indice]
            .classList
            .add("correcta");


        resultado.innerHTML = `

            <div
                class="respuesta correcta-texto">

                <h3>
                    ✅ ¡CORRECTO!
                </h3>

                <p>
                    ${pregunta.explicacion}
                </p>

            </div>

        `;

    }

    else {

        botones[indice]
            .classList
            .add("incorrecta");


        botones[pregunta.correcta]
            .classList
            .add("correcta");


        resultado.innerHTML = `

            <div
                class="respuesta incorrecta-texto">

                <h3>
                    ❌ INCORRECTO
                </h3>

                <p>

                    <strong>
                        Respuesta correcta:
                    </strong>

                    ${
                        pregunta.opciones[
                            pregunta.correcta
                        ]
                    }

                </p>


                <p>
                    ${pregunta.explicacion}
                </p>

            </div>

        `;

    }


    document.getElementById(
        "siguiente-btn"
    ).style.display =
        "inline-block";

}


// ==========================================
// VERDADERO / FALSO
// ==========================================

function revelarVerdaderoFalso() {

    const pregunta =
        preguntas[preguntaActual];


    const respuestaCorrecta =
        pregunta.opciones[
            pregunta.correcta
        ];


    const resultado =
        document.getElementById(
            "resultado"
        );


    resultado.innerHTML = `

        <div
            class="respuesta vf-respuesta">

            <h3>

                ${
                    respuestaCorrecta ===
                    "VERDADERO"

                        ? "✅ VERDADERO"

                        : "❌ FALSO"
                }

            </h3>


            <p>
                ${pregunta.explicacion}
            </p>

        </div>


        <div class="acertaste">

            <h3>
                ¿ACERTASTE?
            </h3>


            <div class="acertaste-botones">

                <button
                    class="acertaste-si"
                    onclick="marcarAcierto(true)">

                    🟢 SÍ

                </button>


                <button
                    class="acertaste-no"
                    onclick="marcarAcierto(false)">

                    🔴 NO

                </button>

            </div>

        </div>

    `;

}


// ==========================================
// MARCAR ACIERTO
// ==========================================

function marcarAcierto(acerto) {

    const botones =
        document.querySelectorAll(
            ".acertaste-botones button"
        );


    botones.forEach(boton => {

        boton.disabled = true;

    });


    if (acerto) {

        puntaje++;

    }


    const resultado =
        document.getElementById(
            "resultado"
        );


    resultado.innerHTML += `

        <button
            class="siguiente-btn"
            onclick="siguientePregunta()">

            CONTINUAR →

        </button>

    `;

}


// ==========================================
// SIGUIENTE
// ==========================================

function siguientePregunta() {

    preguntaActual++;


    if (
    preguntaActual <
    preguntasPartida.length
) {

        mostrarPregunta();

    }

    else {

        mostrarResultadoFinal();

    }

}


// ==========================================
// RESULTADO FINAL
// ==========================================

function mostrarResultadoFinal() {

    const porcentaje =
        preguntas.length > 0
            ? Math.round(
                (
                    puntaje /
                    preguntasPartida.length
                ) * 100
            )
            : 0;


    quiz.innerHTML = `

        <h1>
            🏆 RESULTADO FINAL
        </h1>


        <p>
            Conseguís:
        </p>


        <div class="puntaje-final">

            ${puntaje}
            /
            ${preguntas.length}

        </div>


        <p>

            ${porcentaje}%
            de respuestas correctas

        </p>


        <button
            onclick="volverMenu()">

            VOLVER AL MENÚ

        </button>

    `;

}


// ==========================================
// CREAR PREGUNTA
// ==========================================

function mostrarCrearPregunta() {

    menu.style.display = "none";

    quiz.style.display = "none";

    banco.style.display = "none";

    crearPregunta.style.display =
        "block";


    preguntaEditando = null;


    const boton =
        document.getElementById(
            "guardar-pregunta-btn"
        );


    if (boton) {

        boton.textContent =
            "💾 GUARDAR PREGUNTA";

    }

}


// ==========================================
// CAMBIAR TIPO
// ==========================================

function cambiarTipoPregunta() {

    const tipo =
        document.getElementById(
            "tipo-pregunta"
        ).value;


    const opciones =
        document.getElementById(
            "opciones-container"
        );


    const respuestaCorrecta =
        document.getElementById(
            "respuesta-correcta"
        );
        const respuestaAlternativasContainer =
    document.getElementById(
        "respuesta-alternativas-container"
    );
const respuestaOralContainer =
    document.getElementById(
        "respuesta-oral-container"
    );
    respuestaOralContainer.style.display =
    "none";

respuestaCorrecta.style.display =
    "block";
if (
    tipo ===
    "oral"
) {

    opciones.style.display =
        "none";


    respuestaAlternativasContainer.style.display =
        "none";


    respuestaCorrecta.style.display =
        "none";


    respuestaOralContainer.style.display =
        "block";


    return;

}
    if (
    tipo ===
    "verdadero-falso"
) {

    opciones.style.display =
        "none";


    respuestaAlternativasContainer.style.display =
        "block";


    respuestaCorrecta.style.display =
        "block";


    respuestaCorrecta.innerHTML = `

        <option value="0">
            VERDADERO
        </option>

        <option value="1">
            FALSO
        </option>

    `;


    return;

}

respuestaAlternativasContainer.style.display =
    "block";

respuestaCorrecta.style.display =
    "block";
    opciones.style.display =
        "block";


    if (
        tipo ===
        "2-opciones"
    ) {

        document.getElementById(
            "opcion3"
        ).style.display =
            "none";


        document.getElementById(
            "opcion4"
        ).style.display =
            "none";


        respuestaCorrecta.innerHTML = `

            <option value="0">
                Alternativa 1
            </option>

            <option value="1">
                Alternativa 2
            </option>

        `;

    }

    else {

        document.getElementById(
            "opcion3"
        ).style.display =
            "block";


        document.getElementById(
            "opcion4"
        ).style.display =
            "block";


        respuestaCorrecta.innerHTML = `

            <option value="0">
                Alternativa 1
            </option>

            <option value="1">
                Alternativa 2
            </option>

            <option value="2">
                Alternativa 3
            </option>

            <option value="3">
                Alternativa 4
            </option>

        `;

    }

}


// ==========================================
// GUARDAR / EDITAR PREGUNTA
// ==========================================

function guardarPregunta() {

    const tipo =
        document.getElementById(
            "tipo-pregunta"
        ).value;


    const categoria =
        document.getElementById(
            "categoria-pregunta"
        ).value;


    const dificultad =
        document.getElementById(
            "dificultad-pregunta"
        ).value;


    const texto =
        document.getElementById(
            "texto-pregunta"
        ).value.trim();


    const justificacion =
        document.getElementById(
            "justificacion"
        ).value.trim();


    // ======================================
    // COMPROBAR PREGUNTA
    // ======================================

    if (!texto) {

        alert(
            "Escribe una pregunta."
        );

        return;

    }


    // ======================================
    // COMPROBAR JUSTIFICACIÓN
    // ======================================

    if (!justificacion) {

        alert(
            "Escribe una justificación."
        );

        return;

    }


    let opciones = [];

    let correcta;


    // ======================================
    // RESPUESTA ORAL
    // ======================================

    if (
        tipo ===
        "oral"
    ) {

        const respuestaOral =
            document.getElementById(
                "respuesta-oral"
            ).value.trim();


        if (!respuestaOral) {

            alert(
                "Escribe la respuesta correcta."
            );

            return;

        }


        opciones = [
            respuestaOral
        ];


        correcta = 0;

    }


    // ======================================
    // VERDADERO / FALSO
    // ======================================

    else if (
        tipo ===
        "verdadero-falso"
    ) {

        opciones = [
            "VERDADERO",
            "FALSO"
        ];


        correcta =
            parseInt(
                document.getElementById(
                    "respuesta-correcta"
                ).value
            );

    }


    // ======================================
    // 2 O 4 ALTERNATIVAS
    // ======================================

    else {

        const cantidad =
            tipo === "2-opciones"
                ? 2
                : 4;


        for (
            let i = 1;
            i <= cantidad;
            i++
        ) {

            const valor =
                document.getElementById(
                    "opcion" + i
                ).value.trim();


            if (!valor) {

                alert(
                    "Completa todas las alternativas."
                );

                return;

            }


            opciones.push(
                valor
            );

        }


        correcta =
            parseInt(
                document.getElementById(
                    "respuesta-correcta"
                ).value
            );

    }


    // ======================================
    // CREAR OBJETO
    // ======================================

    const nuevaPregunta = {

        id:
            preguntaEditando !== null
                ? preguntas[
                    preguntaEditando
                ].id
                : "pregunta-" +
                  Date.now(),

        tipo:
            tipo,

        categoria:
            categoria,

        dificultad:
            dificultad,

        pregunta:
            texto,

        opciones:
            opciones,

        correcta:
            correcta,

        explicacion:
            justificacion

    };


    // ======================================
    // EDITAR
    // ======================================

    if (
        preguntaEditando !== null
    ) {

        const preguntaAnterior =
            preguntas[
                preguntaEditando
            ];


        preguntas[
            preguntaEditando
        ] =
            nuevaPregunta;


        const indiceGuardado =
            preguntasGuardadas.findIndex(
                p =>
                    p.id ===
                    preguntaAnterior.id
            );


        if (
            indiceGuardado !== -1
        ) {

            preguntasGuardadas[
                indiceGuardado
            ] =
                nuevaPregunta;

        }


        localStorage.setItem(
            "preguntasQuiz",
            JSON.stringify(
                preguntasGuardadas
            )
        );


        alert(
            "✅ Pregunta actualizada."
        );


        preguntaEditando =
            null;


        limpiarFormulario();

        mostrarBanco();


        return;

    }


    // ======================================
    // CREAR
    // ======================================

    preguntas.push(
        nuevaPregunta
    );


    preguntasGuardadas.push(
        nuevaPregunta
    );


    localStorage.setItem(
        "preguntasQuiz",
        JSON.stringify(
            preguntasGuardadas
        )
    );


    alert(
        "✅ Pregunta guardada correctamente."
    );


    limpiarFormulario();

}


// ==========================================
// LIMPIAR FORMULARIO
// ==========================================

function limpiarFormulario() {

    document.getElementById(
        "texto-pregunta"
    ).value = "";


    document.getElementById(
        "justificacion"
    ).value = "";


    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        document.getElementById(
            "opcion" + i
        ).value = "";

    }


    document.getElementById(
        "tipo-pregunta"
    ).value =
        "4-opciones";


    cambiarTipoPregunta();


    preguntaEditando = null;


    const boton =
        document.getElementById(
            "guardar-pregunta-btn"
        );


    if (boton) {

        boton.textContent =
            "💾 GUARDAR PREGUNTA";

    }

}


// ==========================================
// BANCO DE PREGUNTAS
// ==========================================

function mostrarBanco() {

    menu.style.display = "none";

    quiz.style.display = "none";

    crearPregunta.style.display = "none";

    banco.style.display = "block";


    mostrarBancoPreguntas();

}


// ==========================================
// MOSTRAR BANCO
// ==========================================

function mostrarBancoPreguntas() {

    const lista =
        document.getElementById(
            "lista-preguntas"
        );


    const busqueda =
        document.getElementById(
            "buscar-preguntas"
        ).value.toLowerCase();


    const filtro =
        document.getElementById(
            "filtro-tipo"
        ).value;


    const preguntasFiltradas =
        preguntas.filter(
            pregunta => {

                const coincideTexto =
                    pregunta.pregunta
                        .toLowerCase()
                        .includes(
                            busqueda
                        );


                const coincideTipo =
                    filtro === "todos" ||
                    pregunta.tipo === filtro;


                return (
                    coincideTexto &&
                    coincideTipo
                );

            }
        );


    lista.innerHTML = "";


    if (
        preguntasFiltradas.length === 0
    ) {

        lista.innerHTML = `

            <div class="sin-preguntas">

                <p>
                    No se encontraron preguntas.
                </p>

            </div>

        `;

        return;

    }


    preguntasFiltradas.forEach(
        pregunta => {

            const indice =
                preguntas.indexOf(
                    pregunta
                );


            const tarjeta =
                document.createElement(
                    "div"
                );


            tarjeta.className =
                "tarjeta-pregunta";


            tarjeta.innerHTML = `

                <div>

                    <span
                        class="etiqueta-tipo">

                        ${obtenerNombreTipo(
                            pregunta.tipo
                        )}

                    </span>
<span class="etiqueta-tipo">

    ${obtenerNombreCategoria(
        pregunta.categoria
    )}

</span>

<span class="etiqueta-dificultad">

    ${obtenerNombreDificultad(
        pregunta.dificultad
    )}

</span>

                    <h3>
                        ${pregunta.pregunta}
                    </h3>

                </div>


                <div class="acciones-pregunta">

                    <button
                        class="editar-btn"
                        onclick="
                            editarPregunta(${indice})
                        ">

                        ✏️

                    </button>


                    <button
                        class="eliminar-btn"
                        onclick="
                            eliminarPregunta(${indice})
                        ">

                        🗑️

                    </button>

                </div>

            `;


            lista.appendChild(
                tarjeta
            );

        }
    );

}


// ==========================================
// EDITAR PREGUNTA
// ==========================================

function editarPregunta(index) {

    const pregunta =
        preguntas[index];


    if (!pregunta) {

        return;

    }


    preguntaEditando = index;


    menu.style.display = "none";

    quiz.style.display = "none";

    banco.style.display = "none";

    crearPregunta.style.display =
        "block";


    document.getElementById(
        "tipo-pregunta"
    ).value =
        pregunta.tipo;
document.getElementById(
    "categoria-pregunta"
).value =
    pregunta.categoria || "general";


document.getElementById(
    "dificultad-pregunta"
).value =
    pregunta.dificultad || "facil";

    cambiarTipoPregunta();


    document.getElementById(
        "texto-pregunta"
    ).value =
        pregunta.pregunta;


    document.getElementById(
        "justificacion"
    ).value =
        pregunta.explicacion;


    if (
        pregunta.tipo !==
        "verdadero-falso"
    ) {

        pregunta.opciones.forEach(
            (opcion, i) => {

                const input =
                    document.getElementById(
                        "opcion" +
                        (i + 1)
                    );


                if (input) {

                    input.value =
                        opcion;

                }

            }
        );

    }


    document.getElementById(
        "respuesta-correcta"
    ).value =
        pregunta.correcta;


    const boton =
        document.getElementById(
            "guardar-pregunta-btn"
        );


    if (boton) {

        boton.textContent =
            "💾 GUARDAR CAMBIOS";

    }

}


// ==========================================
// ELIMINAR PREGUNTA
// ==========================================

function eliminarPregunta(index) {

    const pregunta =
        preguntas[index];


    if (!pregunta) {

        return;

    }


    const confirmar =
        confirm(
            "¿Seguro que quieres eliminar esta pregunta?"
        );


    if (!confirmar) {

        return;

    }


    const indiceGuardado =
        preguntasGuardadas.findIndex(
            p =>
                p.id ===
                pregunta.id
        );


    if (
        indiceGuardado !== -1
    ) {

        preguntasGuardadas.splice(
            indiceGuardado,
            1
        );


        localStorage.setItem(
            "preguntasQuiz",
            JSON.stringify(
                preguntasGuardadas
            )
        );

    }


    preguntas.splice(
        index,
        1
    );


    mostrarBancoPreguntas();

}


// ==========================================
// VOLVER AL MENÚ
// ==========================================

function volverMenu() {

    // Mostrar menú
    menu.style.display = "block";


    // Ocultar todas las demás pantallas
    configuracion.style.display = "none";

    quiz.style.display = "none";

    crearPregunta.style.display = "none";

    banco.style.display = "none";

}
// ==========================================
// NOMBRE CATEGORÍA
// ==========================================

function obtenerNombreCategoria(categoria) {

    const categorias = {

        "general": "⚽ General",

        "futbol-chileno":
            "🇨🇱 Fútbol chileno",

        "colo-colo":
            "⚪⚫ Colo-Colo",

        "universidad-de-chile":
            "🔵 Universidad de Chile",

        "universidad-catolica":
            "🔵 Universidad Católica",

        "internacional":
            "🌎 Internacional",

        "libertadores":
            "🏆 Libertadores",

        "mundiales":
            "🌍 Mundiales",

        "jugadores":
            "👤 Jugadores",

        "historia":
            "📜 Historia"

    };


    return categorias[categoria]
        || "⚽ General";

}


// ==========================================
// NOMBRE DIFICULTAD
// ==========================================

function obtenerNombreDificultad(dificultad) {

    const dificultades = {

        "facil": "🟢 Fácil",

        "medio": "🟡 Medio",

        "dificil": "🔴 Difícil"

    };


    return dificultades[dificultad]
        || "🟢 Fácil";

}
// ==========================================
// CONFIGURAR PARTIDA
// ==========================================

function mostrarConfiguracion() {

    menu.style.display = "none";

    quiz.style.display = "none";

    crearPregunta.style.display = "none";

    banco.style.display = "none";

    configuracion.style.display =
        "block";

}
// ==========================================
// INICIAR PARTIDA CONFIGURADA
// ==========================================

function iniciarPartidaConfigurada() {

    const categoria =
        document.getElementById(
            "config-categoria"
        ).value;


    const dificultad =
        document.getElementById(
            "config-dificultad"
        ).value;


    const tipo =
        document.getElementById(
            "config-tipo"
        ).value;


    const modo =
        document.getElementById(
            "config-modo"
        ).value;


    const cantidad =
        document.getElementById(
            "config-cantidad"
        ).value;


    // ======================================
    // FILTRAR PREGUNTAS
    // ======================================

    let disponibles =
        preguntas.filter(
            pregunta => {

                const coincideCategoria =
                    categoria === "todos" ||
                    pregunta.categoria ===
                    categoria;


                const coincideDificultad =
                    dificultad === "todos" ||
                    pregunta.dificultad ===
                    dificultad;


                const coincideTipo =
                    tipo === "todos" ||
                    pregunta.tipo ===
                    tipo;


                return (
                    coincideCategoria &&
                    coincideDificultad &&
                    coincideTipo
                );

            }
        );


    // ======================================
    // COMPROBAR SI HAY PREGUNTAS
    // ======================================

    if (
        disponibles.length === 0
    ) {

        alert(
            "⚠️ No hay preguntas que coincidan con esos filtros."
        );

        return;

    }


    // ======================================
    // MEZCLAR PREGUNTAS
    // ======================================

    disponibles.sort(
        () => Math.random() - 0.5
    );


    // ======================================
    // ELEGIR CANTIDAD
    // ======================================

    if (
        cantidad !== "todas"
    ) {

        const numero =
            parseInt(cantidad);


        disponibles =
            disponibles.slice(
                0,
                numero
            );

    }


    // ======================================
    // GUARDAR CONFIGURACIÓN
    // ======================================

    preguntasPartida =
        disponibles;


    window.modoPartida =
        modo;


    preguntaActual = 0;

    puntaje = 0;


    // ======================================
    // CAMBIAR DE PANTALLA
    // ======================================

    configuracion.style.display =
        "none";


    quiz.style.display =
        "block";


    crearPregunta.style.display =
        "none";


    banco.style.display =
        "none";


    menu.style.display =
        "none";


    // ======================================
    // MOSTRAR PRIMERA PREGUNTA
    // ======================================

    mostrarPregunta();

}
// ==========================================
// REVELAR RESPUESTA ORAL
// ==========================================

function revelarRespuestaOral() {

    const pregunta =
        preguntasPartida[preguntaActual];


    const resultado =
        document.getElementById(
            "resultado"
        );


    const respuesta =
        pregunta.opciones[
            pregunta.correcta
        ];


    resultado.innerHTML = `

        <div class="respuesta oral-respuesta">

            <h3>
                💡 RESPUESTA
            </h3>

            <div class="respuesta-grande">

                ${respuesta}

            </div>


            <p>
                ${
                    pregunta.explicacion ||
                    "No hay una justificación agregada para esta pregunta."
                }
            </p>

        </div>


        <button
            class="siguiente-btn"
            onclick="siguientePregunta()">

            CONTINUAR →

        </button>

    `;

}
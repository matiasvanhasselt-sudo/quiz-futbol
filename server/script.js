// ==========================================
// DTF - DeTodoFútbol
// SCRIPT PRINCIPAL
// ==========================================

// ==========================================
// VARIABLES
// ==========================================

let preguntaActual = 0;
let puntaje = 0;
let preguntasPartida = [];

let nombreJugador = "";
let cantidadPartida = 0;
let modoPartida = "automatico";


// ==========================================
// ELEMENTOS
// ==========================================

const menu = document.getElementById("menu");

const quiz = document.getElementById("quiz");

const configuracion =
    document.getElementById("configuracion-partida");

const ranking =
    document.getElementById("ranking");


// ==========================================
// PUNTOS SEGÚN DIFICULTAD
// ==========================================

function obtenerPuntos(dificultad) {

    switch (dificultad) {

        case "facil":
            return 1;

        case "medio":
            return 2;

        case "dificil":
            return 3;

        default:
            return 1;
    }
}


// ==========================================
// NOMBRE DE CATEGORÍA
// ==========================================

function obtenerNombreCategoria(categoria) {

    const categorias = {

        "champions":
            "🏆 Champions League",

        "premier-league":
            "🏴 Premier League",

        "laliga":
            "🇪🇸 LaLiga",

        "ligue-1":
            "🇫🇷 Ligue 1",

        "serie-a":
            "🇮🇹 Serie A",

        "cinco-grandes-ligas":
            "🌍 Las 5 grandes ligas",

        "futbol-chileno":
            "🇨🇱 Fútbol chileno",

        "colo-colo":
            "⚪⚫ Colo-Colo",

        "libertadores":
            "🏆 Libertadores",

        "mundiales":
            "🌎 Mundiales",

        "jugadores":
            "👤 Jugadores",

        "historia":
            "📜 Historia"

    };

    return categorias[categoria] || categoria;
}


// ==========================================
// NOMBRE DE DIFICULTAD
// ==========================================

function obtenerNombreDificultad(dificultad) {

    const dificultades = {

        "facil":
            "🟢 Fácil",

        "medio":
            "🟡 Medio",

        "dificil":
            "🔴 Difícil"

    };

    return dificultades[dificultad] || "Dificultad";
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

    if (tipo === "oral") {
        return "RESPUESTA ORAL";
    }

    return "PREGUNTA";
}


// ==========================================
// MOSTRAR CONFIGURACIÓN
// ==========================================

function mostrarConfiguracion() {

    menu.style.display = "none";

    quiz.style.display = "none";

    ranking.style.display = "none";

    configuracion.style.display = "block";
}


// ==========================================
// VOLVER AL MENÚ
// ==========================================

function volverMenu() {

    menu.style.display = "block";

    configuracion.style.display = "none";

    quiz.style.display = "none";

    ranking.style.display = "none";
}


// ==========================================
// GENERAR PARTIDA CON IA
// ==========================================

async function iniciarPartidaConfigurada() {

    // --------------------------------------
    // OBTENER CONFIGURACIÓN
    // --------------------------------------

    const nombreInput =
        document.getElementById("config-nombre");

    const categoria =
        document.getElementById("config-categoria").value;

    const dificultad =
        document.getElementById("config-dificultad").value;

    const tipo =
        document.getElementById("config-tipo").value;

    const modo =
        document.getElementById("config-modo").value;

    const cantidadSeleccionada =
        document.getElementById("config-cantidad").value;


    // --------------------------------------
    // VALIDAR NOMBRE
    // --------------------------------------

    nombreJugador =
        nombreInput
            ? nombreInput.value.trim()
            : "";


    if (!nombreJugador) {

        alert("👤 Escribe tu nombre antes de jugar.");

        if (nombreInput) {
            nombreInput.focus();
        }

        return;
    }


    // Limitar nombre

    nombreJugador =
        nombreJugador.substring(0, 20);


    // --------------------------------------
    // CANTIDAD
    // --------------------------------------

    cantidadPartida =
        parseInt(cantidadSeleccionada);


    // --------------------------------------
    // GUARDAR MODO
    // --------------------------------------

    modoPartida = modo;


    // --------------------------------------
    // PREPARAR PANTALLA
    // --------------------------------------

    menu.style.display = "none";

    configuracion.style.display = "none";

    ranking.style.display = "none";

    quiz.style.display = "block";


    quiz.innerHTML = `

        <div class="cargando">

            <h2>
                ⚽ Generando preguntas...
            </h2>

            <p>
                Hola ${escapeHTML(nombreJugador)} 👋
            </p>

            <p>
                🤖 La IA está preparando
                tu partida.
            </p>

            <p>
                ${obtenerNombreCategoria(categoria)}
            </p>

            <p>
                ${obtenerNombreDificultad(dificultad)}
            </p>

            <p>
                ${cantidadPartida} preguntas
            </p>

        </div>

    `;


    try {

        // ----------------------------------
        // LLAMAR A TU SERVIDOR
        // ----------------------------------

        const respuesta =
            await fetch(
                "/generar-preguntas",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            categoria:
                                categoria,

                            dificultad:
                                dificultad,

                            tipo:
                                tipo,

                            cantidad:
                                cantidadPartida,

                            modo:
                                modo

                        })

                }
            );


        const datos =
            await respuesta.json();


        // ----------------------------------
        // ERROR DEL SERVIDOR
        // ----------------------------------

        if (!respuesta.ok) {

            throw new Error(
                datos.error ||
                "El servidor devolvió un error."
            );
        }


        // ----------------------------------
        // VALIDAR RESPUESTA
        // ----------------------------------

        if (
            !datos.preguntas ||
            !Array.isArray(datos.preguntas) ||
            datos.preguntas.length === 0
        ) {

            throw new Error(
                "La IA no devolvió preguntas válidas."
            );
        }


        // ----------------------------------
        // PREPARAR PREGUNTAS
        // ----------------------------------

        preguntasPartida =
            datos.preguntas
                .map((pregunta, index) => {

                    return {

                        id:
                            "ia-" +
                            Date.now() +
                            "-" +
                            index,

                        tipo:
                            pregunta.tipo ||
                            (
                                tipo !== "todos"
                                    ? tipo
                                    : "4-opciones"
                            ),

                        categoria:
                            pregunta.categoria ||
                            categoria,

                        dificultad:
                            pregunta.dificultad ||
                            (
                                dificultad !== "todos"
                                    ? dificultad
                                    : "medio"
                            ),

                        pregunta:
                            pregunta.pregunta,

                        opciones:
                            Array.isArray(
                                pregunta.opciones
                            )
                                ? pregunta.opciones
                                : [],

                        correcta:
                            Number(
                                pregunta.correcta
                            ),

                        explicacion:
                            pregunta.explicacion ||
                            ""

                    };

                })
                .filter(pregunta => {

                    return (
                        pregunta.pregunta &&
                        pregunta.opciones.length > 0 &&
                        Number.isInteger(
                            pregunta.correcta
                        ) &&
                        pregunta.correcta >= 0 &&
                        pregunta.correcta <
                            pregunta.opciones.length
                    );

                });


        // ----------------------------------
        // VALIDAR CANTIDAD
        // ----------------------------------

        if (preguntasPartida.length === 0) {

            throw new Error(
                "Las preguntas recibidas no tienen un formato válido."
            );
        }


        // Si la IA devuelve menos preguntas,
        // usamos las que realmente llegaron.

        cantidadPartida =
            preguntasPartida.length;


        // ----------------------------------
        // INICIAR PARTIDA
        // ----------------------------------

        preguntaActual = 0;

        puntaje = 0;

        mostrarPregunta();

    }


    catch (error) {

        console.error(
            "ERROR GENERANDO PREGUNTAS:",
            error
        );


        quiz.innerHTML = `

            <div class="error-generando">

                <h2>
                    ❌ No se pudieron generar
                    las preguntas
                </h2>

                <p>
                    ${escapeHTML(error.message)}
                </p>

                <button
                    onclick="volverMenu()">

                    ← VOLVER AL MENÚ

                </button>

            </div>

        `;

    }

}


// ==========================================
// MOSTRAR PREGUNTA
// ==========================================

function mostrarPregunta() {

    const pregunta =
        preguntasPartida[preguntaActual];


    // --------------------------------------
    // FIN DEL QUIZ
    // --------------------------------------

    if (!pregunta) {

        mostrarResultadoFinal();

        return;
    }


    const puntosPregunta =
        obtenerPuntos(
            pregunta.dificultad
        );


    let html = `

        <div class="quiz-header">

            <span>
                Pregunta
                ${preguntaActual + 1}
                /
                ${preguntasPartida.length}
            </span>

            <span>
                ⭐ ${puntaje} pts
            </span>

        </div>


        <div class="tipo-pregunta">

            ${obtenerNombreTipo(
                pregunta.tipo
            )}

        </div>


        <div class="dificultad-pregunta">

            ${obtenerNombreDificultad(
                pregunta.dificultad
            )}

            ·
            ${puntosPregunta}
            ${puntosPregunta === 1 ? "punto" : "puntos"}

        </div>


        <h2>
            ${escapeHTML(pregunta.pregunta)}
        </h2>

    `;


    // ======================================
    // RESPUESTA ORAL
    // ======================================

    if (modoPartida === "oral") {

        html += `

            <div class="modo-oral">

                <div class="icono-oral">
                    🗣️
                </div>

                <h3>
                    RESPONDE EN VOZ ALTA
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


    // ======================================
    // VERDADERO / FALSO
    // ======================================

    else if (
        pregunta.tipo === "verdadero-falso"
    ) {

        html += `

            <div class="opciones">

                <button
                    class="opcion"
                    onclick="responder(0)">

                    VERDADERO

                </button>


                <button
                    class="opcion"
                    onclick="responder(1)">

                    FALSO

                </button>

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

                        ${escapeHTML(opcion)}

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
// RESPONDER
// ==========================================

function responder(indice) {

    const pregunta =
        preguntasPartida[preguntaActual];


    if (!pregunta) {
        return;
    }


    const botones =
        document.querySelectorAll(".opcion");


    const resultado =
        document.getElementById("resultado");


    // Evitar doble respuesta

    botones.forEach(boton => {
        boton.disabled = true;
    });


    const esCorrecta =
        indice === pregunta.correcta;


    const puntos =
        obtenerPuntos(
            pregunta.dificultad
        );


    // ======================================
    // CORRECTA
    // ======================================

    if (esCorrecta) {

        puntaje += puntos;


        if (botones[indice]) {

            botones[indice]
                .classList
                .add("correcta");

        }


        resultado.innerHTML = `

            <div
                class="respuesta correcta-texto">

                <h3>
                    ✅ ¡CORRECTO!
                </h3>

                <p>
                    +${puntos}
                    ${puntos === 1 ? "punto" : "puntos"}
                </p>

                <p>
                    ${escapeHTML(
                        pregunta.explicacion || ""
                    )}
                </p>

            </div>

        `;

    }


    // ======================================
    // INCORRECTA
    // ======================================

    else {

        if (botones[indice]) {

            botones[indice]
                .classList
                .add("incorrecta");

        }


        if (botones[pregunta.correcta]) {

            botones[pregunta.correcta]
                .classList
                .add("correcta");

        }


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

                    ${escapeHTML(
                        pregunta.opciones[
                            pregunta.correcta
                        ]
                    )}

                </p>

                <p>
                    ${escapeHTML(
                        pregunta.explicacion || ""
                    )}
                </p>

            </div>

        `;

    }


    // ======================================
    // MOSTRAR SIGUIENTE
    // ======================================

    const siguiente =
        document.getElementById(
            "siguiente-btn"
        );


    if (siguiente) {

        siguiente.style.display =
            "inline-block";

    }

}


// ==========================================
// SIGUIENTE PREGUNTA
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
// RESPUESTA ORAL
// ==========================================

function revelarRespuestaOral() {

    const pregunta =
        preguntasPartida[preguntaActual];


    if (!pregunta) {
        return;
    }


    const resultado =
        document.getElementById("resultado");


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

                ${escapeHTML(respuesta)}

            </div>


            <p>
                ${escapeHTML(
                    pregunta.explicacion ||
                    "No hay explicación disponible."
                )}
            </p>

        </div>


        <button
            class="siguiente-btn"
            onclick="siguientePregunta()">

            CONTINUAR →

        </button>

    `;

}


// ==========================================
// RESULTADO FINAL
// ==========================================

function mostrarResultadoFinal() {

    const total =
        preguntasPartida.length;


    // Máximo posible según
    // las dificultades de las preguntas

    let puntosMaximos = 0;


    preguntasPartida.forEach(
        pregunta => {

            puntosMaximos +=
                obtenerPuntos(
                    pregunta.dificultad
                );

        }
    );


    const porcentaje =
        puntosMaximos > 0
            ? Math.round(
                (puntaje / puntosMaximos) * 100
            )
            : 0;


    // ======================================
    // GUARDAR RANKING
    // ======================================

    guardarResultadoRanking(
        nombreJugador,
        puntaje,
        cantidadPartida
    );


    // ======================================
    // MENSAJE
    // ======================================

    let mensaje = "";

    if (porcentaje >= 90) {

        mensaje =
            "🔥 ¡Increíble!";

    }
    else if (porcentaje >= 70) {

        mensaje =
            "🏆 ¡Muy buen resultado!";

    }
    else if (porcentaje >= 50) {

        mensaje =
            "👏 ¡Buen trabajo!";

    }
    else {

        mensaje =
            "⚽ ¡A seguir practicando!";

    }


    quiz.innerHTML = `

        <div class="resultado-final">

            <h1>
                🏆 RESULTADO FINAL
            </h1>


            <h2>
                ${escapeHTML(nombreJugador)}
            </h2>


            <p>
                ${mensaje}
            </p>


            <div class="puntaje-final">

                ${puntaje} pts

            </div>


            <p>

                ${porcentaje}%
                del puntaje máximo

            </p>


            <p>

                ${total}
                ${total === 1 ? "pregunta" : "preguntas"}

            </p>


            <button
                onclick="mostrarRanking()">

                🏆 VER RANKING

            </button>


            <button
                onclick="volverMenu()">

                🎮 VOLVER A JUGAR

            </button>

        </div>

    `;

}


// ==========================================
// GUARDAR RESULTADO EN RANKING
// ==========================================

function guardarResultadoRanking(
    nombre,
    puntos,
    cantidad
) {

    const clave =
        `ranking_${cantidad}`;


    let rankingGuardado =
        JSON.parse(
            localStorage.getItem(clave)
        ) || [];


    rankingGuardado.push({

        nombre:
            nombre,

        puntos:
            puntos,

        fecha:
            new Date().toISOString()

    });


    // Ordenar de mayor a menor

    rankingGuardado.sort(
        (a, b) =>
            b.puntos - a.puntos
    );


    // Guardar solamente
    // los 10 mejores

    rankingGuardado =
        rankingGuardado.slice(0, 10);


    localStorage.setItem(
        clave,
        JSON.stringify(
            rankingGuardado
        )
    );

}


// ==========================================
// MOSTRAR RANKING
// ==========================================

function mostrarRanking() {

    menu.style.display = "none";

    configuracion.style.display = "none";

    quiz.style.display = "none";

    ranking.style.display = "block";


    cargarRanking();
}


// ==========================================
// CARGAR RANKING
// ==========================================

function cargarRanking() {

    const cantidades =
        [5, 10, 25, 50];


    cantidades.forEach(
        cantidad => {

            const contenedor =
                document.getElementById(
                    `ranking-${cantidad}`
                );


            if (!contenedor) {
                return;
            }


            const datos =
                JSON.parse(
                    localStorage.getItem(
                        `ranking_${cantidad}`
                    )
                ) || [];


            if (datos.length === 0) {

                contenedor.innerHTML = `
                    <p>
                        No hay partidas todavía.
                    </p>
                `;

                return;
            }


            datos.sort(
                (a, b) =>
                    b.puntos - a.puntos
            );


            contenedor.innerHTML =
                datos
                    .slice(0, 10)
                    .map(
                        (jugador, index) => {

                            let posicion;


                            if (index === 0) {

                                posicion = "🥇";

                            }
                            else if (
                                index === 1
                            ) {

                                posicion = "🥈";

                            }
                            else if (
                                index === 2
                            ) {

                                posicion = "🥉";

                            }
                            else {

                                posicion =
                                    `${index + 1}.`;

                            }


                            return `

                                <div
                                    class="ranking-jugador">

                                    <span>

                                        ${posicion}

                                        ${escapeHTML(
                                            jugador.nombre
                                        )}

                                    </span>


                                    <strong>

                                        ${jugador.puntos}
                                        pts

                                    </strong>

                                </div>

                            `;

                        }
                    )
                    .join("");

        }
    );

}


// ==========================================
// ESCAPAR HTML
// ==========================================

function escapeHTML(texto) {

    const div =
        document.createElement("div");


    div.textContent =
        texto == null
            ? ""
            : String(texto);


    return div.innerHTML;
}
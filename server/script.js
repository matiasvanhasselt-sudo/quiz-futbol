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

let dificultadPartida = "ambos";
let tipoPartida = "ambos";
let modoPartida = "automatico";

let respuestaOralRevelada = false;


// ==========================================
// ELEMENTOS
// ==========================================

const menu =
    document.getElementById("menu");

const quiz =
    document.getElementById("quiz");

const configuracion =
    document.getElementById(
        "configuracion-partida"
    );

const ranking =
    document.getElementById("ranking");


// ==========================================
// PUNTOS
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
// DIFICULTADES VÁLIDAS
// ==========================================

function dificultadValida(valor) {

    return [
        "facil",
        "medio",
        "dificil"
    ].includes(valor);
}


// ==========================================
// TIPOS VÁLIDOS
// ==========================================

function tipoValido(valor) {

    return [
        "4-opciones",
        "2-opciones",
        "verdadero-falso",
        "oral"
    ].includes(valor);
}


// ==========================================
// MODOS VÁLIDOS
// ==========================================

function modoValido(valor) {

    return [
        "automatico",
        "oral"
    ].includes(valor);
}


// ==========================================
// DIFICULTAD ALEATORIA
// ==========================================

function obtenerDificultadAleatoria() {

    const dificultades = [
        "facil",
        "medio",
        "dificil"
    ];

    return dificultades[
        Math.floor(
            Math.random() *
            dificultades.length
        )
    ];
}


// ==========================================
// TIPO ALEATORIO
// ==========================================
//
// IMPORTANTE:
// "ambos" NO significa "todos".
// Aquí mezclamos solamente los tipos
// de pregunta automáticos.
// El modo oral se controla aparte.
// ==========================================

function obtenerTipoAleatorio() {

    const tipos = [
        "4-opciones",
        "2-opciones",
        "verdadero-falso"
    ];

    return tipos[
        Math.floor(
            Math.random() *
            tipos.length
        )
    ];
}


// ==========================================
// MODO ALEATORIO
// ==========================================

function obtenerModoAleatorio() {

    return Math.random() < 0.5
        ? "automatico"
        : "oral";
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

    return dificultades[dificultad]
        || "Dificultad";
}


// ==========================================
// NOMBRE DE TIPO
// ==========================================

function obtenerNombreTipo(tipo) {

    switch (tipo) {

        case "4-opciones":
            return "4 ALTERNATIVAS";

        case "2-opciones":
            return "2 ALTERNATIVAS";

        case "verdadero-falso":
            return "VERDADERO O FALSO";

        case "oral":
            return "RESPUESTA ORAL";

        default:
            return "PREGUNTA";
    }
}


// ==========================================
// NOMBRE DE CONFIGURACIÓN
// ==========================================

function obtenerNombreConfiguracion(
    dificultad,
    tipo,
    modo
) {

    const dificultadTexto =
        dificultad === "ambos"
            ? "🎲 Dificultad mixta"
            : obtenerNombreDificultad(
                dificultad
            );


    const tipoTexto =
        tipo === "ambos"
            ? "🎲 Tipos mixtos"
            : obtenerNombreTipo(
                tipo
            );


    let modoTexto;

    if (modo === "ambos") {

        modoTexto =
            "🎲 Modos mixtos";

    }
    else if (modo === "oral") {

        modoTexto =
            "🗣️ Modo oral";

    }
    else {

        modoTexto =
            "🎮 Modo automático";

    }


    return `
        ${dificultadTexto}
        ·
        ${tipoTexto}
        ·
        ${modoTexto}
    `;
}


// ==========================================
// MOSTRAR CONFIGURACIÓN
// ==========================================

function mostrarConfiguracion() {

    if (menu) {
        menu.style.display = "none";
    }

    if (quiz) {
        quiz.style.display = "none";
    }

    if (ranking) {
        ranking.style.display = "none";
    }

    if (configuracion) {
        configuracion.style.display = "block";
    }
}


// ==========================================
// VOLVER AL MENÚ
// ==========================================

function volverMenu() {

    if (menu) {
        menu.style.display = "block";
    }

    if (configuracion) {
        configuracion.style.display = "none";
    }

    if (quiz) {
        quiz.style.display = "none";
    }

    if (ranking) {
        ranking.style.display = "none";
    }

    // Reiniciar partida actual

    preguntaActual = 0;
    puntaje = 0;
    preguntasPartida = [];
}


// ==========================================
// GENERAR PARTIDA
// ==========================================

async function iniciarPartidaConfigurada() {

    const nombreInput =
        document.getElementById(
            "config-nombre"
        );

    const categoriaElement =
        document.getElementById(
            "config-categoria"
        );

    const dificultadElement =
        document.getElementById(
            "config-dificultad"
        );

    const tipoElement =
        document.getElementById(
            "config-tipo"
        );

    const modoElement =
        document.getElementById(
            "config-modo"
        );

    const cantidadElement =
        document.getElementById(
            "config-cantidad"
        );


    // ======================================
    // COMPROBAR ELEMENTOS
    // ======================================

    if (
        !nombreInput ||
        !categoriaElement ||
        !dificultadElement ||
        !tipoElement ||
        !modoElement ||
        !cantidadElement
    ) {

        alert(
            "❌ Falta un elemento de configuración en el index.html."
        );

        return;
    }


    // ======================================
    // OBTENER VALORES
    // ======================================

    nombreJugador =
        nombreInput.value
            .trim()
            .substring(0, 20);


    const categoria =
        categoriaElement.value;

    const dificultad =
        dificultadElement.value;

    const tipo =
        tipoElement.value;

    const modo =
        modoElement.value;

    cantidadPartida =
        parseInt(
            cantidadElement.value,
            10
        );


    // ======================================
    // VALIDAR NOMBRE
    // ======================================

    if (!nombreJugador) {

        alert(
            "👤 Escribe tu nombre antes de jugar."
        );

        nombreInput.focus();

        return;
    }


    // ======================================
    // VALIDAR CONFIGURACIÓN
    // ======================================

    if (
        ![
            "facil",
            "medio",
            "dificil",
            "ambos"
        ].includes(dificultad)
    ) {

        alert(
            "❌ La dificultad seleccionada no es válida."
        );

        return;
    }


    if (
        ![
            "4-opciones",
            "2-opciones",
            "verdadero-falso",
            "ambos"
        ].includes(tipo)
    ) {

        alert(
            "❌ El tipo de pregunta seleccionado no es válido."
        );

        return;
    }


    if (
        ![
            "automatico",
            "oral",
            "ambos"
        ].includes(modo)
    ) {

        alert(
            "❌ El modo seleccionado no es válido."
        );

        return;
    }


    // ======================================
    // GUARDAR CONFIGURACIÓN
    // ======================================

    dificultadPartida =
        dificultad;

    tipoPartida =
        tipo;

    modoPartida =
        modo;


    // ======================================
    // PREPARAR PANTALLA
    // ======================================

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
                Hola
                ${escapeHTML(nombreJugador)}
                👋
            </p>

            <p>
                🤖 La IA está preparando
                tu partida.
            </p>

            <p>
                ${obtenerNombreCategoria(
                    categoria
                )}
            </p>

            <p>
                ${obtenerNombreConfiguracion(
                    dificultad,
                    tipo,
                    modo
                )}
            </p>

            <p>
                ${cantidadPartida}
                preguntas
            </p>

        </div>

    `;


    // ======================================
    // CONFIGURACIÓN QUE SE ENVÍA AL SERVIDOR
    // ======================================
    //
    // La interfaz usa "ambos".
    //
    // Para mejorar compatibilidad con
    // servidores que esperan "todos",
    // enviamos "todos" solamente al backend.
    //
    // ======================================

    const dificultadServidor =
        dificultad === "ambos"
            ? "todos"
            : dificultad;

    const tipoServidor =
        tipo === "ambos"
            ? "todos"
            : tipo;


    try {

        // ==================================
        // FETCH
        // ==================================

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
                                dificultadServidor,

                            tipo:
                                tipoServidor,

                            cantidad:
                                cantidadPartida,

                            modo:
                                modo

                        })

                }
            );


        // ==================================
        // LEER RESPUESTA
        // ==================================

        let datos;

        try {

            datos =
                await respuesta.json();

        }
        catch {

            throw new Error(
                "El servidor no devolvió una respuesta válida."
            );

        }


        // ==================================
        // ERROR HTTP
        // ==================================

        if (!respuesta.ok) {

            throw new Error(
                datos.error ||
                "El servidor devolvió un error."
            );

        }


        // ==================================
        // VALIDAR ARRAY
        // ==================================

        if (
            !datos.preguntas ||
            !Array.isArray(
                datos.preguntas
            ) ||
            datos.preguntas.length === 0
        ) {

            throw new Error(
                "La IA no devolvió preguntas."
            );

        }


        // ==================================
        // PREPARAR PREGUNTAS
        // ==================================

        preguntasPartida =
            datos.preguntas
                .map(
                    (pregunta, index) => {

                        // ------------------
                        // DIFICULTAD
                        // ------------------

                        let dificultadPregunta =
                            String(
                                pregunta.dificultad ||
                                ""
                            )
                            .toLowerCase()
                            .trim();


                        if (
                            !dificultadValida(
                                dificultadPregunta
                            )
                        ) {

                            if (
                                dificultadPartida ===
                                "ambos"
                            ) {

                                dificultadPregunta =
                                    obtenerDificultadAleatoria();

                            }
                            else {

                                dificultadPregunta =
                                    dificultadPartida;

                            }

                        }


                        // ------------------
                        // TIPO
                        // ------------------

                        let tipoPregunta =
                            String(
                                pregunta.tipo ||
                                ""
                            )
                            .toLowerCase()
                            .trim();


                        // Aceptar posibles nombres
                        // enviados por el servidor.

                        if (
                            tipoPregunta ===
                            "4"
                        ) {

                            tipoPregunta =
                                "4-opciones";

                        }

                        if (
                            tipoPregunta ===
                            "2"
                        ) {

                            tipoPregunta =
                                "2-opciones";

                        }

                        if (
                            tipoPregunta ===
                            "vf"
                        ) {

                            tipoPregunta =
                                "verdadero-falso";

                        }

                        if (
                            tipoPregunta ===
                            "verdadero_falso"
                        ) {

                            tipoPregunta =
                                "verdadero-falso";

                        }


                        // Si seleccionamos ambos
                        // y la IA no indica un tipo,
                        // elegimos uno aleatoriamente.

                        if (
                            !tipoValido(
                                tipoPregunta
                            )
                        ) {

                            if (
                                tipoPartida ===
                                "ambos"
                            ) {

                                tipoPregunta =
                                    obtenerTipoAleatorio();

                            }
                            else {

                                tipoPregunta =
                                    tipoPartida;

                            }

                        }


                        // Si tipoPartida es ambos,
                        // NO permitimos que la IA
                        // meta "oral" como tipo.
                        //
                        // El oral lo controla
                        // modoPartida.

                        if (
                            tipoPartida ===
                                "ambos" &&
                            tipoPregunta ===
                                "oral"
                        ) {

                            tipoPregunta =
                                obtenerTipoAleatorio();

                        }


                        // ------------------
                        // MODO
                        // ------------------

                        let modoPregunta;


                        if (
                            modoPartida ===
                            "ambos"
                        ) {

                            modoPregunta =
                                obtenerModoAleatorio();

                        }
                        else {

                            modoPregunta =
                                modoPartida;

                        }


                        // ------------------
                        // OPCIONES
                        // ------------------

                        let opciones =
                            Array.isArray(
                                pregunta.opciones
                            )
                                ? pregunta.opciones
                                : [];


                        opciones =
                            opciones.map(
                                opcion =>
                                    String(opcion)
                            );


                        // ------------------
                        // VERDADERO / FALSO
                        // ------------------

                        if (
                            tipoPregunta ===
                            "verdadero-falso"
                        ) {

                            opciones = [
                                "VERDADERO",
                                "FALSO"
                            ];

                        }


                        // ------------------
                        // 2 OPCIONES
                        // ------------------

                        if (
                            tipoPregunta ===
                            "2-opciones"
                        ) {

                            if (
                                opciones.length >
                                2
                            ) {

                                opciones =
                                    opciones.slice(
                                        0,
                                        2
                                    );

                            }

                        }


                        // ------------------
                        // 4 OPCIONES
                        // ------------------

                        if (
                            tipoPregunta ===
                            "4-opciones"
                        ) {

                            if (
                                opciones.length >
                                4
                            ) {

                                opciones =
                                    opciones.slice(
                                        0,
                                        4
                                    );

                            }

                        }


                        // ------------------
                        // CORRECTA
                        // ------------------

                        let correcta =
                            Number(
                                pregunta.correcta
                            );


                        // ------------------
                        // OBJETO FINAL
                        // ------------------

                        return {

                            id:
                                "ia-" +
                                Date.now() +
                                "-" +
                                index,

                            tipo:
                                tipoPregunta,

                            categoria:
                                pregunta.categoria ||
                                categoria,

                            dificultad:
                                dificultadPregunta,

                            modoRespuesta:
                                modoPregunta,

                            pregunta:
                                String(
                                    pregunta.pregunta ||
                                    ""
                                ),

                            opciones:
                                opciones,

                            correcta:
                                correcta,

                            explicacion:
                                String(
                                    pregunta.explicacion ||
                                    ""
                                )

                        };

                    }
                )
                .filter(
                    pregunta => {

                        // ------------------
                        // PREGUNTA
                        // ------------------

                        if (
                            !pregunta.pregunta
                        ) {

                            return false;

                        }


                        // ------------------
                        // OPCIONES
                        // ------------------

                        if (
                            !Array.isArray(
                                pregunta.opciones
                            ) ||
                            pregunta.opciones.length === 0
                        ) {

                            return false;

                        }


                        // ------------------
                        // CORRECTA
                        // ------------------

                        if (
                            !Number.isInteger(
                                pregunta.correcta
                            )
                        ) {

                            return false;

                        }


                        if (
                            pregunta.correcta < 0 ||
                            pregunta.correcta >=
                            pregunta.opciones.length
                        ) {

                            return false;

                        }


                        return true;

                    }
                );


        // ==================================
        // VALIDAR CANTIDAD
        // ==================================

        if (
            preguntasPartida.length === 0
        ) {

            throw new Error(
                "Las preguntas recibidas no tienen un formato válido."
            );

        }


        // ==================================
        // USAR CANTIDAD REAL
        // ==================================

        cantidadPartida =
            preguntasPartida.length;


        // ==================================
        // REINICIAR PARTIDA
        // ==================================

        preguntaActual = 0;

        puntaje = 0;

        respuestaOralRevelada = false;


        // ==================================
        // MOSTRAR
        // ==================================

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
                    ${escapeHTML(
                        error.message
                    )}
                </p>

                <button
                    onclick="volverMenu()"
                >

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
        preguntasPartida[
            preguntaActual
        ];


    // ======================================
    // FIN
    // ======================================

    if (!pregunta) {

        mostrarResultadoFinal();

        return;

    }


    respuestaOralRevelada = false;


    const puntosPregunta =
        obtenerPuntos(
            pregunta.dificultad
        );


    const esOral =
        pregunta.modoRespuesta ===
        "oral";


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

            ${
                puntosPregunta === 1
                    ? "punto"
                    : "puntos"
            }

        </div>


        <h2>

            ${escapeHTML(
                pregunta.pregunta
            )}

        </h2>

    `;


    // ======================================
    // MODO ORAL
    // ======================================

    if (esOral) {

        html += `

            <div class="modo-oral">

                <div class="icono-oral">
                    🗣️
                </div>

                <h3>
                    RESPONDE EN VOZ ALTA
                </h3>

                <p>
                    Piensa tu respuesta
                    antes de revelar
                    la solución.
                </p>

            </div>


            <button
                id="revelar-oral-btn"
                class="siguiente-btn"
                onclick="revelarRespuestaOral()"
            >

                👀 REVELAR RESPUESTA

            </button>


            <div id="resultado"></div>

        `;

    }


    // ======================================
    // VERDADERO / FALSO
    // ======================================

    else if (
        pregunta.tipo ===
        "verdadero-falso"
    ) {

        html += `

            <div class="opciones">

                <button
                    class="opcion"
                    onclick="responder(0)"
                >

                    VERDADERO

                </button>


                <button
                    class="opcion"
                    onclick="responder(1)"
                >

                    FALSO

                </button>

            </div>


            <div id="resultado"></div>


            <button
                id="siguiente-btn"
                onclick="siguientePregunta()"
                style="display:none;"
            >

                SIGUIENTE →

            </button>

        `;

    }


    // ======================================
    // PREGUNTA NORMAL
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
                        onclick="responder(${index})"
                    >

                        ${escapeHTML(
                            opcion
                        )}

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
                style="display:none;"
            >

                SIGUIENTE →

            </button>

        `;

    }


    quiz.innerHTML =
        html;
}


// ==========================================
// RESPONDER
// ==========================================

function responder(indice) {

    const pregunta =
        preguntasPartida[
            preguntaActual
        ];


    if (!pregunta) {
        return;
    }


    const botones =
        document.querySelectorAll(
            ".opcion"
        );


    const resultado =
        document.getElementById(
            "resultado"
        );


    if (!resultado) {
        return;
    }


    // ======================================
    // EVITAR DOBLE RESPUESTA
    // ======================================

    botones.forEach(
        boton => {

            boton.disabled = true;

        }
    );


    const esCorrecta =
        indice ===
        pregunta.correcta;


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
                class="respuesta correcta-texto"
            >

                <h3>
                    ✅ ¡CORRECTO!
                </h3>

                <p>
                    +${puntos}
                    ${
                        puntos === 1
                            ? "punto"
                            : "puntos"
                    }
                </p>

                <p>
                    ${escapeHTML(
                        pregunta.explicacion
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


        if (
            botones[
                pregunta.correcta
            ]
        ) {

            botones[
                pregunta.correcta
            ]
                .classList
                .add("correcta");

        }


        resultado.innerHTML = `

            <div
                class="respuesta incorrecta-texto"
            >

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
                        pregunta.explicacion
                    )}
                </p>

            </div>

        `;

    }


    // ======================================
    // SIGUIENTE
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
// REVELAR RESPUESTA ORAL
// ==========================================

function revelarRespuestaOral() {

    const pregunta =
        preguntasPartida[
            preguntaActual
        ];


    if (!pregunta) {
        return;
    }


    if (respuestaOralRevelada) {
        return;
    }


    respuestaOralRevelada = true;


    const resultado =
        document.getElementById(
            "resultado"
        );


    if (!resultado) {
        return;
    }


    const respuesta =
        pregunta.opciones[
            pregunta.correcta
        ];


    // ======================================
    // DESACTIVAR BOTÓN
    // ======================================

    const botonRevelar =
        document.getElementById(
            "revelar-oral-btn"
        );


    if (botonRevelar) {

        botonRevelar.disabled =
            true;

        botonRevelar.style.display =
            "none";

    }


    // ======================================
    // MOSTRAR RESPUESTA
    // ======================================

    resultado.innerHTML = `

        <div
            class="respuesta correcta-texto oral-respuesta"
        >

            <h3>
                💡 RESPUESTA
            </h3>

            <div
                class="respuesta-grande"
            >

                ${escapeHTML(
                    respuesta
                )}

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
            onclick="siguientePregunta()"
        >

            CONTINUAR →

        </button>

    `;

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
// RESULTADO FINAL
// ==========================================

function mostrarResultadoFinal() {

    const total =
        preguntasPartida.length;


    // ======================================
    // PUNTOS MÁXIMOS
    // ======================================

    let puntosMaximos = 0;


    preguntasPartida.forEach(
        pregunta => {

            puntosMaximos +=
                obtenerPuntos(
                    pregunta.dificultad
                );

        }
    );


    // ======================================
    // PORCENTAJE
    // ======================================

    const porcentaje =
        puntosMaximos > 0
            ? Math.round(
                (
                    puntaje /
                    puntosMaximos
                ) * 100
            )
            : 0;


    // ======================================
    // RANKING
    // ======================================

    guardarResultadoRanking(
        nombreJugador,
        puntaje,
        cantidadPartida
    );


    // ======================================
    // MENSAJE
    // ======================================

    let mensaje;


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


    // ======================================
    // MOSTRAR RESULTADO
    // ======================================

    quiz.innerHTML = `

        <div
            class="resultado-final"
        >

            <h1>
                🏆 RESULTADO FINAL
            </h1>


            <h2>
                ${escapeHTML(
                    nombreJugador
                )}
            </h2>


            <p>
                ${mensaje}
            </p>


            <div
                class="puntaje-final"
            >

                ${puntaje} pts

            </div>


            <p>

                ${porcentaje}%
                del puntaje máximo

            </p>


            <p>

                ${total}
                ${
                    total === 1
                        ? "pregunta"
                        : "preguntas"
                }

            </p>


            <button
                onclick="mostrarRanking()"
            >

                🏆 VER RANKING

            </button>


            <button
                onclick="volverMenu()"
            >

                🎮 VOLVER A JUGAR

            </button>

        </div>

    `;

}


// ==========================================
// GUARDAR RANKING
// ==========================================

function guardarResultadoRanking(
    nombre,
    puntos,
    cantidad
) {

    const clave =
        `ranking_${cantidad}`;


    let rankingGuardado = [];


    try {

        rankingGuardado =
            JSON.parse(
                localStorage.getItem(
                    clave
                )
            ) || [];

    }
    catch {

        rankingGuardado = [];

    }


    rankingGuardado.push({

        nombre:
            nombre,

        puntos:
            puntos,

        fecha:
            new Date().toISOString()

    });


    rankingGuardado.sort(
        (a, b) =>
            b.puntos - a.puntos
    );


    rankingGuardado =
        rankingGuardado.slice(
            0,
            10
        );


    try {

        localStorage.setItem(
            clave,
            JSON.stringify(
                rankingGuardado
            )
        );

    }
    catch (error) {

        console.error(
            "No se pudo guardar el ranking:",
            error
        );

    }

}


// ==========================================
// MOSTRAR RANKING
// ==========================================

function mostrarRanking() {

    menu.style.display = "none";

    configuracion.style.display =
        "none";

    quiz.style.display = "none";

    ranking.style.display =
        "block";


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


            let datos = [];


            try {

                datos =
                    JSON.parse(
                        localStorage.getItem(
                            `ranking_${cantidad}`
                        )
                    ) || [];

            }
            catch {

                datos = [];

            }


            if (
                !Array.isArray(datos) ||
                datos.length === 0
            ) {

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
                        (
                            jugador,
                            index
                        ) => {

                            let posicion;


                            if (
                                index === 0
                            ) {

                                posicion =
                                    "🥇";

                            }
                            else if (
                                index === 1
                            ) {

                                posicion =
                                    "🥈";

                            }
                            else if (
                                index === 2
                            ) {

                                posicion =
                                    "🥉";

                            }
                            else {

                                posicion =
                                    `${index + 1}.`;

                            }


                            return `

                                <div
                                    class="ranking-jugador"
                                >

                                    <span>

                                        ${posicion}

                                        ${escapeHTML(
                                            jugador.nombre
                                        )}

                                    </span>


                                    <strong>

                                        ${Number(
                                            jugador.puntos
                                        ) || 0}
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
        document.createElement(
            "div"
        );


    div.textContent =
        texto == null
            ? ""
            : String(texto);


    return div.innerHTML;

}


// ==========================================
// INICIO
// ==========================================

if (menu) {

    menu.style.display =
        "block";

}

if (configuracion) {

    configuracion.style.display =
        "none";

}

if (quiz) {

    quiz.style.display =
        "none";

}

if (ranking) {

    ranking.style.display =
        "none";

}
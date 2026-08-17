const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


// ==========================================
// GENERAR PREGUNTAS CON OPENAI
// ==========================================

app.post("/generar-preguntas", async (req, res) => {

    try {

        const {
            categoria,
            dificultad,
            tipo,
            cantidad
        } = req.body;


        // ======================================
        // VALIDAR DATOS
        // ======================================

        if (!categoria || !dificultad || !tipo || !cantidad) {

            return res.status(400).json({
                error: "Faltan datos para generar las preguntas."
            });

        }


        // ======================================
        // PROMPT
        // ======================================

        const prompt = `
Eres un experto en fútbol y estás creando preguntas para un juego de trivia llamado DTF (De Todo Fútbol).

Genera ${cantidad} preguntas de fútbol.

Categoría:
${categoria}

Dificultad:
${dificultad}

Tipo:
${tipo}


REGLAS:

- Las preguntas deben ser reales y tener una respuesta correcta.
- No repitas preguntas.
- La dificultad debe respetarse.
- La categoría debe respetarse.
- Las explicaciones deben ser breves y claras.
- No inventes datos.
- Devuelve solamente JSON válido.


Si el tipo es "4-opciones":

Cada pregunta debe tener exactamente 4 alternativas.


Si el tipo es "2-opciones":

Cada pregunta debe tener exactamente 2 alternativas.


Si el tipo es "verdadero-falso":

Las únicas alternativas permitidas son:

"VERDADERO"
"FALSO"


Devuelve EXACTAMENTE este formato:

{
    "preguntas": [
        {
            "tipo": "${tipo}",
            "categoria": "${categoria}",
            "dificultad": "${dificultad}",
            "pregunta": "Pregunta aquí",
            "opciones": [
                "Alternativa 1",
                "Alternativa 2",
                "Alternativa 3",
                "Alternativa 4"
            ],
            "correcta": 0,
            "explicacion": "Explicación breve."
        }
    ]
}

IMPORTANTE:

"correcta" debe ser el índice de la respuesta correcta comenzando desde 0.

Por ejemplo:

0 = primera alternativa
1 = segunda alternativa
2 = tercera alternativa
3 = cuarta alternativa

No escribas absolutamente nada fuera del JSON.
`;


        // ======================================
        // LLAMAR A OPENAI
        // ======================================

        const response =
            await client.responses.create({

                model: "gpt-5-mini",

                input: prompt

            });


        const texto =
            response.output_text.trim();


        console.log(
            "Respuesta recibida de OpenAI:"
        );

        console.log(texto);


        // ======================================
        // CONVERTIR A JSON
        // ======================================

        const resultado =
            JSON.parse(texto);


        // ======================================
        // COMPROBAR RESULTADO
        // ======================================

        if (
            !resultado.preguntas ||
            !Array.isArray(
                resultado.preguntas
            )
        ) {

            throw new Error(
                "OpenAI no devolvió preguntas válidas."
            );

        }


        // ======================================
        // DEVOLVER AL NAVEGADOR
        // ======================================

        res.json(resultado);


    } catch (error) {

        console.error(
            "================================"
        );

        console.error(
            "ERROR REAL DE OPENAI:"
        );

        console.error(error);

        console.error(
            "================================"
        );


        res.status(500).json({

            error:
                error.message ||
                "Error desconocido del servidor."

        });

    }

});


// ==========================================
// SERVIDOR
// ==========================================

const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Servidor funcionando en el puerto ${PORT}`
        );

    }
);
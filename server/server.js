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

app.post("/generar-preguntas", async (req, res) => {

    try {

        const {
            categoria,
            dificultad,
            tipo,
            cantidad
        } = req.body;

        const prompt = `
Genera ${cantidad} preguntas de fútbol.

Categoría:
${categoria}

Dificultad:
${dificultad}

Tipo:
${tipo}

Cada pregunta debe tener:

- pregunta
- 4 alternativas
- índice de la respuesta correcta (0, 1, 2 o 3)
- explicación breve de la respuesta correcta

Devuelve ÚNICAMENTE un JSON válido con este formato:

{
    "preguntas": [
        {
            "pregunta": "Pregunta aquí",
            "opciones": [
                "Alternativa 1",
                "Alternativa 2",
                "Alternativa 3",
                "Alternativa 4"
            ],
            "correcta": 0,
            "explicacion": "Explicación aquí"
        }
    ]
}

No agregues texto antes ni después del JSON.
`;

        const response = await client.responses.create({
            model: "gpt-5-mini",
            input: prompt
        });

        const texto = response.output_text;

        const resultado = JSON.parse(texto);

        res.json(resultado);

        } catch (error) {

    console.error("ERROR REAL DE OPENAI:");
    console.error(error);

    res.status(500).json({
        error:
            error.message ||
            "Error desconocido del servidor."
    });

}
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});
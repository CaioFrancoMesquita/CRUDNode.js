
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let alunos;

// Conectar ao banco e iniciar servidor
async function iniciarServidor() {
    try {
        await client.connect();

        console.log("Conectado ao MongoDB!");

        const db = client.db("crud_alunos");
        alunos = db.collection("alunos");

        app.listen(3000, () => {
            console.log("Servidor rodando na porta 3000!");
        });

    } catch (erro) {
        console.error("Erro ao conectar:", erro);
    }
}

// INSERT - Cadastrar aluno
app.post("/alunos", async (req, res) => {
    try {
        const { nome, curso, semestre } = req.body;

        const resultado = await alunos.insertOne({
            nome,
            curso,
            semestre: Number(semestre)
        });

        res.status(201).json({
            mensagem: "Aluno cadastrado!",
            id: resultado.insertedId
        });

    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao cadastrar." });
    }
});

// FIND - Consultar alunos
app.get("/alunos", async (req, res) => {
    try {
        const resultado = await alunos.find().toArray();

        res.json(resultado);

    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao consultar." });
    }
});

// UPDATE - Atualizar aluno
app.put("/alunos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, curso, semestre } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ mensagem: "ID inválido." });
        }

        const resultado = await alunos.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    nome,
                    curso,
                    semestre: Number(semestre)
                }
            }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({ mensagem: "Aluno não encontrado." });
        }

        res.json({ mensagem: "Aluno atualizado!" });

    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao atualizar." });
    }
});

// DELETE - Excluir aluno
app.delete("/alunos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ mensagem: "ID inválido." });
        }

        const resultado = await alunos.deleteOne({
            _id: new ObjectId(id)
        });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ mensagem: "Aluno não encontrado." });
        }

        res.json({ mensagem: "Aluno excluído!" });

    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao excluir." });
    }
});

iniciarServidor();


const form = document.getElementById("formAluno");
const lista = document.getElementById("listaAlunos");
const mensagem = document.getElementById("mensagem");

const campoId = document.getElementById("id");
const campoNome = document.getElementById("nome");
const campoCurso = document.getElementById("curso");
const campoSemestre = document.getElementById("semestre");

const botaoSalvar = document.getElementById("botaoSalvar");
const botaoCancelar = document.getElementById("botaoCancelar");


// =================================
// FIND - CONSULTAR ALUNOS
// =================================

async function carregarAlunos() {
    try {
        const resposta = await fetch("/alunos");
        const alunos = await resposta.json();

        lista.replaceChildren();

        alunos.forEach(aluno => {
            const linha = document.createElement("tr");

            const nome = document.createElement("td");
            nome.textContent = aluno.nome;

            const curso = document.createElement("td");
            curso.textContent = aluno.curso;

            const semestre = document.createElement("td");
            semestre.textContent = aluno.semestre;

            const acoes = document.createElement("td");

            const editar = document.createElement("button");
            editar.textContent = "Editar";

            editar.addEventListener("click", () => editarAluno(aluno));

            const excluir = document.createElement("button");
            excluir.textContent = "Excluir";

            excluir.addEventListener("click", () => excluirAluno(aluno._id));

            acoes.append(editar, excluir);

            linha.append(nome, curso, semestre, acoes);
            lista.appendChild(linha);
        });

    } catch (erro) {
        mensagem.textContent = "Erro ao carregar alunos.";
    }
}


// =================================
// INSERT E UPDATE - SALVAR ALUNO
// =================================

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const aluno = {
        nome: campoNome.value.trim(),
        curso: campoCurso.value.trim(),
        semestre: Number(campoSemestre.value)
    };

    const id = campoId.value;

    const url = id ? `/alunos/${id}` : "/alunos";
    const metodo = id ? "PUT" : "POST";

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(aluno)
        });

        const resultado = await resposta.json();

        mensagem.textContent = resultado.mensagem;

        if (!resposta.ok) return;

        form.reset();
        campoId.value = "";

        botaoSalvar.textContent = "Cadastrar";
        botaoCancelar.hidden = true;

        carregarAlunos();

    } catch (erro) {
        mensagem.textContent = "Erro ao salvar aluno.";
    }
});


// =================================
// UPDATE - EDITAR ALUNO
// =================================

function editarAluno(aluno) {
    campoId.value = aluno._id;
    campoNome.value = aluno.nome;
    campoCurso.value = aluno.curso;
    campoSemestre.value = aluno.semestre;

    botaoSalvar.textContent = "Atualizar";
    botaoCancelar.hidden = false;

    window.scrollTo(0, 0);
}


// =================================
// CANCELAR EDIÇÃO
// =================================

botaoCancelar.addEventListener("click", () => {
    form.reset();
    campoId.value = "";

    botaoSalvar.textContent = "Cadastrar";
    botaoCancelar.hidden = true;
});


// =================================
// DELETE - EXCLUIR ALUNO
// =================================

async function excluirAluno(id) {
    if (!confirm("Deseja realmente excluir este aluno?")) {
        return;
    }

    try {
        const resposta = await fetch(`/alunos/${id}`, {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        mensagem.textContent = resultado.mensagem;

        if (resposta.ok) {
            carregarAlunos();
        }

    } catch (erro) {
        mensagem.textContent = "Erro ao excluir aluno.";
    }
}


// Carrega os alunos ao abrir a página
carregarAlunos();

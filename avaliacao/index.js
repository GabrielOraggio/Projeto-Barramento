const express = require("express");
const axios = require("axios");
const cors = require("cors"); // Importa o pacote cors
const app = express();

app.use(cors()); // Adiciona o middleware CORS
app.use(express.json());

const funcoes = {
    AvaliacaoCriada: (avaliacao) => {
        // Define o status da avaliação com base na nota
        avaliacao.status =
            avaliacao.nota === 5
                ? "excelente"
                : avaliacao.nota >= 4
                ? "bom"
                : avaliacao.nota >= 3
                ? "regular"
                : avaliacao.nota >= 2
                ? "ruim"
                : "muito ruim";

        // Envia o evento com o status atualizado para o barramento
        axios.post("http://localhost:10000/eventos", {
            tipo: "AvaliacaoClassificada",
            dados: avaliacao,
        });
    },
    AvaliacaoClassificada: (avaliacao) => {
        // Aqui você pode adicionar a lógica para o evento AvaliacaoClassificada
        console.log("Avaliação classificada recebida:", avaliacao);
    },
    LivroCadastrado: (livro) => {
        // Aqui você pode adicionar a lógica que deseja executar ao cadastrar um livro
        console.log("Livro cadastrado:", livro);
        // Por exemplo, você pode armazenar o livro em um banco de dados ou apenas registrar no console
    }
};

app.post("/eventos", (req, res) => {
    const { tipo, dados } = req.body;
    if (funcoes[tipo]) {
        try {
            funcoes[tipo](dados);
            res.status(200).send({ msg: "ok" });
        } catch (err) {
            console.error("Erro ao processar o evento:", err);
            res.status(500).send({ msg: "Erro ao processar o evento" });
        }
    } else {
        console.error(`Função não encontrada para tipo: ${tipo}`);
        res.status(400).send({ msg: `Tipo de evento "${tipo}" não reconhecido.` });
    }
});

app.listen(7000, () =>
    console.log("Classificação de Avaliação de Livros. Porta 7000")
);

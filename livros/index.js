const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

let livros = {};
let idLivro = 0;

app.use(cors()); // Habilita CORS
app.use(bodyParser.json());

// Endpoint para listar livros
app.get("/livros", (req, res) => {
  const livrosArray = Object.values(livros); // Converte o objeto em um array
  console.log("Livros enviados:", livrosArray); // Log para depuração
  res.send(livrosArray);
});

// Endpoint para adicionar um livro
app.put("/livros", async (req, res) => {
  try {
    idLivro++;
    const { titulo, autor } = req.body;

    // Verifica se os campos estão preenchidos
    if (!titulo || !autor) {
      return res.status(400).send({ erro: "Título e autor são obrigatórios" });
    }

    // Adiciona o livro ao objeto de armazenamento em memória
    livros[idLivro] = {
      idLivro,
      titulo,
      autor,
    };

    // Envia o evento de livro cadastrado
    await axios.post("http://localhost:10000/eventos", {
      tipo: "LivroCadastrado",
      dados: {
        idLivro,
        titulo,
        autor,
      },
    }).catch(error => console.error("Erro ao enviar evento:", error)); // Captura erros no envio do evento

    console.log("Livro cadastrado:", livros[idLivro]); // Log para depuração
    res.status(201).send(livros[idLivro]);

  } catch (error) {
    console.error("Erro ao adicionar livro:", error);
    res.status(500).send({ erro: "Erro ao adicionar livro" });
  }
});

// Endpoint para receber eventos
app.post("/eventos", (req, res) => {
  console.log("Evento recebido:", req.body); // Log para depuração
  res.status(200).send({ msg: "ok" });
});

// Inicializa o servidor
const PORT = 4000; // Porta do servidor
app.listen(PORT, () => {
  console.log("Servidor rodando na porta ${PORT}");
});
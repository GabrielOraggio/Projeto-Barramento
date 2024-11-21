const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const eventos = [];

const app = express();
app.use(bodyParser.json());

// Endpoint para receber eventos
app.post("/eventos", async (req, res) => {
  const evento = req.body;
  
  // Log do evento recebido
  console.log("Evento recebido:", evento);
  
  // Armazena o evento no array
  eventos.push(evento);

  // Função para enviar evento com tratamento de erros
  const enviarEvento = async (url) => {
    try {
      console.log(`Enviando evento para ${url}...`);
      await axios.post(url, evento);
      console.log(`Evento enviado para ${url} com sucesso.`);
    } catch (error) {
      console.error(`Erro ao enviar evento para ${url}:`, error.message);
    }
  };

  // Envia o evento para cada microsserviço
  await Promise.all([
    enviarEvento("http://localhost:4000/eventos"), // microsserviço de livros
    // enviarEvento("http://localhost:5000/eventos"), // microsserviço de observações
    enviarEvento("http://localhost:6000/eventos"), // microsserviço de consulta-livro
    enviarEvento("http://localhost:7000/eventos")  // microsserviço de avaliação
  ]);

  res.status(200).send({ msg: "ok" });
});

// Endpoint para listar eventos recebidos
app.get("/eventos", (req, res) => {
  res.send(eventos);
});

// Inicializa o servidor
app.listen(10000, () => {
  console.log("Barramento de eventos. Porta 10000.");
});

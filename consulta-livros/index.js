const express = require("express");
const axios = require("axios")
const app = express();

app.use(express.json());

baseConsulta = {};
let livros = {};

const funcoes = {
    LembreteCriado: (lembrete) => {
    baseConsulta[lembrete.contador] = lembrete;
    },
    ObservacaoCriada: (observacao) => {
    const observacoes =
    baseConsulta[observacao.lembreteId]["observacoes"] ||
    [];
    observacoes.push(observacao);
    baseConsulta[observacao.lembreteId]["observacoes"] =
    observacoes;
    },
    
    ObservacaoAtualizada: (observacao) => {
     const observacoes = baseConsulta[observacao.lembreteId]["observacoes"];
     const indice = observacoes.findIndex((o) => o.id === observacao.id);
     observacoes[indice] = observacao;
     },
    };
    


app.get("/livros", (req, res) => {
  const livrosArray = Object.values(livros); // Converte o objeto em um array
  console.log("Livros enviados:", livrosArray); // Log para depuração
  res.send(livrosArray);
});
        
app.post("/eventos", (req, res) => {
    try {
    funcoes[req.body.tipo](req.body.dados);
    } catch (err) {}
    res.status(200).send({ msg: "ok" });
 });

app.listen(6000, async () => {
console.log("Consultas. Porta 6000")
const resp = await
axios.get("http://localhost:10000/eventos");
//axios entrega os dados na propriedade data
resp.data.forEach((valor, indice, colecao) => {
try {
funcoes[valor.tipo](valor.dados);
} catch (err) {}
});
});
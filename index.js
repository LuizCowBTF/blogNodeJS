/* EXPRESS EJS e BIBLIOTECAS */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const Pergunta = require("./database/models/Pergunta");
const Resposta = require("./database/models/Resposta");

//DATABASE
const connection = require("./database/database");
connection
   .authenticate()
   .then(() => {console.log("Conexão realizada!");})
   .catch((msgErro) => {console.log(msgErro);})

/* FIM AREA EXPRESS EJS E BIBLIOTECAS */

/* START ENGINE */
app.set('view engine','ejs');
app.use(express.static('assets'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
/* FIM AREA START ENGINE  */

/* INICIA A VIEW PRINCIPAL -- index */
app.get("/",(req, res) => {
   res.render("index",{});
});

/* AREA DE ROTAS */
/* PAGINA BLOG */
app.get("/blog",(req, res) => {
   Pergunta.findAll({ raw: true, order:[
      ['id', 'DESC']  //  ASC == ascendentes ou DESC == descendentes
   ] }).then( perguntas => {
      res.render("blog",{
         perguntas: perguntas
      });
   });
});

app.post("/salvarBlog",(req, res) => {
   var nome = req.body.nome;
   var titulo = req.body.titulo;
   var mensagem = req.body.mensagem;

   /* INSERCAO DADOS NA TABELA */
   Pergunta.create({
      nome: nome,
      titulo: titulo,
      mensagem: mensagem
   }).then(() => {
      res.redirect("blog");
   })
});

app.get("/blog/:id",(req, res) => {
   var id = req.params.id;
   Pergunta.findOne({
      where: {id: id}
   }).then(pergunta => {
      if(pergunta != undefined){
         Resposta.findAll({
            where: {perguntaId: pergunta.id},
            order: ['id','DESC']
         }).then(respostas => {
            res.render("perguntaDetail", {
               pergunta: pergunta,
               respostas: respostas
            });
         });
      }else {
         res.redirect("/blog")
      }
   })
})

app.post("/responder",(req, res) => {
   var corpo = req.body.corpo;
   var perguntaId = req.body.pergunta;
   Resposta.create({
      corpo: corpo,
      perguntaId: perguntaId
   }).then(() => {
      res.redirect("/blog/" + perguntaId)
   })
})
/* FIM PAGINA BLOG */


/* PAGINA PRODUTOS */ 
app.get("/produtos",(req, res) => {
   res.render("produtos",{});
});
/* FIM PAGINA PRODUTOS */


/* PAGINA MEU CARRINHO */
app.get("/carrinho",(req, res) => {
   res.render("carrinho",{});
});
/* FIM PAGINA MEU CARRINHO */
/* FIM AREA DE ROTAS */


/* STARTA O SERVIDOR */
app.listen(8080, () => {console.log("App rodando.");});
/* FIM AREA DO SERVIDOR */
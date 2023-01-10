const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const bodyParse = require('body-parser');
const mysql = require('mysql2/promise');
const { chownSync } = require('fs');

const PORT = process.env.PORT || 3000;
const app = express();

app.engine('handlebars', expressHandlebars.engine());

app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParse.urlencoded({ extended: true }));

// função que vai abrir e retornar a conexão com o banco de dados
async function getConnection() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Vilel@2002',
        database: 'PeladaAmigos'
    });
    return connection;
}

async function query(sql = '', values = []) {
    const conn = await getConnection();
    const result = await conn.query(sql, values);
    conn.end();

    return result[0];
}

app.get('/', function (req, res) {
    res.render('inicio', {
        tituloPagina: 'Esta é a página sobre',
        nome: 'Vitor',
        idade: 20
    });
});

app.get('/novaPartida', function (req, res) {
    res.render('novaPartida');
});

app.post('/novaPartida', async function (req, res) {
    console.log("Cadastro realizado com sucesso!")
    res.render("inicio");

    const result = { golsUnited, golsCity } = req.body;
    let novoNumVitoria, nome;
    if (golsUnited > golsCity) {
        nome = "Manchester United"
    } else { 
        nome = "Manchester City"
    }

    const sql = "INSERT INTO partida SET nomeTimeA = ?, golsTimeA = ?, nomeTimeB = ?, golsTimeB = ?";
    const valores = ["Manchester United", golsUnited, "Manchester City", golsCity];
    await query(sql, valores);

    const dadosTime = await query("SELECT * FROM times WHERE nome = ?", nome);
    novoNumVitoria = parseInt(dadosTime[0]['numeroDeVitorias']);
    novoNumVitoria++;

    const sql2 = "UPDATE times SET nome = ?, numJogadores = ?, numeroDeVitorias = ? WHERE nome = ?";
    const valores2 = [dadosTime[0]['nome'], 9, novoNumVitoria, dadosTime[0]['nome']];
    await query(sql2, valores2);

})
/*
// CREATE
app.post('/adicionar-quarto', async function (req, res) {
    let numero = req.body.numero;
    let moveis = req.body.moveis;
    let preco = req.body.oferta;
    let descricao = req.body.tipo;
    let cnpj = req.body.cnpj;

    const dadosPagina = {
        tituloPagina: 'Cadastro',
        mensagem: '',
        numero,
        moveis,
        preco,
        descricao,
        cnpj
    }

    const valores = [numero, moveis, preco, descricao, cnpj];
    console.log(valores);

    const sql = "INSERT INTO quartos (numero , moveis, oferta , tipo , cnpj) VALUES (?,?,?,?,?)"
    
    await query(sql, valores);
    console.log(valores);

    dadosPagina.mensagem = 'Produto cadastrado com sucesso';
    dadosPagina.cor = "green";

    res.render('adicionar-quarto', dadosPagina);
});

//READ
app.get('/', async function (req, res) {

    const quartos = await query("SELECT * FROM quartos")
    res.render('home', {
        tituloPagina: 'Bem-vindo(a) ao meu site!',
        listaClientes: quartos
    });

    console.log(quartos)
});

//UPDATE
app.get('/editar-clientes', async function (req, res) {
    const id = parseInt(req.query.id);
    const dadosCliente = await query("SELECT * FROM clientes WHERE id = ?", [id]);
    console.log(dadosCliente);
    if (dadosCliente === 0) {
        res.redirect("/");
    }
    res.render('editar-clientes', {
        tituloPagina: "Editar Produto",
        id: dadosCliente[0].id,
        cpf: dadosCliente[0].cpf,
        nome: dadosCliente[0].nome,
        endereco: dadosCliente[0].endereco,
        contato: dadosCliente[0].contato,
    })
});

app.post('/editar-clientes', async function (req, res) {

    let{id, cpf, nome, endereco, contato} = req.body;
    
    const dadosPagina = {
        tituloPagina: 'Editar Cliente',
        mensagem:'',
        id,cpf,nome,endereco,contato
    }

    const sql = "UPDATE clientes SET cpf = ?, nome = ?, endereco = ?, contato = ? WHERE id = ?";
    const valores = [cpf, nome, endereco, contato, id];

    await query(sql, valores);
    
    res.render('editar-clientes', dadosPagina, {layout : 'hero'});
});

//DELETE
app.get('/excluir-clientes', async function (req, res) {

    const numero = parseInt(req.query.numero);
    console.log(numero);

    if (!isNaN(numero) && numero > 0) {
        await query(`DELETE FROM quartos WHERE numero = ?`, [numero]);
        console.log("Deletei o " + numero);
    }
    console.log("nao achei");
    res.redirect('/');

})

*/

app.listen(PORT, function () {
    console.log("Server rodando na porta 3000");
})



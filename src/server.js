const express = require("express")
/*função faz um pedido do express, e retorna ele na variavel*/
const server = express()
// server - objeto 

//pegar o banco de dados
const db = require("./database/db")

//ligar o servidor 
 server.listen(3000)  //3000 é a porta

//configurar pasta pública
server.use(express.static("public"))

//habilitar o req.body na aplicação
/* o express por padrão não tem o req.body habilitado*/
server.use(express.urlencoded({extended: true}))


//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//configurar caminhos(rotas) da aplicação
// página inicial
// req: requisição (pedido) e res: resposta

server.get("/", (req, res) => {
    return res.render("index.html")
    //enviando um doc/arquivo para o servidor
})

server.get("/create-point", (req, res) => {
    
    //req.query = query strings da url
    console.log(req.query)

    return res.render("create-point.html")
    //enviando um doc/arquivo para o servidor
})

server.post("/savepoint", (req, res) => {
    
    //req.body: o corpo do nosso formulário
    // console.log(req.body)

    //inserir dados no banco de dados

    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            itens
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.itens
    ] 
    
    
    function afterInsertData(err){
        if (err) {
             console.log(err);
             return res.send("Erro no cadastro!");
        }

        console.log("Cadastrado com sucesso");
        console.log(this);

        return res.render("create-point.html", { saved: true});
    } 

    db.run(query, values, afterInsertData);
    
} )

server.get("/search", (req, res) => {
   
    const search = req.query.search;

    if(search == ""){
        //pesquisa vazia
        return res.render("search-results.html", { total: 0});
    }

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if (err) {
            return console.log(err);
        }  

        const total = rows.length;

        //mostrar a página html com os dados do db
        return res.render("search-results.html", {places: rows, total: total})
    })

})



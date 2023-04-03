# dog_sitting
PASSEIO AMIGO API
Este é o repositório da API PASSEIO AMIGO, uma aplicação desenvolvida em JavaScript, Nodejs, Expressjs e Mongodb, com o objetivo de hospedar cães. A aplicação permite que os usuários registrem suas informações e as informações de seus cães, além de reservar pernoites para seus cães em uma hospedagem com um limitador de vagas.

##Funcionalidades
Cadastro de usuários: lida com autenticação e gerenciamento de usuários.
Cadastro de cães: lida com o registro de animais no banco de dados.
Reservas: lida com o agendamento de pernoites para os cães, com verificações padrões de consistências e autorizações.
Configurações do administrador: responsável por adicionar ou editar configurações de reserva.

##Technical Debt
Algumas funcionalidades precisam de melhorias para garantir a qualidade e a segurança do código. Estes são os itens de technical debt que precisam ser abordados:
  Incluir validações de entrada mais rigorosas em algumas funções, como register e updateUser, para garantir que os dados inseridos pelo usuário estejam formatados corretamente.
  Incluir uma funcionalidade de pesquisa para que os usuários possam buscar por dados de seus cães e o administrador possa buscar por dados de um cão específico.
  Criar funções separadas para verificar se a data inserida é uma data válida e se está no futuro, em vez de fazer isso dentro da função addBooking.
  Reestruturar as configurações do administrador para criar mais opções de modificações no código, como preço com desconto e dias com valores menores.
  
##Instalação e Configuração
Para executar o projeto localmente, é necessário ter o Nodejs e o MongoDB instalados na sua máquina. Siga os passos abaixo para instalar e configurar o projeto:

  Clone o repositório para a sua máquina local.
  Na pasta do projeto, execute npm install para instalar as dependências do projeto.
  Configure as variáveis de ambiente no arquivo .env. Use o arquivo .env.example como modelo.

    Dependências
    bcryptjs: "^2.4.3"
    colors: "^1.4.0"
    cookie-parser: "^1.4.6"
    dotenv: "^16.0.3"
    express: "^4.18.2"
    express-fileupload: "^1.2.1"
    jsonwebtoken: "^9.0.0"
    moment: "^2.29.4"
    mongoose: "^7.0.1"
    morgan: "^1.10.0"
    node-geocoder: "^4.2.0"
    remove-function: "^1.0.3"
    slugify: "^1.6.5"
    uuid: "^9.0.0"
    Scripts

Execute npm run server para iniciar a aplicação.
Acesse http://localhost:4000 para utilizar a API.

##COMO INICIAR AS FUNCIONALIDADES
Comece usando a função addBookingConfig na rota pelo metodo POST na rota api/v1/bookingConfig para que seja cadastrado os dados que serão consumidos durante as reservas.

Documentação
Para mais informações sobre a utilização da API e suas rotas, consulte a documentação completa em https://documenter.getpostman.com/view/19134738/2s93RUvXeX

Licença
Este projeto é licenciado sob a licença MIT. Consulte o arquivo LICENSE para mais informações.


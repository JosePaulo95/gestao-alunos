# gestao-alunos
Plataforma web para gerenciamento de cursos e alunos. 

# Executar frontend
O frontend foi feito com Vue e é em arquivo, então basta abrir o arquivo index.html no navegador e ter acesso a internet para download das bibliotecas via cdn. A api consumida é uma api de mockup não vinculada ao backend.
## Por onde começar
Se você vai mexer nesse código é bom que saiba Vue (https://vuejs.org/).
Mas de modo geral, são apenas dois arquivos de importancia para os dados. Index.html na raiz para apresentação e saviani.js no diretório "/js" que implementa as funções Vue para manuseio dos dados. Explicando um pouco sobre o código, o atributo 'menus' guarda as ids das abas que aparecem no menu lateral. Essas mesmas ids são usadas como chaves em outras estruturas e assim são usadas para o Vue saber que dados ler, que formulários apresentar e que labels repassar, por exemplo. Para uma aba nova aparecer, ela precisa ser listada no 'menus' e especificada em 'abas' (label, tipo, dados e colunas).
## Testes
Os testes são executados automaticamente mas podem ser desabilitados manualmente na função Mounted() do arquivo Saviani.js.

# Executar backend
O backend foi feito com Adonis, um framework Node.js (https://adonisjs.com/).
## Por onde começar
Para instalar, é preciso setar um arquivo localizado na raiz o '.env' com as configurações do seu banco (tem um .env.example para ajudar). Com isso, deve ser suficiente ter as bibliotecas instaladas no seu computador na versão mais recente (mas irei listar abaixo as que usei) e executar 'npm install'. O serviço pode ser levantado usando 'adonis serve --dev'. Após isso, as rotas podem ser amigavelmente consultadas em http://localhost:3333/docs através do Swagger (https://swagger.io/).
## Versões
Para referencias,
Node: 12.18.3
Npm: 6.14.6
Adonis: 4.1.0
## Testes
Dentro do projeto, você pode executar 'adonis test functional'.

Código livre e em estado incompleto.

var App = new Vue({
  el: "#app",
  data() {
    return {
      aba_id_selecionada: null,
      menus: [
        {
          "label": "Gerência",
          "id": "gerencia",
          "abas_id": ["usuarios", "acessos"]
        },
        {
          "label": "Acadêmico",
          "id": "academico",
          "abas_id": ["cursos", "alunos"]
        }
      ],
      abas:{
        "usuarios": {label: "Usuários"},
        "acessos": {label: "Acessos"},
        "cursos": {
          label: "Cursos",
          tipo: "listagem",
          dados: [
            { 'codigo': 1, 'nome': 'Medicina', 'created_at': '2016-10-15 13:43:27', 'carga_horaria': 360 },
            { 'codigo': 2, 'nome': 'Farmácia', 'created_at': '2016-12-15 06:00:53', 'carga_horaria': 40 },
            { 'codigo': 3, 'nome': 'Direito', 'created_at': '2016-04-26 06:26:28', 'carga_horaria': 700 },
          ],
          colunas: [
            {
              field: 'codigo',
              label: 'Código',
              width: '40',
              numeric: true
            },
            {
              searchable: true,
              field: 'nome',
              label: 'Nome',
            },
            {
              field: 'carga_horaria',
              label: 'Carga horária',
              numeric: true
            },
            {
              field: 'created_at',
              label: 'Data de cadastro',
              centered: true
            }
          ]
        },
        "alunos": {
          label: "Alunos",
          tipo: "listagem",
          dados: [
            { 'id': 1, 'nome': 'Jesse', 'cpf': '008.192.019-12', 'endereco': 'rua 12 Vinhais casa 34 São Luís-MA', 'cep': '65000-000', 'email': 'Jesse@gmail.com', 'telefone': '9189-1920'},
            { 'id': 2, 'nome': 'John', 'cpf': '008.192.019-12', 'endereco': 'rua 12 Vinhais casa 34 São Luís-MA', 'cep': '65000-000', 'email': 'John@gmail.com', 'telefone': '9189-1920'},
            { 'id': 3, 'nome': 'Tina', 'cpf': '008.192.019-12', 'endereco': 'rua 12 Vinhais casa 34 São Luís-MA', 'cep': '65000-000', 'email': 'Tina@gmail.com', 'telefone': '9189-1920'},
            { 'id': 4, 'nome': 'Clarence', 'cpf': '008.192.019-12', 'endereco': 'rua 12 Vinhais casa 34 São Luís-MA', 'cep': '65000-000', 'email': 'Clarence@gmail.com', 'telefone': '9189-1920'},
            { 'id': 5, 'nome': 'Anne', 'cpf': '008.192.019-12', 'endereco': 'rua 12 Vinhais casa 34 São Luís-MA', 'cep': '65000-000', 'email': 'Anne@gmail.com', 'telefone': '9189-1920' }
          ],
          colunas: [
            {
              field: 'id',
              label: 'Código',
              width: '40',
              numeric: true
            },
            {
              searchable: true,
              field: 'nome',
              label: 'Nome',
            },
            {
              field: 'telefone',
              label: 'Telefone',
            }
          ]
        },
        "cadastrar-cursos": {label: "Cadastro de curso", tipo: "cadastro"},
        "cadastrar-alunos": {label: "Cadastro de aluno", tipo: "cadastro"}
      },
      
    }
  },
  mounted(){
    this.runTests();
    this.selecionarAba("cursos")
  },    
  computed: {
    
  },
  methods: {
    selecionarAba(aba_id){
      console.log(aba_id)
      this.aba_id_selecionada = aba_id;
    },
    ehAbaSelecionada(aba_id){
      return aba_id == this.aba_id_selecionada;
    },
    getAba(aba_id){
      return this.abas[aba_id];
    },
    getTituloAbaAtual(){
      let aba_atual = this.getAba(this.aba_id_selecionada); 
      if(aba_atual){
        return aba_atual.label;
      }else{
        return '';
      }
    },
    getDadosAbaAtual(){
      let aba_atual = this.getAba(this.aba_id_selecionada); 
      if(aba_atual){
        return aba_atual.dados;
      }else{
        return [];
      }
    },
    getColunasAbaAtual(){
      let aba_atual = this.getAba(this.aba_id_selecionada); 
      if(aba_atual){
        return aba_atual.colunas;
      }else{
        return [];
      }
    },
    getTipoAbaAtual(){
      let aba_atual = this.getAba(this.aba_id_selecionada); 
      if(aba_atual){
        return aba_atual.tipo;
      }else{
        return [];
      }
    },
    criarCurso(){
      var form = document.getElementById('criar-curso-form');
      var nome_input = document.getElementById('criar-nome-curso');
      var codigo_input = document.getElementById('criar-codigo-curso');

      var nomes_repetidos = this.abas["cursos"].dados.filter(function (curso) {
        return curso.nome === nome_input.value
      })
      var codigos_repetidos = this.abas["cursos"].dados.filter(function (curso) {
        return curso.codigo === codigo_input.value
      })

      if (nomes_repetidos.length>0) {
        nome_input.setCustomValidity("Já existe um curso com o nome "+nome_input.value);
      }else{
        nome_input.setCustomValidity("");//tem q resetar
      }
      if (codigos_repetidos.length>0) {
        codigo_input.setCustomValidity("Já existe um curso com este código.");
      }else{
        codigo_input.setCustomValidity("");//tem q resetar
      }      
      if(form.checkValidity()){
        const codigo =        document.getElementById('criar-codigo-curso').value;
        const nome =          document.getElementById('criar-nome-curso').value;
        const carga_horaria = document.getElementById('criar-carga-curso').value;
        const dt_criacao =    moment().locale("pt-BR").format("L LT");
        
        let novo_curso = {
          codigo: codigo,
          nome: nome,
          carga_horaria: carga_horaria,
          created_at: dt_criacao
        };
        this.abas["cursos"].dados.push(novo_curso)
        this.$buefy.dialog.confirm({
          title: 'Curso cadastrado!',
          message: 'O curso '+nome+' ('+carga_horaria+'h) foi criado com sucesso. O que você deseja fazer?',
          cancelText: 'Cadastrar outro curso',
          confirmText: 'Ir para lista de cursos',
          type: 'is-success',
          onConfirm: () => this.selecionarAba("cursos"),
          onCancel: () => this.$buefy.toast.open('User disagreed')
        })
      }
    },
    runTests(){
      this.is_testing = true;
      runNavigationTests(this);
      this.is_testing = false;
    }
  }
});

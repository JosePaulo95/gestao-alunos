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
          dados: [
            { 'codigo': 1, 'nome': 'Medicina', 'date': '2016-10-15 13:43:27', 'carga_horaria': 360 },
            { 'codigo': 2, 'nome': 'Farmácia', 'date': '2016-12-15 06:00:53', 'carga_horaria': 40 },
            { 'codigo': 3, 'nome': 'Direito', 'date': '2016-04-26 06:26:28', 'carga_horaria': 700 },
          ],
          colunas: [
            {
              field: 'codigo',
              label: 'Código',
              width: '40',
              numeric: true
            },
            {
              field: 'nome',
              label: 'Nome',
            },
            {
              field: 'carga_horaria',
              label: 'Carga horária',
              numeric: true
            },
            {
              field: 'date',
              label: 'Data de cadastro',
              centered: true
            }
          ]
        },
        "alunos": {
          label: "Alunos",
          dados: [
            { 'id': 1, 'first_name': 'Jesse', 'last_name': 'Simmons', 'date': '2016-10-15 13:43:27', 'gender': 'Male' },
            { 'id': 2, 'first_name': 'John', 'last_name': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male' },
            { 'id': 3, 'first_name': 'Tina', 'last_name': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female' },
            { 'id': 4, 'first_name': 'Clarence', 'last_name': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male' },
            { 'id': 5, 'first_name': 'Anne', 'last_name': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female' }
          ],
          colunas: [
            {
              field: 'id',
              label: 'ID',
              width: '40',
              numeric: true
            },
            {
              field: 'first_name',
              label: 'First Name',
            },
            {
              field: 'last_name',
              label: 'Last Name',
            },
            {
              field: 'date',
              label: 'Date',
              centered: true
            },
            {
              field: 'gender',
              label: 'Gender',
            }
          ]
        }
      },
      
    }
  },
  mounted(){
    this.runTests();
    this.selecionarAba("cursos")
  },    
  computed: {
    filteredCards() {
      var _this = this
      if(this.search.length === 0) return this.cards
      return this.cards.map(function(card) {
        return {
          name: card.name,
          cardColor: card.cardColor,
          items: card.items.filter(function (item) {
            return item.includes(_this.search)
          })
        }
      })
    }
  },
  
  methods: {
    selecionarAba(aba_id){
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
        console.log(aba_atual.colunas)
        return aba_atual.colunas;
      }else{
        return [];
      }
    },
    runTests(){
      this.is_testing = true;
      runNavigationTests(this);
      this.is_testing = false;
    }
  }
});

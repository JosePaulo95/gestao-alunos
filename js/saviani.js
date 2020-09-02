var App = new Vue({
  el: "#app",
  data() {
    return {
      aba_selecionada: null,
      menus: [
        {
          "label": "Gerência",
          "id": "gerencia",
          "items": [
            {
              "label": "Usuários",
              "id": "usuarios"
            },
            {
              "label": "Acessos",
              "id": "acessos"
            }
          ]
        },
        {
          "label": "Acadêmico",
          "id": "academico",
          "items": [
            {
              "label": "Cursos",
              "id": "cursos"
            },
            {
              "label": "Alunos",
              "id": "alunos"
            }
          ]
        }
      ],
      cursos: [
        {
          nome: "Medicina"
        },
        {
          nome: "Computação"
        },
        {
          nome: "Farmácia"
        }
      ],
      data: [
          { 'id': 1, 'first_name': 'Jesse', 'last_name': 'Simmons', 'date': '2016-10-15 13:43:27', 'gender': 'Male' },
          { 'id': 2, 'first_name': 'John', 'last_name': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male' },
          { 'id': 3, 'first_name': 'Tina', 'last_name': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female' },
          { 'id': 4, 'first_name': 'Clarence', 'last_name': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male' },
          { 'id': 5, 'first_name': 'Anne', 'last_name': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female' }
      ],
      columns: [
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
  mounted(){
    this.runTests();
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
      this.aba_selecionada = aba_id;
    },
    ehAbaSelecionada(aba_id){
      return aba_id == this.aba_selecionada;
    },
    runTests(){
      this.is_testing = true;
      runNavigationTests(this);
      this.is_testing = false;
    }
  }
});

function runNavigationTests(context) {
  console.assert(selecionarAbaDeixaItemAtivo.call(context), "selecionarAbaDeixaItemAtivo");
  console.assert(tituloDoContainerEhReativo.call(context), "tituloDoContainerEhReativo");
  //console.assert(conteudoCursosEAlunosEhReativo.call(context), "conteudoCursosEAlunosEhReativo");
}
function selecionarAbaDeixaItemAtivo() {
  this.selecionarAba("cursos");

  if(!this.ehAbaSelecionada("cursos") || this.ehAbaSelecionada("alunos")){
    return false;
  }

  this.selecionarAba("meu-perfil");

  if(!this.ehAbaSelecionada("meu-perfil") || this.ehAbaSelecionada("cursos")){
    return false;
  }

  return true;
}
function tituloDoContainerEhReativo() {
  this.selecionarAba("cursos");

  if(this.getTituloAbaAtual() != "Cursos"){
    return false;
  }

  this.selecionarAba("alunos");

  if(this.getTituloAbaAtual() != "Alunos"){
    return false;
  }

  return true; 
}
function conteudoCursosEAlunosEhReativo() {
  //this.selecionarAba("cursos");
}
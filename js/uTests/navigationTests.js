function runNavigationTests(context) {
  console.assert(selecionarAbaDeixaItemAtivo.call(context), "selecionarAbaDeixaItemAtivo");
  //console.assert(selecionarAbaMudaTituloDoContainer.call(context), "selecionarAbaMudaTituloDoContainer");
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
function selecionarAbaMudaTituloDoContainer() {
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
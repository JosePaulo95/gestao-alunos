function runNavigationTests(context) {
  console.assert(selecionarAbaDeixaItemAtivo.call(context), "selecionarAbaDeixaItemAtivo");
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

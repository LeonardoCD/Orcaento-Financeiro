//Classe despesa
class Despesa{
  constructor(ano, mes, dia, tipo, descricao, valor){
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor
  }

  //Verifica os dados passados antes de inserir
  validarDados(){
    for(let i in this){
      if(this[i] == undefined || this[i] == '' || this[i] == null){
        return false
      }
    }
    return true
  }
}

class Bd{

  constructor(){
    let id = localStorage.getItem('id')

    if(id === null){
      localStorage.setItem('id', 0)
    }
  }

  getProximoId(){
    let proximoId = localStorage.getItem('id')
    return parseInt(proximoId) + 1
  }

  gravar(d) {
    let id = this.getProximoId()

    localStorage.setItem(id, JSON.stringify(d))

    localStorage.setItem('id', id)
  }

  //Recuperar todas as despesas cadastradas em Local Storage
  recuperarTodosRegistros(){

    //array de despesas
    let despesas = Array()

    //pegar o id
    let id = localStorage.getItem('id')

    for(let i = 1; i <= id; i++){
      let despesa = JSON.parse(localStorage.getItem(i))

      //verifica se há id nulo e pula tal id
      if(despesa === null){
        continue
      }

      despesa.id = i
      despesas.push(despesa)
    }
    return despesas
  }

  pesquisar(despesa){

    let despesasFiltradas = Array()

    despesasFiltradas = this.recuperarTodosRegistros()
    
    //Filtros
    //ANO
    if(despesa.ano != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
    }

    //MÊS
    if(despesa.mes != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
    }

    //DIA
    if(despesa.dia != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
    }

    //TIPO
    if(despesa.tipo != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
    }

    //DESCRIÇÃO
    if(despesa.descricao != ''){
      despesasFiltradas = despesasFiltradas.
        filter(d => d.descricao == despesa.descricao)
    }
    
    //VALOR
    if(despesa.valor != ''){
      despesasFiltradas = despesasFiltradas.
        filter(d => d.valor == despesa.valor)
    }

    return despesasFiltradas

  }

  remover(id){
    localStorage.removeItem(id)
  }

}

let bd = new Bd()

//Função que faz o cadastro de despesas
function cadastrarDespesa(){
  
  let ano = document.getElementById('ano')
  let mes = document.getElementById('mes')
  let dia = document.getElementById('dia')
  let tipo = document.getElementById('tipo')
  let descricao = document.getElementById('descricao')
  let valor = document.getElementById('valor')

  let despesa = new Despesa(
    ano.value, 
    mes.value, 
    dia.value, 
    tipo.value, 
    descricao.value, 
    valor.value,
  )

  if(despesa.validarDados()){
    //Insere os valores
    bd.gravar(despesa)

    //Edita o título do modal
    document.getElementById('modal_titulo').
    innerHTML = 'Registro inserido com sucesso'

    //Edita a cor do título do modal
    document.getElementById('modal_titulo_div').
    className = 'modal-header text-success'

    //Edita o conteudo ou descrição da despesa
    document.getElementById('modal_conteudo').
    innerHTML = 'Despesa foi cadastrada com sucesso!'

    //Edita o conteudo do Botão
    document.getElementById('modal_btn').innerHTML = 'Voltar'

    //Edita a cor do Botão
    document.getElementById('modal_btn').className = 'btn btn-success'

    //Mostra o modal
    $('#modalRegistraDespesa').modal('show')

    //Limpa os dados nos campos
    ano.value = ''
    mes.value = ''
    dia.value = ''
    tipo.value = ''
    descricao.value = ''
    valor.value = ''

  }else{
    //Edita o título do modal
    document.getElementById('modal_titulo').
    innerHTML = 'Erro na inclusão da despesa'

    //Edita a cor do título do modal
    document.getElementById('modal_titulo_div').
    className = 'modal-header text-danger'

    //Edita o conteudo ou descrição da despesa
    document.getElementById('modal_conteudo').
    innerHTML = 
    'Erro no cadastro da despesa. Verifique se todos os campos foram preenchidos corretamente!'

    //Edita o conteudo do Botão
    document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'

    //Edita a cor do Botão
    document.getElementById('modal_btn').className = 'btn btn-danger'
    
    //Mostra o modal
    $('#modalRegistraDespesa').modal('show')
  }
}


function carregaListaDespesas(despesas = Array(), filtro = false){

  if(despesas.length == 0 && filtro == false){
    despesas = bd.recuperarTodosRegistros()
  }

  //selecionando o elemento tbody da tabela
  let listaDespesas =  document.getElementById('listaDespesas')
  listaDespesas.innerHTML = ''
  
  //percorrendo o array despesas, listando cada dispesa
  despesas.forEach(function(d){

    //criando a linha (tr)
    let linha = listaDespesas.insertRow()

    //criar as colunas (td)
    linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano}`  
    
    //Ajustar o tipo
    switch(d.tipo){
      case '1': d.tipo = 'Alimentação'
        break
      
      case '2': d.tipo = 'Educação'
        break

      case '3': d.tipo = 'Lazer'
        break
      
      case '4': d.tipo = 'Saúde'
        break

      case '5': d.tipo = 'Transporte'
        break
    }

    linha.insertCell(1).innerHTML = d.tipo
    linha.insertCell(2).innerHTML = d.descricao
    linha.insertCell(3).innerHTML = d.valor

    //criar o botão de exclusão
    let btn = document.createElement("button")
    btn.className = 'btn btn-danger'
    btn.innerHTML = '<i class="fas fa-times"></i>'
    btn.id = `id_despesa_${d.id}` 
    btn.onclick = function (){
      //remover a despesa

      let id = this.id.replace('id_despesa_', '')
      
      //alert(id)

      bd.remover(id)

      window.location.reload()
    }
    linha.insertCell(4).append(btn)

  })
}

function pesquisarDespesa(){
  let ano = document.getElementById('ano').value
  let mes = document.getElementById('mes').value
  let dia = document.getElementById('dia').value
  let tipo = document.getElementById('tipo').value
  let descricao = document.getElementById('descricao').value
  let valor = document.getElementById('valor').value

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

  let despesas = bd.pesquisar(despesa)

  carregaListaDespesas(despesas, true)

  
}
import { useState, useEffect } from 'react';
import './App.css';
import Formulario from './Formulario';
import Tabela from './Tabela';

function App() {
  //Objeto produto
  const produto = {
    codigo : 0,
    nome : '',
    marca : ''
  }

  //useState
  const[btnCadastrar, setBtnCadastrar] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [objProduto, setObjProduto] = useState(produto);

  //useEffect
  useEffect(() => {
    fetch("http://localhost:8080/listar")
    .then(retorno => retorno.json())
    .then(retorno_convertido => setProdutos(retorno_convertido));
  }, []);

  //obtendo os dados do formulário
  const aoDigitar = (e) => {
    setObjProduto({...objProduto, [e.target.name] : e.target.value});
  }

  //cadastrar produto
  const cadastrar = () => {
    fetch('http://localhost:8080/cadastrar', {
      method : 'POST',
      body: JSON.stringify(objProduto),
      headers: {
        'Content-type' : 'application/json',
        'Accept' : 'application/json'
      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      
      if(retorno_convertido.mensagem !== undefined){
        alert(retorno_convertido.mensagem);
      }else{
        setProdutos([...produtos, retorno_convertido]);
        alert('Produto cadastrado com sucesso!');
        limparFormulario();
      }
    })
  }

   //remover produto
  const remover = () => {
    fetch('http://localhost:8080/remover'+objProduto.codigo,{
      method : 'delete',
      headers: {
        'Content-type' : 'application/json',
        'Accept' : 'application/json'
      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      
      // MENSAGEM
      alert(retorno_convertido.mensagem);

      // cópia do vetor de produtos
      let vetorTemp = [...produtos];

      //índice
      let indice = vetorTemp.findIndex((p) => {
        return p.codigo === objProduto.codigo;
      });

      //remover produto do vetorTemp
      vetorTemp.splice(indice, 1);

      //atualizar o vetor de produtos
      setProdutos(vetorTemp);

      //limpar formulário
      limparFormulario();

    })
  }


  //cadastrar produto
  const alterar = () => {
    fetch('http://localhost:8080/alterar', {
      method : 'put',
      body: JSON.stringify(objProduto),
      headers: {
        'Content-type' : 'application/json',
        'Accept' : 'application/json'
      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      
      if(retorno_convertido.mensagem !== undefined){
        alert(retorno_convertido.mensagem);
      }else{

        //mensagem
        alert('Produto alterado com sucesso!');

        // cópia do vetor de produtos
        let vetorTemp = [...produtos];

        //índice
        let indice = vetorTemp.findIndex((p) => {
          return p.codigo === objProduto.codigo;
        });

        //alterar produto do vetorTemp
        vetorTemp[indice] = objProduto;

        //atualizar o vetor de produtos
        setProdutos(vetorTemp);

        //limpar o formulário
        limparFormulario();
      }
    })
  }

  //limpar formulário
  const limparFormulario = () => {
    setObjProduto(produto);
    setBtnCadastrar(true);
  }

  //selecionar produto
  const selecionarProduto = (indice) => {
    setObjProduto(produtos[indice]);
    setBtnCadastrar(false);
  }

  //retorno
  return (
    <div>
      
      <Formulario 
      botao={btnCadastrar} 
      eventoTeclado={aoDigitar}
      cadastrar={cadastrar}
      obj={objProduto}
      cancelar={limparFormulario}
      remover={remover}
      alterar={alterar}
      />
      <Tabela vetor={produtos} 
      selecionar={selecionarProduto}
      />
    </div>
  );
}

export default App;

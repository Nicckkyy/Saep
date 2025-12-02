import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Estoque.css";

function Estoque() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([
    { id: 1, nome: "Martelo de Unha", estoque: 50, minimo: 10 },
    { id: 2, nome: "Chave de Fenda", estoque: 8, minimo: 5 }, 
    { id: 3, nome: "Alicate Universal", estoque: 20, minimo: 8 },
    { id: 4, nome: "Serrote Profissional", estoque: 15, minimo: 5 },
  ]);

  const [idProduto, setIdProduto] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [quantidade, setQuantidade] = useState("");
  const [dataMov, setDataMov] = useState("");

  const produtosOrdenados = [...produtos].sort((a, b) => 
    a.nome.localeCompare(b.nome)
  );

  const handleMovimentacao = (e) => {
    e.preventDefault();

    if (!idProduto || !quantidade || !dataMov) {
      alert("Preencha todos os campos!");
      return;
    }

    const qtd = parseInt(quantidade);
    const produtoIndex = produtos.findIndex(p => p.id === parseInt(idProduto));
    const produto = produtos[produtoIndex];

    if (tipo === "entrada") {
      const novosProdutos = [...produtos];
      novosProdutos[produtoIndex].estoque += qtd;
      setProdutos(novosProdutos);
      alert(`Entrada de ${qtd} unidades registrada com sucesso!`);
    } else {
      if (produto.estoque < qtd) {
        alert("Erro: Quantidade indisponível em estoque!");
        return;
      }
      const novoEstoque = produto.estoque - qtd;
      if (novoEstoque < produto.minimo) {
        alert(`⚠️ ALERTA: O produto "${produto.nome}" ficou abaixo do estoque mínimo!\nSaldo Atual: ${novoEstoque} (Mínimo: ${produto.minimo})`);
      } else {
        alert(`Saída de ${qtd} unidades registrada.`);
      }
      const novosProdutos = [...produtos];
      novosProdutos[produtoIndex].estoque = novoEstoque;
      setProdutos(novosProdutos);
    }
    setQuantidade("");
    setDataMov("");
  };

  return (
    <div className="estoque-container">
      <div className="estoque-card">
        
        <header className="estoque-header">
          <button className="btn-voltar" onClick={() => navigate("/dashboard")}>← Voltar</button>
          <h2 className="estoque-title">Gestão de Estoque</h2>
        </header>

        <form onSubmit={handleMovimentacao}>
          <div className="form-group">
            <label>Produto:</label>
            <select 
              className="estoque-select"
              value={idProduto} 
              onChange={(e) => setIdProduto(e.target.value)}
            >
              <option value="">Selecione...</option>
              {produtosOrdenados.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} (Saldo: {p.estoque})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tipo de Movimentação:</label>
            <select 
              className="estoque-select"
              value={tipo} 
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="entrada">Entrada (+)</option>
              <option value="saida">Saída (-)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantidade:</label>
            <input 
              type="number" 
              placeholder="0" 
              className="estoque-input"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Data:</label>
            <input 
              type="date" 
              className="estoque-input"
              value={dataMov}
              onChange={(e) => setDataMov(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-confirmar">Registrar Movimentação</button>
        </form>
      </div>
    </div>
  );
}

export default Estoque;
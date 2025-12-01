import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/Estoque.css";

function Estoque() {
  const navigate = useNavigate();
  const nomeUsuario = localStorage.getItem("usuario_nome") || "Usuário";
  const [produtos, setProdutos] = useState([]);
  const [movimentacao, setMovimentacao] = useState({
    produto_id: "",
    tipo: "entrada",
    quantidade: 0,
    data: "",
  });

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await api.get("/produtos/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdutos(response.data.sort((a, b) => a.nome.localeCompare(b.nome)));
    } catch (error) {
      alert("Erro ao carregar lista de produtos.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !movimentacao.produto_id ||
      movimentacao.quantidade <= 0 ||
      !movimentacao.data
    )
      return alert("Preencha corretamente.");

    const usuarioId = localStorage.getItem("usuario_id");
    if (!usuarioId) {
      navigate("/");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await api.post(
        "/estoque/movimentar/",
        {
          produto: movimentacao.produto_id,
          usuario: usuarioId,
          tipo: movimentacao.tipo,
          quantidade: movimentacao.quantidade,
          data_movimentacao: movimentacao.data,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(
        response.data.alerta_estoque_baixo
          ? "⚠️ ATENÇÃO: Estoque abaixo do mínimo!"
          : "Movimentação registrada com sucesso!"
      );
      navigate("/dashboard");
    } catch (error) {
      alert("Erro ao registrar movimentação.");
    }
  };

  return (
    <div className="page-container">
      <div className="card-form">
        <div className="header-row">
          <button className="btn-voltar" onClick={() => navigate("/dashboard")}>
            ← Voltar
          </button>
          <div style={{ fontWeight: "bold", fontSize: "18px", color: "#333" }}>
            Gestão
          </div>
          <div className="user-info">👤 {nomeUsuario}</div>
        </div>

        <h2 className="page-title">Movimentação de Estoque</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Produto:</label>
            <select
              className="form-control"
              value={movimentacao.produto_id}
              onChange={(e) =>
                setMovimentacao({ ...movimentacao, produto_id: e.target.value })
              }
              required
            >
              <option value="">Selecione...</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} (Estoque: {p.quantidade_estoque})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de Movimentação:</label>
            <select
              className="form-control"
              value={movimentacao.tipo}
              onChange={(e) =>
                setMovimentacao({ ...movimentacao, tipo: e.target.value })
              }
            >
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Quantidade:</label>
            <input
              className="form-control"
              type="number"
              min="1"
              value={movimentacao.quantidade}
              onChange={(e) =>
                setMovimentacao({ ...movimentacao, quantidade: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Data:</label>
            <input
              className="form-control"
              type="datetime-local"
              value={movimentacao.data}
              onChange={(e) =>
                setMovimentacao({ ...movimentacao, data: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" className="btn-registrar">
            Registrar Movimentação
          </button>
        </form>
      </div>
    </div>
  );
}

export default Estoque;

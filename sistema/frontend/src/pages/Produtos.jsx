import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/Produtos.css";

function Produtos() {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    estoque_minimo: "",
  });

  useEffect(() => {
    const nome = localStorage.getItem("usuario_nome");
    if (nome) setNomeUsuario(nome);
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await api.get("/produtos/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdutos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.preco || !form.estoque_minimo)
      return alert("Preencha campos obrigatórios.");

    const token = localStorage.getItem("access_token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (editandoId) {
        await api.put(`/produtos/${editandoId}/`, form, config);
        alert("Produto atualizado!");
      } else {
        await api.post("/produtos/", form, config);
        alert("Produto cadastrado!");
      }
      setForm({ nome: "", descricao: "", preco: "", estoque_minimo: "" });
      setEditandoId(null);
      carregarProdutos();
    } catch (error) {
      alert("Erro ao salvar.");
    }
  };

  const handleEditar = (produto) => {
    setForm({
      nome: produto.nome,
      descricao: produto.descricao || "",
      preco: produto.preco,
      estoque_minimo: produto.estoque_minimo,
    });
    setEditandoId(produto.id);
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Excluir produto?")) {
      try {
        const token = localStorage.getItem("access_token");
        await api.delete(`/produtos/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        carregarProdutos();
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  };

  return (
    <div className="produtos-container">
      <div className="produtos-card">
        <div className="header-row">
          <button
            className="btn btn-voltar"
            onClick={() => navigate("/dashboard")}
          >
            ← Voltar
          </button>
          <h2 className="title">Cadastro de Produtos</h2>
          <div className="user-info">👤 {nomeUsuario}</div>
        </div>

        <div className="form-wrapper">
          <h3 className="sub-title">
            {editandoId ? "Editar Produto" : "Novo Produto"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="input-grid">
              <input
                className="input-field"
                placeholder="Nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
              <input
                className="input-field"
                placeholder="Descrição"
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
              />
              <input
                className="input-field"
                type="number"
                step="0.01"
                placeholder="Preço"
                value={form.preco}
                onChange={(e) => setForm({ ...form, preco: e.target.value })}
                required
              />
              <input
                className="input-field"
                type="number"
                placeholder="Estoque Mínimo"
                value={form.estoque_minimo}
                onChange={(e) =>
                  setForm({ ...form, estoque_minimo: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              className={`btn ${editandoId ? "btn-warning" : "btn-success"}`}
            >
              {editandoId ? "Salvar Alterações" : "Cadastrar"}
            </button>

            {editandoId && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  setEditandoId(null);
                  setForm({
                    nome: "",
                    descricao: "",
                    preco: "",
                    estoque_minimo: "",
                  });
                }}
              >
                Cancelar
              </button>
            )}
          </form>
        </div>

        <div className="search-box">
          <input
            className="input-field"
            style={{ maxWidth: "300px" }}
            placeholder="Buscar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Estoque Atual</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.length > 0 ? (
              produtosFiltrados.map((prod) => (
                <tr key={prod.id}>
                  <td>{prod.id}</td>
                  <td>{prod.nome}</td>
                  <td>R$ {parseFloat(prod.preco).toFixed(2)}</td>
                  <td>{prod.quantidade_estoque}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-sm btn-warning"
                        onClick={() => handleEditar(prod)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-sm btn-danger"
                        onClick={() => handleExcluir(prod.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Produtos;

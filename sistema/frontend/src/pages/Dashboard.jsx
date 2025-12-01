import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const nomeUsuario = localStorage.getItem("usuario_nome") || "Usuário";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dash-container">
      <div className="dash-card">
        <header className="dash-header">
          <h3 className="welcome-text">Bem-vindo, {nomeUsuario}</h3>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </header>

        <div className="title-section">
          <h1 className="main-title">Painel de Controle</h1>
          <p className="sub-title">
            Selecione uma opção para gerenciar o sistema
          </p>
        </div>

        <div className="menu-grid">
          <div className="menu-button" onClick={() => navigate("/produtos")}>
            <span className="icon">📦</span>
            <h4 className="btn-text">Cadastro de Produtos</h4>
          </div>

          <div className="menu-button" onClick={() => navigate("/estoque")}>
            <span className="icon">📊</span>
            <h4 className="btn-text">Gestão de Estoque</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

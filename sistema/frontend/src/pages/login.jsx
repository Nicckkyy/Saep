import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/Login.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const response = await api.post("/login/", { username, password });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("usuario_nome", response.data.nome);
      localStorage.setItem("usuario_id", response.data.id);
      navigate("/dashboard");
    } catch (error) {
      setErro(error.response?.data?.error || "Erro de conexão.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Bem-vindo</h2>
        <p className="login-subtitle">Acesso ao Sistema SAEP</p>

        {erro && <div className="error-message">{erro}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Usuário</label>
            <input
              type="text"
              placeholder="Ex: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-login" disabled={carregando}>
            {carregando ? "Entrando..." : "Acessar Sistema"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

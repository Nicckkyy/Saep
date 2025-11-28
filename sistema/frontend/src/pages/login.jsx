import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      [cite_start]; // Tenta logar na nossa API Python [cite: 53]
      const response = await api.post("/login/", { email, senha });

      // Se der certo, salva os dados e vai para o dashboard
      localStorage.setItem("usuario", JSON.stringify(response.data));
      navigate("/dashboard");
    } catch (error) {
      setErro("Falha na autenticação: Verifique seus dados.");
      setSenha("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <h2>Login do Almoxarifado</h2>
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          gap: "10px",
        }}
      >
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}

export default Login;

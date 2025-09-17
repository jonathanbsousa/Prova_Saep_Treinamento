import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const logar = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username: username,
        password: password,
      });
      console.log("Token Login", response.data.access);
      localStorage.setItem("token", response.data.access);
      navigate("/");
    } catch (error) {
      console.error("Erro ao Logar:", error.response?.data || error.message);
      console.log(error.response.data);
    }
  };

  return (
    <form className="formLogin">
        
    </form>
  );
}

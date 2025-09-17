import { Link } from "react-router-dom"

export function BarraNavegacao() {
    return (
        <nav className="barra">
            <ul>
                <a href="cadUsuario"><li> Cadastro de Usuario</li></a>
                <a href="cadTarefa"><li> Cadastro de Tarefas</li></a>
                <a href=""><li> Gerenciamento de Tarefas</li></a>
            </ul>
        </nav>
    )
}
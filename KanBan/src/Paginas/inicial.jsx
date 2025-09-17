import Cabecalho from "../components/Cabecalho";
import { Outlet } from "react-router-dom";
import '../styles/main.scss'
import Quadro from "../components/Quadro";
import '../styles/Inicial.scss';

export function Inicial(){
    return(
        <>  
            <Cabecalho/>
            <Quadro/> 
            <Outlet/>
        </>
    )
}
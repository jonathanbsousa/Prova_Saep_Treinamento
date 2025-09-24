import {Routes, Route } from 'react-router-dom'
import { Inicial } from '../Paginas/inicial'
import { CardTarefas } from '../Paginas/CardTarefas'
import { CardUsuario } from '../Paginas/CardUsuarios'

export function Rotas(){
    return(
        <Routes>
            <Route path='/' element={<Inicial/>}/>
            <Route index element={<Inicial/>}/>
            <Route path='cadUsuario' element={<CardUsuario/>}/>
            <Route path='cadTarefa' element={<CardTarefas/>}/>
        </Routes>
    )
}
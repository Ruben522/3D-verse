import React from 'react'

/**
 * Componente de perfil que mostraremos:
 * Nombre o nick, descripicón y avatar.
 * Tendrá botones para ver / mostrar: favoritos, modelos, followers (TO_DO) 
 */
const Perfil = ({id, name, description, avatar}) => {
  return (
    <div>
        <h2>Perfil</h2>
        <div>
            <img src={avatar} alt="avatar" />
            <p>{name}</p>
            <p>{description}</p>
        </div>
    </div>
  )
}

export default Perfil
import React from 'react'

const InicialTittle = ({ tittle, subtittle }) => {
    return (
        <div className="mb-12 text-center">

            <h1 className="text-4xl md:text-5xl font-black tracking-tight
                text-gray-900 dark:text-zinc-100 mb-4 transition-colors">
                {tittle}
            </h1>

            <p className="text-lg font-bold text-gray-500 dark:text-zinc-400 mb-10 transition-colors">
                {subtittle}
            </p>
        </div>
    )
}

export default InicialTittle
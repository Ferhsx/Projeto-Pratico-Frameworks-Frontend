function Secreto(){

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-black text-green-600 mb-4">🎉</h1>
                <p className="text-2xl font-bold text-gray-900 mb-4">Parabéns você chegou na Página Secreta!</p>
                <p className="text-4xl font-black text-blue-600 mb-8">BUUUUUU 👻</p>
                <a 
                    href="/" 
                    className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Voltar para a Loja
                </a>
            </div>
        </div>
    )
}

export default Secreto;
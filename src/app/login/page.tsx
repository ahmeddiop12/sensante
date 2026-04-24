  export default function LoginPage() { 
  return ( 
    <div className="flex items-center justify-center min-h-[60vh]"> 
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"> 
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center"> 
          Connexion 
        </h1> 
        <div className="space-y-4"> 
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 border rounded-lg" 
          /> 
          <input 
            type="password" 
            placeholder="Mot de passe" 
            className="w-full p-3 border rounded-lg" 
          /> 
          <button 
            className="w-full bg-teal-600 text-white py-3 rounded-lg 
              hover:bg-teal-700 transition" 
          > 
            Se connecter 
          </button> 
        </div> 
        <p className="text-sm text-gray-400 text-center mt-4"> 
          Fonctionnalité complète dans le Lab Auth 
        </p> 
      </div> 
    </div> 
  ); 
} 
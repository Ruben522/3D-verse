import React from 'react';
import Menu from './components/layout/Menu';
import AllRoutes from './routes/AllRoutes';

const App = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-md">
                <Menu /> 
            </header>
            
            <main className="flex-grow">
                <AllRoutes />
            </main>
        </div>
    );
};

export default App;
import React from 'react';
import Menu from './components/layout/Menu';
import Footer from './components/layout/Footer';
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
            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default App;
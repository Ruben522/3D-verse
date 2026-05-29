import React from 'react';
import Menu from './components/layout/Menu';
import Footer from './components/layout/Footer';
import AllRoutes from './routes/AllRoutes';

const App = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <header className="shadow-md">
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
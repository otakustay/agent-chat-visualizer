import About from '@/modules/About';
import {Routes, Route, Navigate} from 'react-router-dom';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/about" replace />} />
            <Route path="/about" element={<About />} />
        </Routes>
    );
};

export default App;

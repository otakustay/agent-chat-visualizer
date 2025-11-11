import About from '@/modules/About';
import Conversation from '@/modules/Conversation';
import {Routes, Route, Navigate} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';

const TOAST_OPTIONS = {
    success: {
        className: 'bg-green-500 text-white',
    },
    error: {
        className: 'bg-red-500 text-white',
    },
};

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/conversation" replace />} />
                <Route path="/about" element={<About />} />
                <Route path="/conversation" element={<Conversation />} />
            </Routes>
            <Toaster position="top-right" toastOptions={TOAST_OPTIONS} />
        </>
    );
};

export default App;

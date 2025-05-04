import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Chat from './chat';
import Login from './Login';
import Signup from './Signup';
import RoomSelection from './roomSelection';
import './index.css';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    const errorHandler = (error) => {
      console.error('Error caught by boundary:', error);
      setHasError(true);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return <div className="error-fallback">Ocorreu um erro. Recarregue a página.</div>;
  }

  return children;
};

const router = createBrowserRouter([
  { 
    path: "/", 
    element: <App />,
    errorElement: <div>Página não encontrada</div> 
  },
  { 
    path: "/rooms", 
    element: <RoomSelection />
  },
  { 
    path: "/chat/:roomId",
    element: <Chat /> 
  },
  { 
    path: "/login", 
    element: <Login /> 
  },
  { 
    path: "/signup", 
    element: <Signup /> 
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>
);
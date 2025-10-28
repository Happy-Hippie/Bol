import { useAuth } from './contexts/AuthContext';
import { Landing } from './components/Landing';
import { MainLayout } from './components/MainLayout';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bol-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-bol-pink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-bol-purple font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <MainLayout /> : <Landing />;
}

export default App;

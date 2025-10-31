import { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';

export function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const { signIn, signUp } = useAuth();

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem('hasSeenBolDisclaimer');
    if (!hasSeenDisclaimer) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleCloseDisclaimer = () => {
    localStorage.setItem('hasSeenBolDisclaimer', 'true');
    setShowDisclaimer(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        if (!orgName) {
          throw new Error('Organization name is required');
        }
        const { error } = await signUp(email, password, orgName);
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="mb-3 flex justify-center">
            <img
              src="/Bol logo (1).png"
              alt="BOL Logo"
              className="h-32 w-auto"
            />
          </div>
          <p className="text-gray-800 text-xl">Communications CRM for NGOs</p>
          <p className="text-gray-600 mt-2">Empowering your impact through better communication</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
                isLogin
                  ? 'bg-bol-purple text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
                !isLogin
                  ? 'bg-bol-purple text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-bol-purple font-medium mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none transition-colors"
                  placeholder="Your Organization"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-bol-purple font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-bol-purple font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="gradient"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </span>
              ) : (
                isLogin ? 'Login' : 'Create Account'
              )}
            </Button>
          </form>

          {isLogin && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Demo: Use any email/password to create an account
            </p>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Streamline your reporting, amplify your impact
          </p>
        </div>
      </div>

      {showDisclaimer && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl animate-fadeIn">
            <div className="bg-gradient-to-r from-bol-orange to-red-500 text-white p-6 rounded-t-xl flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-full flex-shrink-0">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Important Disclaimer</h2>
                <p className="text-white/90 text-sm">Please read this carefully before proceeding</p>
              </div>
            </div>

            <div className="p-8">
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  This website is a demonstration of <strong className="text-bol-purple">Bol</strong>, an AI-powered communications platform developed by <strong className="text-bol-purple">Zariaa AI Labs Private Limited</strong>.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  The content, data, and examples shown here are for <strong>prototype and evaluation purposes only</strong> and may include sample or dummy information to illustrate platform features.
                </p>

                <div className="bg-orange-50 border-l-4 border-bol-orange p-4 rounded-lg mb-4">
                  <p className="text-gray-800 font-semibold mb-2">
                    Currently, none of the platform's features are live or functional.
                  </p>
                  <p className="text-gray-700 text-sm">
                    This site is not intended for public or commercial use, and the materials do not represent actual NGO activities, funding proposals, or donor communications.
                  </p>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  For any queries or partnership interests, please contact <strong className="text-bol-purple">Zariaa AI Labs Private Limited</strong> directly.
                </p>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleCloseDisclaimer}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-bol-purple to-bol-blue text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 text-lg"
                >
                  I Understand, Continue
                </button>
              </div>

              <p className="text-center text-xs text-gray-500 mt-4">
                This message will only be shown once
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

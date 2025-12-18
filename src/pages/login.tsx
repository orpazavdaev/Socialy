import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login - check credentials
      if (username === '1' && password === '1') {
        // Successful login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        router.push('/');
      } else {
        setError('שם משתמש או סיסמא שגויים');
      }
    } else {
      // Signup
      if (!username || !password) {
        setError('יש למלא את כל השדות');
        return;
      }
      if (password !== confirmPassword) {
        setError('הסיסמאות לא תואמות');
        return;
      }
      if (password.length < 1) {
        setError('הסיסמא חייבת להכיל לפחות תו אחד');
        return;
      }
      // Successful signup - save and redirect
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[380px] p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif italic text-gray-900">Instagram</h1>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isLogin 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500'
            }`}
          >
            התחברות
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              !isLogin 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500'
            }`}
          >
            הרשמה
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="שם משתמש"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400 focus:bg-white transition-all text-right"
              dir="rtl"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="סיסמא"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400 focus:bg-white transition-all text-right"
              dir="rtl"
            />
          </div>

          {!isLogin && (
            <div>
              <input
                type="password"
                placeholder="אימות סיסמא"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400 focus:bg-white transition-all text-right"
                dir="rtl"
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            {isLogin ? 'התחבר' : 'הירשם'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">או</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social Login */}
        <button className="w-full py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-gray-700 text-sm font-medium">המשך עם Google</span>
        </button>

        {/* Footer text */}
        <p className="text-center text-xs text-gray-400 mt-6">
          {isLogin ? 'אין לך חשבון? ' : 'יש לך כבר חשבון? '}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-blue-500 font-semibold"
          >
            {isLogin ? 'הירשם' : 'התחבר'}
          </button>
        </p>
      </div>
    </div>
  );
}


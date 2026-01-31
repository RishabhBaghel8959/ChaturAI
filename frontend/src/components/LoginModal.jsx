import React from 'react';

export default function LoginModal({ 
  loginData, 
  setLoginData, 
  signupData, 
  setSignupData,
  isSignup,
  setIsSignup,
  onLogin, 
  onSignup,
  error,
  setError
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap');

        .brand-text {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          letter-spacing: -1px;
        }

        .backdrop-blur-custom {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(167, 139, 250, 0.2);
        }

        .input-field {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(167, 139, 250, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-field:focus {
          border-color: rgba(167, 139, 250, 0.8);
          background: rgba(15, 23, 42, 0.8);
          box-shadow: 0 0 24px rgba(167, 139, 250, 0.2);
        }

        .btn-primary {
          background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
          box-shadow: 0 4px 16px rgba(167, 139, 250, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-primary:hover {
          box-shadow: 0 8px 32px rgba(167, 139, 250, 0.5);
          transform: translateY(-2px);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-secondary {
          color: #a78bfa;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          color: #60a5fa;
          background: rgba(167, 139, 250, 0.1);
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-content {
          animation: fadeInDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gradient-accent {
          background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-gradient-to-r from-purple-600/20 to-transparent blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-l from-blue-600/20 to-transparent blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="brand-text text-5xl gradient-accent mb-2">ChaturAI</h1>
          <p className="text-slate-400 text-sm tracking-wide">Intelligent Data Mentor</p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-custom rounded-2xl p-8 shadow-2xl">
          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm animate-pulse">
              {error}
            </div>
          )}

          <div className="form-content space-y-1">
            {isSignup ? (
              <>
                <h2 className="text-2xl font-semibold text-slate-100 mb-6">Create your account</h2>

                <label className="block text-xs font-semibold text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="input-field w-full px-4 py-3 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none mb-4"
                />

                <label className="block text-xs font-semibold text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="input-field w-full px-4 py-3 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none mb-4"
                />

                <label className="block text-xs font-semibold text-slate-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  className="input-field w-full px-4 py-3 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none mb-6"
                />

                <button
                  onClick={onSignup}
                  className="btn-primary w-full py-3 text-white font-semibold rounded-lg transition-all mb-4"
                >
                  Create Account
                </button>

                <button
                  onClick={() => {
                    setIsSignup(false);
                    setError('');
                  }}
                  className="btn-secondary w-full py-2 text-sm rounded-lg transition-all"
                >
                  Already have an account? Log in
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-slate-100 mb-6">Welcome back</h2>

                <label className="block text-xs font-semibold text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="input-field w-full px-4 py-3 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none mb-4"
                />

                <label className="block text-xs font-semibold text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="input-field w-full px-4 py-3 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none mb-6"
                />

                <button
                  onClick={onLogin}
                  className="btn-primary w-full py-3 text-white font-semibold rounded-lg transition-all mb-4"
                >
                  Continue
                </button>

                <button
                  onClick={() => {
                    setIsSignup(true);
                    setError('');
                  }}
                  className="btn-secondary w-full py-2 text-sm rounded-lg transition-all"
                >
                  New here? Create an account
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-purple-500/20 text-center">
            <p className="text-slate-500 text-xs">
              Powered by Gemini 2.5 Flash
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
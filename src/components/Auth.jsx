import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) setMessage(error.message);
        else setMessage('');
        setLoading(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            setMessage(error.message);
        } else {
            setMessage('Verifique seu e-mail para confirmar o cadastro!');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Bem-vindo</h1>
                <p>Entre ou crie sua conta para gerenciar suas notas.</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn-primary" disabled={loading}>
                        {loading ? 'Carregando...' : 'Entrar'}
                    </button>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={handleSignUp}
                        disabled={loading}
                    >
                        Cadastrar
                    </button>
                </form>

                {message && <div className="auth-message">{message}</div>}
            </div>

            <style>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .auth-card {
          background-color: var(--card-bg);
          padding: 3rem;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .auth-card h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .auth-card p {
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group input {
          width: 100%;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.2);
          color: white;
          box-sizing: border-box;
        }
        .btn-primary {
          width: 100%;
          padding: 1rem;
          background-color: var(--accent-color);
          color: #0f172a;
          border-radius: 8px;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        .btn-secondary {
          width: 100%;
          padding: 1rem;
          background-color: transparent;
          color: var(--text-secondary);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
        }
        .btn-secondary:hover {
          border-color: var(--text-primary);
          color: var(--text-primary);
        }
        .auth-message {
          margin-top: 1rem;
          color: var(--accent-color);
          font-size: 0.9rem;
        }
      `}</style>
        </div>
    );
}

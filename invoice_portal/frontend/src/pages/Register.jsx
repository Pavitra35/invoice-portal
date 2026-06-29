import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        try {
            const response = await api.post('/auth/register', {
                name,
                email,
                password
            });

            console.log('Register Success:', response.data);

            setSuccess(response.data.message || 'Registration successful');

            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (err) {
            console.error('Register Error:', err);

            const message =
                err.response?.data?.message ||
                err.message ||
                'Registration failed';

            setError(message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create an Account</h2>

                {error && (
                    <p
                        style={{
                            color: 'red',
                            textAlign: 'center',
                            marginBottom: '1rem'
                        }}
                    >
                        {error}
                    </p>
                )}

                {success && (
                    <p
                        style={{
                            color: 'green',
                            textAlign: 'center',
                            marginBottom: '1rem'
                        }}
                    >
                        {success}
                    </p>
                )}

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="auth-btn">
                        Register
                    </button>
                </form>

                <Link to="/login" className="auth-link">
                    Already have an account? Login here.
                </Link>
            </div>
        </div>
    );
};

export default Register;
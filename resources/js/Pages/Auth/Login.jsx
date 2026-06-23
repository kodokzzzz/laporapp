import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk — LAPOR!" />

            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem 1rem' }}>
                <div className="card shadow-xl" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem 2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔐</div>
                        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                            Selamat Datang Kembali
                        </h1>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Silakan masuk ke akun LAPOR! Anda.
                        </p>
                    </div>

                    {status && (
                        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
                            <div className="alert-content">
                                <div className="alert-title">{status}</div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group mb-0">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                className={`form-input ${errors.email ? 'border-danger' : ''}`}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="nama@email.com"
                                required
                                autoFocus
                                autoComplete="username"
                            />
                            {errors.email && <span className="text-danger" style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
                        </div>

                        <div className="form-group mb-0 relative">
                            <label htmlFor="password" className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Password</span>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className={`form-input ${errors.password ? 'border-danger' : ''}`}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '0.75rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-light)',
                                        cursor: 'pointer',
                                        padding: '0.25rem'
                                    }}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {errors.password && <span className="text-danger" style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.password}</span>}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                            <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Ingat saya</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={processing}
                            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Belum punya akun?{' '}
                            <Link href={route('register')} style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                                Daftar sekarang
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}

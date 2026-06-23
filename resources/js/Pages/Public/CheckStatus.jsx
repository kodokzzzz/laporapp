import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', margin: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Something went wrong in CheckStatus.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', background: '#fef2f2', padding: '1rem', borderRadius: '0.25rem' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function StatusForm({ errors }) {
    const { data, setData, post, processing } = useForm({
        ticket_number: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('check-status.search'));
    };

    return (
        <GuestLayout>
            <Head title="Cek Status Laporan — LAPOR!" />

            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '2rem 1rem' }}>
                <div className="card shadow-xl" style={{ maxWidth: '500px', width: '100%', borderTop: '4px solid var(--primary)' }}>
                    <div className="card-header" style={{ textAlign: 'center', paddingBottom: '1rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔍</div>
                        <h1 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Cek Status Laporan</h1>
                        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                            Masukkan nomor tiket laporan Anda untuk melihat perkembangan terkini.
                        </p>
                    </div>

                    <div className="card-body">
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="form-group mb-0">
                                <label htmlFor="ticket_number" className="form-label">
                                    Nomor Tiket
                                </label>
                                <input
                                    id="ticket_number"
                                    type="text"
                                    className={`form-input ${errors?.ticket_number ? 'border-danger' : ''}`}
                                    placeholder="Contoh: LAPOR-20260623-00001"
                                    value={data.ticket_number}
                                    onChange={(e) => setData('ticket_number', e.target.value.toUpperCase())}
                                    required
                                    autoFocus
                                    style={{ textAlign: 'center', fontSize: '1.125rem', letterSpacing: '1px', padding: '0.75rem' }}
                                />
                                {errors?.ticket_number && (
                                    <span className="text-danger" style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', textAlign: 'center' }}>
                                        {errors.ticket_number}
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={processing || !(data.ticket_number || '').trim()}
                                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                            >
                                {processing ? 'Mencari...' : 'Cari Laporan'}
                            </button>
                        </form>

                        <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span>💡</span>
                                <span>Nomor tiket diberikan pada saat Anda berhasil membuat laporan. Jika Anda pelapor yang login, Anda juga bisa mengecek riwayat di menu <strong>Laporan Saya</strong>.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

export default function CheckStatus(props) {
    return (
        <ErrorBoundary>
            <StatusForm {...props} />
        </ErrorBoundary>
    );
}

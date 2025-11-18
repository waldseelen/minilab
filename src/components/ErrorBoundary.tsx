import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Merkezi log servisi entegrasyonu için hazır
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Gelecekte Sentry veya benzeri servisler eklenebilir:
        // if (window.Sentry) {
        //   window.Sentry.captureException(error, { contexts: { react: errorInfo } });
        // }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary" role="alert" aria-live="assertive">
                    <div style={{
                        maxWidth: '600px',
                        margin: '2rem auto',
                        padding: '2rem',
                        textAlign: 'center',
                        background: 'var(--bg-secondary, #f9f9f9)',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                            😢 Bir şeyler ters gitti!
                        </h2>
                        <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                            Beklenmedik bir hata oluştu. Lütfen sayfayı yeniden yükleyin.
                        </p>
                        <button
                            onClick={this.handleRetry}
                            style={{
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                color: 'white',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            🔄 Tekrar Dene
                        </button>
                        {this.state.error && process.env.NODE_ENV === 'development' && (
                            <details style={{
                                marginTop: '2rem',
                                textAlign: 'left',
                                whiteSpace: 'pre-wrap',
                                fontSize: '0.875rem',
                                color: '#666'
                            }}>
                                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                    🔍 Geliştirici Detayları
                                </summary>
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '1rem',
                                    background: '#f5f5f5',
                                    borderRadius: '4px',
                                    overflow: 'auto'
                                }}>
                                    <strong>Hata:</strong> {this.state.error.toString()}
                                    <br /><br />
                                    <strong>Stack Trace:</strong>
                                    <pre style={{ fontSize: '0.75rem' }}>{this.state.error.stack}</pre>
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

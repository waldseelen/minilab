
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif', color: '#334155'}}>
          <h2 style={{color: '#e11d48', fontSize: '2rem', marginBottom: '1rem'}}>Uygulama Başlatılamadı 😔</h2>
          <p style={{fontSize: '1.2rem', marginBottom: '1rem'}}>Bir şeyler ters gitti. Hata detayı:</p>
          <pre style={{background: '#f1f5f9', padding: '1rem', borderRadius: '0.5rem', textAlign: 'left', overflow: 'auto', maxWidth: '800px', margin: '0 auto', color: '#ef4444'}}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{marginTop: '2rem', padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold'}}
          >
            Sayfayı Yenile 🔄
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

import WebformContent from './WebformContent';

export default function WebformPage() {
  return (
    <div style={{ backgroundColor: '#f4f7fa', minHeight: 'calc(100vh - 120px)', padding: '40px 0' }}>
      <div className="container">
        <WebformContent />
      </div>
    </div>
  );
}

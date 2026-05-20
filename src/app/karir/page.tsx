import KarirContent from './KarirContent';

export default function KarirPage() {
  return (
    <div style={{ backgroundColor: '#f4f7fa', minHeight: 'calc(100vh - 120px)', padding: '40px 0' }}>
      <div className="container">
        <KarirContent />
      </div>
    </div>
  );
}

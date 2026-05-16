import VideoCall from './VideoCall';

export default function ChatPage() {
  return (
    <div style={{ backgroundColor: '#f4f7fa', minHeight: 'calc(100vh - 120px)', padding: '40px 0' }}>
      <div className="container">
        <VideoCall />
      </div>
    </div>
  );
}

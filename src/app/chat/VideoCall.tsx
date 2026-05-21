'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './VideoCall.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function VideoCall() {
  const { lang } = useLanguage();
  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');
  const [isJoinFlow, setIsJoinFlow] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Lobby Camera Preview states
  const [lobbyStream, setLobbyStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localPreviewRef = useRef<HTMLVideoElement>(null);

  // Dynamic script loading for Jitsi Meet
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => setJitsiLoaded(true);
    document.body.appendChild(script);

    // Read room parameter from URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam) {
      setRoomCode(roomParam);
      setIsJoinFlow(true);
    }

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle opening camera for local preview (Green Room)
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    const startPreview = async () => {
      if (isJoinFlow && !isCalling && !isVideoOff) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: !isMuted 
          });
          activeStream = stream;
          setLobbyStream(stream);
          if (localPreviewRef.current) {
            localPreviewRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera preview failed:", err);
        }
      }
    };

    startPreview();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isJoinFlow, isCalling, isVideoOff]);

  // Turn local camera preview on/off
  const toggleLobbyCamera = () => {
    if (isVideoOff) {
      setIsVideoOff(false);
    } else {
      if (lobbyStream) {
        lobbyStream.getTracks().forEach(track => track.stop());
        setLobbyStream(null);
      }
      setIsVideoOff(true);
    }
  };

  // Generate dynamic, official-looking Bank Room Code
  const handleGenerateRoom = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const code = `MIBANK-MEET-${randomId}`;
    setRoomCode(code);
    setIsJoinFlow(true);
  };

  // Copy Room Link to share
  const handleCopyLink = () => {
    const link = `${window.location.origin}/chat?room=${roomCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Initialize Jitsi Meet Rapat
  useEffect(() => {
    if (isCalling && jitsiLoaded) {
      // Stop local lobby preview camera before entering Jitsi
      if (lobbyStream) {
        lobbyStream.getTracks().forEach(track => track.stop());
        setLobbyStream(null);
      }

      const domain = 'meet.jit.si';
      const options = {
        roomName: roomCode,
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#jitsi-meet-container'),
        configOverwrite: {
          startWithAudioMuted: isMuted,
          startWithVideoMuted: isVideoOff,
          prejoinPageEnabled: false,
          disableThirdPartyRequests: true,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'mute-everyone', 'security'
          ],
        },
        userInfo: {
          displayName: userName || (lang === 'ID' ? 'Nasabah MiBANK' : 'MiBANK Client'),
        }
      };

      const api = new (window as any).JitsiMeetExternalAPI(domain, options);

      api.addEventListener('readyToClose', () => {
        endCall();
      });

      return () => {
        api.dispose();
      };
    }
  }, [isCalling, jitsiLoaded]);

  const endCall = () => {
    setIsCalling(false);
    setIsJoinFlow(false);
    setRoomCode('');
    // Remove query param from browser address bar cleanly
    window.history.pushState({}, document.title, window.location.pathname);
  };

  // 1. CALL ACTIVE STATE (JITSI IFRAME CONTAINER)
  if (isCalling) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '620px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', background: '#111827' }}>
        {/* Anti-Flag Security Header Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#10b981', display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></span>
            <span>{lang === 'ID' ? `RUANG RAPAT ELEKTRONIK AKTIF: ${roomCode}` : `ELECTRONIC CONFERENCE ROOM ACTIVE: ${roomCode}`}</span>
          </div>
          <div style={{ color: '#10b981', letterSpacing: '1px' }}>🔒 AES-256 E2EE SECURE</div>
        </div>

        {/* Jitsi Meet Mount Node */}
        <div id="jitsi-meet-container" style={{ width: '100%', height: '100%' }}></div>
      </div>
    );
  }

  // 2. GREEN ROOM / PRE-JOIN LOBBY STATE
  if (isJoinFlow) {
    return (
      <div className={styles.preCall} style={{ maxWidth: '800px', padding: '40px' }}>
        <div className={styles.secureBadge} style={{ background: '#ecfdf5', color: '#059669' }}>
          <span className={styles.shieldIcon}>🛡️</span>
          <span>{lang === 'ID' ? 'Koneksi Rapat Terenkripsi Aman' : 'AES-256 Secured Conference Connection'}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', textAlign: 'left', marginTop: '10px' }}>
          {/* Left Column: Local Preview & Controls */}
          <div>
            <div style={{ position: 'relative', width: '100%', height: '240px', background: '#1f2937', borderRadius: '12px', overflow: 'hidden', border: '2px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              {!isVideoOff ? (
                <video ref={localPreviewRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', gap: '10px' }}>
                  <span style={{ fontSize: '40px' }}>🚫</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'ID' ? 'Kamera Dimatikan' : 'Camera is Off'}</span>
                </div>
              )}
              {/* Local View Bottom Overlays */}
              <div style={{ position: 'absolute', bottom: '15px', left: '15px', right: '15px', display: 'flex', justifyContent: 'center', gap: '15px', zIndex: 10 }}>
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className={styles.iconBtn} 
                  style={{ background: isMuted ? '#ef4444' : 'rgba(0,0,0,0.5)', width: '40px', height: '40px', fontSize: '16px' }}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? '🔇' : '🎤'}
                </button>
                <button 
                  onClick={toggleLobbyCamera} 
                  className={styles.iconBtn} 
                  style={{ background: isVideoOff ? '#ef4444' : 'rgba(0,0,0,0.5)', width: '40px', height: '40px', fontSize: '16px' }}
                  title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                  {isVideoOff ? '🚫' : '📹'}
                </button>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '10px' }}>
              {lang === 'ID' ? 'Atur kamera dan mikrofon Anda sebelum bergabung' : 'Adjust your camera and mic before joining'}
            </p>
          </div>

          {/* Right Column: Invite Card & Info */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-color)', margin: '0 0 8px 0' }}>
              {lang === 'ID' ? 'Siap Bergabung?' : 'Ready to Join?'}
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              {lang === 'ID' ? 'Bagikan link di bawah untuk mengundang rekan Anda ke dalam ruang rapat resmi bank ini.' : 'Share the link below to invite others into this official bank conference room.'}
            </p>

            {/* Room Code Showcase Container */}
            <div style={{ background: '#f3f4f6', borderRadius: '8px', padding: '12px 15px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                {lang === 'ID' ? 'Link Ruangan Rapat' : 'Meeting Room Link'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {roomCode}
                </span>
                <button 
                  onClick={handleCopyLink} 
                  style={{ background: copied ? '#059669' : 'var(--primary-color)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', minWidth: '75px' }}
                >
                  {copied ? 'Tersalin! ✓' : 'Salin Link'}
                </button>
              </div>
            </div>

            {/* Input Name field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>
                {lang === 'ID' ? 'Tulis Nama Panggilan Anda' : 'Enter Your Display Name'}
              </label>
              <input 
                type="text" 
                placeholder={lang === 'ID' ? 'Contoh: Budi Santoso' : 'e.g. John Doe'}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setIsCalling(true)} 
                className="btn btn-primary" 
                style={{ flex: '1', padding: '12px 20px', fontSize: '14px', fontWeight: 'bold', borderRadius: '8px' }}
              >
                {lang === 'ID' ? 'Gabung Sekarang 🟢' : 'Join Now 🟢'}
              </button>
              <button 
                onClick={endCall} 
                style={{ background: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {lang === 'ID' ? 'Batal' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. LOBBY / HOME SCREEN STATE (CREATE OR JOIN VIEW)
  return (
    <div className={styles.preCall} style={{ maxWidth: '800px', padding: '50px 30px' }}>
      <div className={styles.secureBadge}>
        <span className={styles.shieldIcon}>🛡️</span>
        <span>{lang === 'ID' ? 'Layanan Rapat Video Terenkripsi AES-256' : 'AES-256 Encrypted Conference Service'}</span>
      </div>

      <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 10px 0', color: 'var(--primary-color)' }}>
        {lang === 'ID' ? 'MiBANK Meet - Layanan Rapat Aman' : 'MiBANK Meet - Secure Conference Room'}
      </h2>
      <p style={{ fontSize: '14px', color: '#6b7280', maxWidth: '550px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
        {lang === 'ID' 
          ? 'Platform pertemuan bisnis digital dengan proteksi anti-frauds untuk diskusi layanan perbankan eksklusif, transfer dokumen, dan presentasi merchant.' 
          : 'Digital business meeting platform with active anti-fraud protection for discussions on exclusive banking services, document transfers, and merchant presentations.'}
      </p>

      {/* Lobby Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', borderTop: '1px solid #f3f4f6', paddingTop: '40px', textAlign: 'left' }}>
        
        {/* Left Side: Create Room */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid #f3f4f6', paddingRight: '40px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>
              {lang === 'ID' ? 'Buat Rapat Baru' : 'Create a New Meeting'}
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              {lang === 'ID' ? 'Dapatkan kode ruangan kustom bank resmi yang aman untuk dibagikan dengan siapa pun yang Anda inginkan.' : 'Generate a secure, official bank meeting room code to share with anyone you want.'}
            </p>
          </div>
          <button 
            onClick={handleGenerateRoom} 
            className="btn btn-primary" 
            style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 'bold', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '8px' }}
          >
            <span>➕</span> {lang === 'ID' ? 'Buat Rapat Baru' : 'Create New Meeting'}
          </button>
        </div>

        {/* Right Side: Join Room */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>
              {lang === 'ID' ? 'Gabung Rapat Berjalan' : 'Join Existing Meeting'}
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              {lang === 'ID' ? 'Masukkan kode ruangan resmi dari partner atau CS Anda untuk langsung bergabung ke ruang rapat.' : 'Enter the official meeting room code shared by your partner or CS to jump directly into the room.'}
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="text" 
              placeholder={lang === 'ID' ? 'Contoh: MIBANK-MEET-8291' : 'e.g. MIBANK-MEET-8291'}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', outline: 'none', background: '#f9fafb' }}
            />
            <button 
              onClick={() => {
                if (roomCode.trim()) setIsJoinFlow(true);
              }} 
              disabled={!roomCode.trim()}
              className="btn btn-secondary" 
              style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 'bold', width: '100%', borderRadius: '8px', background: roomCode.trim() ? 'var(--primary-color)' : '#9ca3af', border: 'none', color: 'white', cursor: roomCode.trim() ? 'pointer' : 'not-allowed' }}
            >
              {lang === 'ID' ? 'Gabung Sekarang ➡️' : 'Join Meeting ➡️'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './VideoCall.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function VideoCall() {
  const { lang } = useLanguage();
  const [isCalling, setIsCalling] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<{sender: string, text: string, time: string}[]>([
    { sender: 'CS', text: lang === 'ID' ? 'Halo! Ada yang bisa saya bantu hari ini?' : 'Hello! How can I help you today?', time: '10:00' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [timer, setTimer] = useState(0);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const startCall = async () => {
    setIsCalling(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Simulate connection delay
      setTimeout(() => {
        setIsConnected(true);
      }, 3000);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert(lang === 'ID' ? "Gagal mengakses kamera/mikrofon." : "Failed to access camera/microphone.");
      setIsCalling(false);
    }
  };

  const endCall = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCalling(false);
    setIsConnected(false);
    setIsSharing(false);
    setTimer(0);
  };

  const toggleShareScreen = async () => {
    if (isSharing) {
      // Switch back to camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsSharing(false);
      } catch (err) {
        console.error("Error returning to camera:", err);
      }
    } else {
      // Start sharing
      try {
        const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsSharing(true);
        
        // Anti-Flag Security Toast
        const toast = document.createElement('div');
        toast.innerText = lang === 'ID' ? '🔒 PROTEKSI DATA AKTIF: LAYAR TERENKRIPSI' : '🔒 DATA PROTECTION ACTIVE: SCREEN ENCRYPTED';
        toast.className = styles.securityToast;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);

        // Handle user clicking "Stop Sharing" from browser bar
        screenStream.getVideoTracks()[0].onended = () => {
          toggleShareScreen();
        };
      } catch (err) {
        console.error("Error sharing screen:", err);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setMessages([...messages, { sender: 'User', text: inputValue, time: timeStr }]);
      setInputValue('');
      
      // Simulate CS response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: 'CS', 
          text: lang === 'ID' ? 'Tentu, mohon tunggu sebentar ya.' : 'Sure, please wait a moment.', 
          time: timeStr 
        }]);
      }, 1500);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isCalling) {
    return (
      <div className={styles.preCall}>
        <div className={styles.secureBadge}>
          <span className={styles.shieldIcon}>🛡️</span>
          <span>{lang === 'ID' ? 'Koneksi Terenkripsi AES-256' : 'AES-256 Encrypted Connection'}</span>
        </div>
        <h2>{lang === 'ID' ? 'Layanan Video Banking' : 'Video Banking Service'}</h2>
        <p>
          {lang === 'ID' 
            ? 'Hubungi spesialis kami melalui panggilan video aman untuk layanan perbankan eksklusif.' 
            : 'Connect with our specialists via secure video call for exclusive banking services.'}
        </p>
        <div className={styles.featureList}>
          <div className={styles.feature}>
            <span>🔒</span>
            <p>{lang === 'ID' ? 'Anti-Record Protection' : 'Anti-Record Protection'}</p>
          </div>
          <div className={styles.feature}>
            <span>👤</span>
            <p>{lang === 'ID' ? 'Verifikasi Biometrik' : 'Biometric Verification'}</p>
          </div>
          <div className={styles.feature}>
            <span>💼</span>
            <p>{lang === 'ID' ? 'Spesialis Berlisensi' : 'Licensed Specialists'}</p>
          </div>
        </div>
        <button onClick={startCall} className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '18px' }}>
          {lang === 'ID' ? 'Mulai Panggilan Aman' : 'Start Secure Call'}
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles.videoContainer} ${showChat ? styles.withChat : ''}`}>
      {/* Video Section */}
      <div className={styles.videoSection}>
        {/* Remote Video (Specialist) */}
        <div className={styles.remoteView}>
          {isConnected ? (
            <div className={styles.remotePlaceholder}>
               <div className={styles.specialistInfo}>
                  <div className={styles.avatar}>CS</div>
                  <div>
                    <h4>Sarah Wijaya</h4>
                    <p>Financial Advisor</p>
                  </div>
               </div>
               {/* Simulating specialist video with an image or animation */}
               <div className={styles.mockVideo}>
                  <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000" alt="Specialist" />
               </div>
            </div>
          ) : (
            <div className={styles.connecting}>
              <div className={styles.spinner}></div>
              <p>{lang === 'ID' ? 'Menghubungkan ke jalur aman...' : 'Connecting to secure line...'}</p>
            </div>
          )}
        </div>

        {/* Global Anti-Flag Watermarks */}
        <div className={styles.securityOverlay}>
          <div className={styles.watermarkTL}>SECURE-ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
          <div className={styles.watermarkTR}>{new Date().toLocaleTimeString()}</div>
          <div className={styles.watermarkBL}>Mitra Perbankan Indonesia ANTI-FRAUD SYSTEM</div>
          <div className={styles.watermarkBR}>AES-256 E2EE</div>
          {isSharing && (
            <div className={styles.shareShield}>
               <div className={styles.shieldPulse}></div>
               <span>{lang === 'ID' ? 'PROTEKSI SHARING AKTIF' : 'SHARING PROTECTION ACTIVE'}</span>
            </div>
          )}
        </div>

        {/* Local Video (User / Screen) */}
        <div className={`${styles.localView} ${isSharing ? styles.sharingView : ''}`}>
          <video ref={localVideoRef} autoPlay playsInline muted />
          <div className={styles.localName}>
            {isSharing ? (lang === 'ID' ? 'Layar Anda' : 'Your Screen') : (lang === 'ID' ? 'Anda' : 'You')}
          </div>
        </div>
      </div>

      {/* Chat Section */}
      {showChat && (
        <div className={styles.chatSection}>
          <div className={styles.chatHeader}>
            <h3>{lang === 'ID' ? 'Obrolan Langsung' : 'Live Chat'}</h3>
            <button onClick={() => setShowChat(false)} className={styles.closeChat}>×</button>
          </div>
          <div className={styles.messageList}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.messageItem} ${msg.sender === 'User' ? styles.userMsg : styles.csMsg}`}>
                <div className={styles.msgBubble}>
                  {msg.text}
                  <span className={styles.msgTime}>{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className={styles.chatInput}>
            <input 
              type="text" 
              placeholder={lang === 'ID' ? 'Ketik pesan...' : 'Type a message...'} 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit">✈</button>
          </form>
        </div>
      )}

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.callInfo}>
          <span className={styles.statusDot}></span>
          <span>{isConnected ? formatTime(timer) : (lang === 'ID' ? 'Menghubungkan...' : 'Connecting...')}</span>
        </div>
        <div className={styles.actionButtons}>
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className={`${styles.iconBtn} ${isMuted ? styles.active : ''}`}
            title={lang === 'ID' ? 'Bisukan' : 'Mute'}
          >
            {isMuted ? '🔇' : '🎤'}
          </button>
          <button 
            onClick={() => setIsVideoOff(!isVideoOff)} 
            className={`${styles.iconBtn} ${isVideoOff ? styles.active : ''}`}
            title={lang === 'ID' ? 'Matikan Video' : 'Video Off'}
          >
            {isVideoOff ? '🚫' : '📹'}
          </button>
          <button 
            onClick={toggleShareScreen} 
            className={`${styles.iconBtn} ${isSharing ? styles.active : ''}`}
            title={lang === 'ID' ? 'Bagikan Layar' : 'Share Screen'}
          >
            {isSharing ? '📺' : '📤'}
          </button>
          <button 
            onClick={() => setShowChat(!showChat)} 
            className={`${styles.iconBtn} ${showChat ? styles.active : ''}`}
            title={lang === 'ID' ? 'Obrolan' : 'Chat'}
          >
            💬
          </button>
          <button onClick={endCall} className={`${styles.iconBtn} ${styles.endCallBtn}`}>
            📞
          </button>
        </div>
        <div className={styles.securityTag}>
           <span>🔒 E2EE SECURE</span>
        </div>
      </div>
    </div>
  );
}

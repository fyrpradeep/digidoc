import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api','') || 'http://localhost:4000';

export type CallState = 'idle' | 'calling' | 'incoming' | 'connected' | 'ended' | 'rejected' | 'offline';

interface IncomingCallData {
  roomId:      string;
  patientId:   string;
  patientName: string;
  callType:    'video' | 'audio';
}

export function useCall() {
  const socketRef    = useRef<Socket | null>(null);
  const pcRef        = useRef<RTCPeerConnection | null>(null);
  const localStream  = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);

  const [callState, setCallState]     = useState<CallState>('idle');
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [myUserId, setMyUserId]       = useState<string | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // ── Connect socket ───────────────────────────────────────────────
  const connect = useCallback((userId: string, role: 'patient'|'doctor', name: string) => {
    if (socketRef.current?.connected) return;

    const socket = io(`${SOCKET_URL}/call`, { transports: ['websocket'] });
    socketRef.current = socket;
    setMyUserId(userId);

    socket.on('connect', () => {
      socket.emit('register', { userId, role, name });
    });

    // ── Incoming call (doctor) ──
    socket.on('call:incoming', (data: IncomingCallData) => {
      setIncomingCall(data);
      setCallState('incoming');
      // Play ringtone
      try {
        const ctx = new AudioContext();
        const playBeep = () => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = 440;
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          osc.start(); osc.stop(ctx.currentTime + 0.3);
        };
        playBeep();
        setTimeout(playBeep, 700);
        setTimeout(playBeep, 1400);
      } catch {}
    });

    // ── Doctor accepted (patient) ──
    socket.on('call:accepted', async (data: { roomId: string; doctorName: string }) => {
      setCallState('connected');
      await startWebRTC(data.roomId, true); // patient is initiator
    });

    // ── Doctor rejected (patient) ──
    socket.on('call:rejected', () => {
      setCallState('rejected');
      cleanup();
      setTimeout(() => setCallState('idle'), 3000);
    });

    // ── Doctor offline ──
    socket.on('call:doctor-offline', () => {
      setCallState('offline');
      cleanup();
      setTimeout(() => setCallState('idle'), 3000);
    });

    // ── Call ended by partner ──
    socket.on('call:ended', () => {
      setCallState('ended');
      cleanup();
    });

    // ── WebRTC signaling ──
    socket.on('webrtc:offer', async (data: { roomId: string; offer: RTCSessionDescriptionInit; fromId: string }) => {
      if (!pcRef.current) await startWebRTC(data.roomId, false);
      await pcRef.current!.setRemoteDescription(data.offer);
      const answer = await pcRef.current!.createAnswer();
      await pcRef.current!.setLocalDescription(answer);
      socket.emit('webrtc:answer', { roomId: data.roomId, answer, fromId: userId });
    });

    socket.on('webrtc:answer', async (data: { answer: RTCSessionDescriptionInit }) => {
      await pcRef.current?.setRemoteDescription(data.answer);
    });

    socket.on('webrtc:ice', async (data: { candidate: RTCIceCandidateInit }) => {
      try { await pcRef.current?.addIceCandidate(data.candidate); } catch {}
    });
  }, []);

  // ── Start WebRTC ─────────────────────────────────────────────────
  const startWebRTC = async (roomId: string, isInitiator: boolean) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }).catch(() =>
      navigator.mediaDevices.getUserMedia({ audio: true })
    );
    localStream.current = stream;

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });
    pcRef.current = pc;

    stream.getTracks().forEach(t => pc.addTrack(t, stream));

    pc.ontrack = (e) => {
      remoteStream.current = e.streams[0];
    };

    pc.onicecandidate = (e) => {
      if (e.candidate && socketRef.current && myUserId) {
        socketRef.current.emit('webrtc:ice', { roomId, candidate: e.candidate, fromId: myUserId });
      }
    };

    if (isInitiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current?.emit('webrtc:offer', { roomId, offer, fromId: myUserId });
    }
  };

  // ── Patient: initiate call ───────────────────────────────────────
  const initiateCall = (roomId: string, patientId: string, patientName: string, doctorId: string, doctorName: string, callType: 'video'|'audio') => {
    setCurrentRoom(roomId);
    setCallState('calling');
    socketRef.current?.emit('call:request', { roomId, patientId, patientName, doctorId, doctorName, callType });
  };

  // ── Doctor: accept call ──────────────────────────────────────────
  const acceptCall = async (doctorId: string, doctorName: string) => {
    if (!incomingCall) return;
    setCurrentRoom(incomingCall.roomId);
    setCallState('connected');
    await startWebRTC(incomingCall.roomId, false);
    socketRef.current?.emit('call:accept', { roomId: incomingCall.roomId, doctorId, doctorName });
    setIncomingCall(null);
  };

  // ── Doctor: reject call ──────────────────────────────────────────
  const rejectCall = (doctorId: string) => {
    if (!incomingCall) return;
    socketRef.current?.emit('call:reject', { roomId: incomingCall.roomId, doctorId });
    setIncomingCall(null);
    setCallState('idle');
  };

  // ── End call ────────────────────────────────────────────────────
  const endCall = () => {
    if (currentRoom && myUserId) {
      socketRef.current?.emit('call:end', { roomId: currentRoom, userId: myUserId });
    }
    cleanup();
    setCallState('ended');
  };

  // ── Toggle audio/video ───────────────────────────────────────────
  const toggleAudio = () => {
    const track = localStream.current?.getAudioTracks()[0];
    if (track) { track.enabled = !track.enabled; setIsAudioMuted(!track.enabled); }
  };

  const toggleVideo = () => {
    const track = localStream.current?.getVideoTracks()[0];
    if (track) { track.enabled = !track.enabled; setIsVideoMuted(!track.enabled); }
  };

  // ── Cleanup ──────────────────────────────────────────────────────
  const cleanup = () => {
    localStream.current?.getTracks().forEach(t => t.stop());
    pcRef.current?.close();
    localStream.current  = null;
    remoteStream.current = null;
    pcRef.current        = null;
    setCurrentRoom(null);
  };

  useEffect(() => () => { cleanup(); socketRef.current?.disconnect(); }, []);

  return {
    connect, initiateCall, acceptCall, rejectCall, endCall,
    toggleAudio, toggleVideo,
    callState, incomingCall, currentRoom,
    localStream, remoteStream,
    isVideoMuted, isAudioMuted,
  };
}

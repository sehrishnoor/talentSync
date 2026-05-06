import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Send, Globe, ChevronLeft, ShieldCheck, User, Paperclip, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
    const { connectionId } = useParams();
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        fetchChatData();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [connectionId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchChatData = async () => {
        try {
            setLoading(true);
            const [msgRes, connRes] = await Promise.all([
                api.get(`/messages/${connectionId}`),
                api.get(`/connections`) // Get connections to find partner info
            ]);
            
            setMessages(msgRes.data);
            
            // Mark as read when entering the chat
            await api.patch(`/messages/${connectionId}/read`);
            
            // Find partner info from connections list
            const conn = connRes.data.find(c => c.id === parseInt(connectionId));
            if (conn) {
                const other = conn.requester.id === user.id ? conn.recipient : conn.requester;
                setPartner(other);
            }
        } catch (err) {
            toast.error('Failed to initialize communication channel');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/messages/${connectionId}`);
            if (res.data.length !== messages.length) {
                setMessages(res.data);
                await api.patch(`/messages/${connectionId}/read`);
            }
        } catch (err) {}
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await api.post('/messages', {
                connection_id: connectionId,
                content: newMessage
            });
            const sentMsg = { 
                ...res.data, 
                created_at: res.data.created_at || res.data.createdAt || new Date().toISOString(),
                sender: { id: user.id, name: user.name } 
            };
            setMessages([...messages, sentMsg]);
            setNewMessage('');
        } catch (err) {
            toast.error('Transmission failed');
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ShieldCheck size={48} className="text-primary" />
            </motion.div>
            <p className="text-muted mt-4 uppercase tracking-widest text-xs font-bold">Establishing Secure Channel...</p>
        </div>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', height: '82vh', display: 'flex', flexDirection: 'column' }} className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem 2rem', background: 'rgba(15,23,42,0.6)', border: '1px solid var(--border-color)', borderRadius: '24px 24px 0 0' }}>
                <button onClick={() => navigate('/network')} className="btn-secondary" style={{ padding: '0.6rem', borderRadius: '12px' }}>
                    <ChevronLeft size={20} />
                </button>
                <div className="avatar" style={{ width: '48px', height: '48px' }}>
                    {partner?.name?.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.1rem' }}>{partner?.name}</h3>
                    <p className="text-success" style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        ● Encryption Active
                    </p>
                </div>
                <button className="btn-secondary" style={{ padding: '0.6rem', borderRadius: '12px' }}>
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* Content area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: 'rgba(15,23,42,0.3)', borderInline: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', margin: 'auto', opacity: 0.3 }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '100px', display: 'inline-block', marginBottom: '1.5rem' }}>
                           <Globe size={48} />
                        </div>
                        <p>Begin your high-impact collaboration.</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.sender_id === user.id;
                        return (
                            <motion.div 
                                initial={{ opacity: 0, x: isMe ? 20 : -20 }} 
                                animate={{ opacity: 1, x: 0 }}
                                key={msg.id} 
                                style={{ 
                                    maxWidth: '75%', 
                                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.4rem'
                                }}
                            >
                                <div style={{ 
                                    padding: '1.25rem 1.75rem', 
                                    borderRadius: isMe ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                                    background: isMe ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                                    color: isMe ? '#fff' : 'var(--text-main)',
                                    border: isMe ? 'none' : '1px solid var(--border-color)',
                                    boxShadow: isMe ? '0 8px 16px rgba(99,102,241,0.2)' : 'none',
                                    fontSize: '1rem',
                                    lineHeight: 1.5
                                }}>
                                    {msg.content}
                                </div>
                                <span className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 700, alignSelf: isMe ? 'flex-end' : 'flex-start', paddingInline: '0.5rem' }}>
                                    {new Date(msg.created_at || msg.createdAt || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </motion.div>
                        );
                    })
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input area */}
            <div style={{ padding: '1.5rem 2rem', background: 'rgba(15,23,42,0.6)', border: '1px solid var(--border-color)', borderRadius: '0 0 24px 24px' }}>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" className="btn-secondary" style={{ padding: '0.75rem', borderRadius: '14px' }}>
                        <Paperclip size={20} />
                    </button>
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Transmit message..." 
                        style={{ height: '52px', background: 'rgba(15,23,42,0.8)' }}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="btn-primary" style={{ width: '52px', height: '52px', borderRadius: '14px', padding: 0, justifyContent: 'center' }}>
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;

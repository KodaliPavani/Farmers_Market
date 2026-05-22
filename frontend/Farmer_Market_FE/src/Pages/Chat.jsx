import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Send, User as UserIcon, ShieldCheck, MapPin, Phone, 
  MessageSquare, Compass, ArrowLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Chat = () => {
  const { user } = useAuth();
  
  // Mock Contacts
  const [contacts, setContacts] = useState([
    { id: 'c1', name: 'Ramesh Kurmi', farm: 'Green Valley Farms', role: 'FARMER', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', online: true },
    { id: 'c2', name: 'Suresh Patel', farm: 'Patel Agri Farms', role: 'FARMER', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', online: false },
    { id: 'c3', name: 'Amit Kumar', farm: 'Amit Pani Puri Corner', role: 'VENDOR', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', online: true }
  ]);

  const [selectedContact, setSelectedContact] = useState(contacts[0]);

  // Mock Conversations
  const [conversations, setConversations] = useState({
    c1: [
      { senderId: 'c1', text: 'Namaste Amit ji, tomatoes have been harvested this morning at 6 AM. Extremely red and fresh.', time: '10:30 AM' },
      { senderId: 'me', text: 'Great Ramesh ji! I need 50kg for HSR pani puri cart today. Will delivery charge be lower?', time: '10:32 AM' },
      { senderId: 'c1', text: 'Yes, Vikram ji is also buying 40kg, so KrishiMandi is pooling both orders in one truck. Delivery fee is just Rs. 90!', time: '10:35 AM' }
    ],
    c2: [
      { senderId: 'c2', text: 'Chakki Atta batch is ready for pickup.', time: 'Yesterday' }
    ],
    c3: [
      { senderId: 'c3', text: 'Welcome to KrishiMandi Mandi chat!', time: 'May 15' }
    ]
  });

  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      senderId: 'me',
      text: inputMessage,
      time: 'Just now'
    };

    setConversations({
      ...conversations,
      [selectedContact.id]: [...(conversations[selectedContact.id] || []), newMessage]
    });

    setInputMessage('');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'FARMER') return '/farmer';
    return '/vendor';
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 text-left">
        
        {/* Navigation Link */}
        <Link to={getDashboardLink()} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-slate-800">Peer-to-Peer Sourcing Chats</h1>

        {/* Chat box container */}
        <div className="grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-[550px] items-stretch">
          
          {/* Contacts Sidebar List */}
          <div className="md:col-span-4 border-r border-slate-100 flex flex-col h-full bg-slate-50/50">
            <div className="p-4 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Conversations</span>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {contacts
                .filter(c => user?.role === 'FARMER' ? c.role === 'VENDOR' : c.role === 'FARMER') // Filter relative counterparts
                .map(contact => (
                  <div 
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 flex gap-3 items-center cursor-pointer border-b border-slate-50 transition-all ${selectedContact.id === contact.id ? 'bg-white font-semibold border-l-4 border-primary-500' : 'hover:bg-white/50'}`}
                  >
                    <div className="relative">
                      <div className="h-9 w-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-300 uppercase select-none">
                        {contact.name.charAt(0)}
                      </div>
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border border-white"></span>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-0.5 text-left flex-1 min-w-0">
                      <span className="text-xs text-slate-800 truncate">{contact.name}</span>
                      <span className="text-[9.5px] text-slate-400 font-semibold truncate uppercase">{contact.farm}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Active Chat Conversation window */}
          <div className="md:col-span-8 flex flex-col justify-between h-full relative">
            
            {/* Header info */}
            {selectedContact ? (
              <>
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                  <div className="flex gap-2.5 items-center">
                    <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200 uppercase select-none">
                      {selectedContact.name.charAt(0)}
                    </div>
                    <div className="text-left flex flex-col">
                      <span className="font-extrabold text-xs text-slate-800">{selectedContact.name}</span>
                      <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wide">{selectedContact.farm}</span>
                    </div>
                  </div>
                </div>

                {/* Message display board */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/20 max-h-[380px]">
                  {(conversations[selectedContact.id] || []).map((msg, idx) => {
                    const isMe = msg.senderId === 'me';
                    return (
                      <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} text-left`}>
                        <div className={`max-w-xs px-4 py-3 rounded-2xl text-xs leading-relaxed ${isMe ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'}`}>
                          <p>{msg.text}</p>
                          <span className={`block text-[8px] mt-1 text-right font-medium ${isMe ? 'text-primary-100' : 'text-slate-400'}`}>{msg.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Input messaging bar */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex gap-2 items-center">
                  <input 
                    type="text"
                    placeholder="Type raw material inquiries, transport optimizations, delivery times..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  />
                  <button 
                    type="submit"
                    className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md shadow-primary-200 transition-all cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 h-full">
                <Compass className="h-10 w-10 text-slate-300" />
                <h3 className="font-bold text-slate-700 text-sm">Select a contact</h3>
                <p className="text-xs text-slate-400">Click on any contact to start direct peer-to-peer sourcing chats.</p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Chat;

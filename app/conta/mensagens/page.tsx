'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  getConversations,
  getMessages,
  sendMessage,
  listenToMessages,
  markAsRead,
} from '@/lib/firestore/chat';
import { Conversation, Message } from '@/lib/types';
import { Loader2, Send, MessageSquare } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/components/Toast';

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/admin/login');
        return;
      }

      fetchConversations();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
      markConversationAsRead();
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      if (user?.uid) {
        const data = await getConversations(user.uid);
        setConversations(data.sort((a, b) => 
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        ));
        if (data.length > 0 && !selectedConversation) {
          setSelectedConversation(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      addToast('Erro ao carregar mensagens', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedConversation) return;
    try {
      const data = await getMessages(selectedConversation);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markConversationAsRead = async () => {
    if (!selectedConversation || !user?.uid) return;
    try {
      await markAsRead(selectedConversation, user.uid);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation || !user) return;

    try {
      setSending(true);
      await sendMessage(
        selectedConversation,
        user.uid,
        user.name,
        messageText
      );
      setMessageText('');
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      addToast('Erro ao enviar mensagem', 'error');
    } finally {
      setSending(false);
    }
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const otherParticipantName = currentConversation && user?.uid
    ? currentConversation.participantNames[
        currentConversation.participantIds.find(id => id !== user.uid) || ''
      ]
    : '';

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex h-[calc(100vh-80px)] max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Conversations List */}
        <div className="w-full sm:w-80 border-r border-gray-200 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Mensagens</h2>
            <p className="text-sm text-gray-600">{conversations.length} conversa{conversations.length !== 1 ? 's' : ''}</p>
          </div>

          {conversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <MessageSquare className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="text-gray-600 text-sm">Nenhuma conversa ainda</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => {
                const isSelected = conv.id === selectedConversation;
                const otherUid = conv.participantIds.find(id => id !== user?.uid);
                const unreadBadge = conv.unreadCount[user?.uid || ''] || 0;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-4 border-b border-gray-100 text-left transition ${
                      isSelected
                        ? 'bg-green-50 border-l-4 border-l-green-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {conv.participantNames[otherUid || '']}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {conv.lastMessage}
                        </p>
                      </div>
                      {unreadBadge > 0 && (
                        <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white text-xs font-bold">
                          {unreadBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(conv.lastMessageAt).toLocaleTimeString('pt-MZ', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Window */}
        {selectedConversation ? (
          <div className="hidden sm:flex flex-1 flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <p className="font-medium text-gray-900">{otherParticipantName}</p>
              <p className="text-sm text-gray-600">
                {messages.length} mensagem{messages.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-600">Nenhuma mensagem nesta conversa</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${
                      message.senderId === user?.uid ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.senderId === user?.uid
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === user?.uid
                            ? 'text-green-100'
                            : 'text-gray-600'
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString('pt-MZ', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 flex gap-2"
            >
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Escreva uma mensagem..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                disabled={sending || !messageText.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
              >
                {sending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="hidden sm:flex flex-1 items-center justify-center">
            <p className="text-gray-600">Selecione uma conversa para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}

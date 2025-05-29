
import { useState, useEffect } from 'react';
import { MessageSquare, Send, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Message, User as UserType } from '@/models/types';

const Messages = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load mock conversations
    const mockConversations = [
      {
        id: '1',
        user: {
          id: 'seller1',
          name: 'John Doe',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
          lastSeen: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
        },
        lastMessage: 'Is this item still available?',
        lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
        unreadCount: 2,
        productTitle: 'iPhone 13 Pro',
        messages: [
          {
            id: 'm1',
            fromUser: 'seller1',
            content: 'Hi, I\'m interested in your iPhone 13 Pro. Is it still available?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isRead: true
          },
          {
            id: 'm2',
            fromUser: 'current',
            content: 'Yes, it\'s still available! Are you interested in making an offer?',
            timestamp: new Date(Date.now() - 90 * 60 * 1000),
            isRead: true
          },
          {
            id: 'm3',
            fromUser: 'seller1',
            content: 'Is this item still available?',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            isRead: false
          }
        ]
      },
      {
        id: '2',
        user: {
          id: 'buyer2',
          name: 'Sarah Smith',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
          lastSeen: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
        },
        lastMessage: 'Great! I\'ll take it.',
        lastMessageTime: new Date(Date.now() - 10 * 60 * 1000),
        unreadCount: 0,
        productTitle: 'Vintage Camera',
        messages: [
          {
            id: 'm4',
            fromUser: 'current',
            content: 'Hello! Thanks for your interest in the vintage camera.',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            isRead: true
          },
          {
            id: 'm5',
            fromUser: 'buyer2',
            content: 'Great! I\'ll take it.',
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            isRead: true
          }
        ]
      }
    ];
    setConversations(mockConversations);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation) {
        const newMsg = {
          id: `m${Date.now()}`,
          fromUser: 'current',
          content: newMessage,
          timestamp: new Date(),
          isRead: true
        };
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          lastMessage: newMessage,
          lastMessageTime: new Date()
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setNewMessage('');
  };

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.productTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Messages
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0">
                  <div className="space-y-0">
                    {filteredConversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv.id)}
                        className={`p-4 cursor-pointer border-b hover:bg-gray-50 transition-colors ${
                          selectedConversation === conv.id ? 'bg-blue-50 border-r-2 border-r-[#3665f3]' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={conv.user.avatar}
                            alt={conv.user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm truncate">{conv.user.name}</h4>
                              <span className="text-xs text-gray-500">
                                {conv.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{conv.productTitle}</p>
                            <p className="text-sm text-gray-700 truncate">{conv.lastMessage}</p>
                            {conv.unreadCount > 0 && (
                              <div className="mt-2">
                                <span className="bg-[#3665f3] text-white text-xs px-2 py-1 rounded-full">
                                  {conv.unreadCount}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                {selectedConv ? (
                  <>
                    {/* Chat Header */}
                    <CardHeader className="border-b">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedConv.user.avatar}
                          alt={selectedConv.user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium">{selectedConv.user.name}</h3>
                          <p className="text-sm text-gray-600">
                            About: {selectedConv.productTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            Last seen {selectedConv.user.lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Messages */}
                    <CardContent className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-4">
                        {selectedConv.messages.map((message: any) => (
                          <div
                            key={message.id}
                            className={`flex ${message.fromUser === 'current' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.fromUser === 'current'
                                  ? 'bg-[#3665f3] text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.fromUser === 'current' ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    {/* Message Input */}
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1 min-h-[60px] max-h-[120px]"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button onClick={handleSendMessage} className="self-end">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <CardContent className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">Select a conversation</h3>
                      <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Messages;

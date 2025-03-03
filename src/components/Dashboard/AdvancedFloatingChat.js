// import React, { useState, useEffect, useRef } from 'react';
// import { getChats, getChatMessages, sendMessage, getNotifications, markNotificationRead, subscribeToNewMessages, subscribeToNewNotifications, createNewChat } from '../../services/api';
// import { useAuth } from '../../contexts/AuthContext';
// import { Minimize2, Maximize2, X, Send, Bell, MessageSquare } from 'lucide-react';

// const UserSelectionInterface = ({ onUserSelected, onCancel }) => {
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     // Fetch users from your API
//     // This is a placeholder. You need to implement the actual API call.
//     const fetchUsers = async () => {
//       // const response = await apiService.get('/users');
//       // setUsers(response.data);
//       setUsers([
//         { id: 1, username: 'User1' },
//         { id: 2, username: 'User2' },
//         // ... more users
//       ]);
//     };
//     fetchUsers();
//   }, []);

//   const filteredUsers = users.filter(user => 
//     user.username.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="bg-white p-4 rounded shadow-lg">
//       <input 
//         type="text" 
//         placeholder="Search users..." 
//         value={searchTerm} 
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full p-2 mb-4 border rounded"
//       />
//       {filteredUsers.map(user => (
//         <div 
//           key={user.id} 
//           onClick={() => onUserSelected(user.id)}
//           className="cursor-pointer hover:bg-gray-100 p-2 rounded"
//         >
//           {user.username}
//         </div>
//       ))}
//       <button 
//         onClick={onCancel}
//         className="mt-4 bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
//       >
//         Cancel
//       </button>
//     </div>
//   );
// };

// const AdvancedFloatingChat = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [notifications, setNotifications] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showUserSelection, setShowUserSelection] = useState(false);
//   const messagesEndRef = useRef(null);
//   const { user } = useAuth();

//   useEffect(() => {
//     if (isOpen) {
//       fetchChats();
//       fetchNotifications();
//       subscribeToNewMessages(handleNewMessage);
//       subscribeToNewNotifications(handleNewNotification);
//     }
//     return () => {
//       // Unsubscribe from new messages and notifications when component unmounts
//       // Implement unsubscribe function in your API if needed
//     };
//   }, [isOpen]);

//   useEffect(() => {
//     if (selectedChat) {
//       fetchMessages(selectedChat.id);
//     }
//   }, [selectedChat]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const fetchChats = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const fetchedChats = await getChats();
//       if (Array.isArray(fetchedChats)) {
//         setChats(fetchedChats);
//       } else {
//         console.error('Fetched chats is not an array:', fetchedChats);
//         setChats([]);
//         setError('Received invalid data for chats');
//       }
//     } catch (error) {
//       console.error('Error fetching chats:', error);
//       setChats([]);
//       setError('Failed to fetch chats. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchMessages = async (chatId) => {
//     try {
//       const fetchedMessages = await getChatMessages(chatId);
//       setMessages(fetchedMessages);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       setError('Failed to fetch messages. Please try again.');
//     }
//   };

//   const fetchNotifications = async () => {
//     try {
//       const fetchedNotifications = await getNotifications();
//       setNotifications(fetchedNotifications);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       setError('Failed to fetch notifications. Please try again.');
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedChat) return;

//     try {
//       await sendMessage(selectedChat.id, newMessage);
//       setNewMessage('');
//       fetchMessages(selectedChat.id);
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setError('Failed to send message. Please try again.');
//     }
//   };

//   const handleNewMessage = (message) => {
//     if (message.chatId === selectedChat?.id) {
//       setMessages(prev => [...prev, message]);
//     }
//   };

//   const handleNewNotification = (notification) => {
//     setNotifications(prev => [notification, ...prev]);
//   };

//   const handleMarkNotificationAsRead = async (notificationId) => {
//     try {
//       await markNotificationRead(notificationId);
//       setNotifications(prev => prev.filter(n => n.id !== notificationId));
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//       setError('Failed to mark notification as read. Please try again.');
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleStartNewChat = () => {
//     setShowUserSelection(true);
//   };

//   const handleUserSelected = async (selectedUserId) => {
//     try {
//       const response = await createNewChat(selectedUserId);
//       if (response.chat) {
//         setChats(prevChats => [...prevChats, response.chat]);
//         setSelectedChat(response.chat);
//       }
//       setShowUserSelection(false);
//     } catch (error) {
//       console.error('Error creating new chat:', error);
//       setError('Failed to create new chat. Please try again.');
//     }
//   };

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       {!isOpen ? (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
//         >
//           <MessageSquare size={24} />
//         </button>
//       ) : (
//         <div className="bg-white rounded-lg shadow-xl w-80 flex flex-col" style={{ height: isMinimized ? 'auto' : '500px' }}>
//           <div className="bg-blue-500 text-white p-3 rounded-t-lg flex justify-between items-center">
//             <h3 className="font-bold">Chat</h3>
//             <div className="flex items-center">
//               {isMinimized ? (
//                 <Maximize2 onClick={() => setIsMinimized(false)} className="cursor-pointer mr-2" />
//               ) : (
//                 <Minimize2 onClick={() => setIsMinimized(true)} className="cursor-pointer mr-2" />
//               )}
//               <X onClick={() => setIsOpen(false)} className="cursor-pointer" />
//             </div>
//           </div>
//           {!isMinimized && (
//             <>
//               <div className="flex-grow overflow-y-auto p-3" style={{ height: '400px' }}>
//                 {error && <p className="text-red-500">{error}</p>}
//                 {selectedChat ? (
//                   <>
//                     <div className="mb-2 pb-2 border-b flex justify-between items-center">
//                       <span className="font-semibold">{selectedChat.participant.username}</span>
//                       <button onClick={() => setSelectedChat(null)} className="text-sm text-blue-500">
//                         Back to chats
//                       </button>
//                     </div>
//                     {messages.map(message => (
//                       <div 
//                         key={message.id} 
//                         className={`mb-2 ${message.sender.id === user.id ? 'text-right' : 'text-left'}`}
//                       >
//                         <span 
//                           className={`inline-block rounded-lg px-3 py-2 max-w-[70%] ${
//                             message.sender.id === user.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
//                           }`}
//                         >
//                           {message.content}
//                         </span>
//                         <div className="text-xs text-gray-500 mt-1">
//                           {new Date(message.timestamp).toLocaleTimeString()}
//                         </div>
//                       </div>
//                     ))}
//                     <div ref={messagesEndRef} />
//                   </>
//                 ) : (
//                   <>
//                     <div className="mb-4">
//                       <h4 className="font-semibold mb-2">Notifications</h4>
//                       {notifications.map(notification => (
//                         <div key={notification.id} className="bg-gray-100 p-2 mb-2 rounded">
//                           <p>{notification.message}</p>
//                           <button 
//                             onClick={() => handleMarkNotificationAsRead(notification.id)}
//                             className="text-xs text-blue-500 mt-1"
//                           >
//                             Mark as read
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                     <h4 className="font-semibold mb-2">Chats</h4>
//                     {isLoading ? (
//                       <p>Loading chats...</p>
//                     ) : chats && chats.length > 0 ? (
//                       chats.map(chat => (
//                         <div
//                           key={chat.id}
//                           onClick={() => setSelectedChat(chat)}
//                           className="cursor-pointer hover:bg-gray-100 p-2 rounded"
//                         >
//                           {chat.participant && chat.participant.username ? chat.participant.username : 'Unknown User'}
//                         </div>
//                       ))
//                     ) : (
//                       <p>No chats available.</p>
//                     )}
//                     <button 
//                       onClick={handleStartNewChat}
//                       className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
//                     >
//                       Start New Chat
//                     </button>
//                   </>
//                 )}
//               </div>
//               {selectedChat && (
//                 <div className="p-3 border-t">
//                   <div className="flex items-center">
//                     <input
//                       type="text"
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                       className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Type a message..."
//                     />
//                     <button
//                       onClick={handleSendMessage}
//                       className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition-colors"
//                     >
//                       <Send size={20} />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}
//       {showUserSelection && (
//         <UserSelectionInterface 
//           onUserSelected={handleUserSelected}
//           onCancel={() => setShowUserSelection(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default AdvancedFloatingChat;
import React, { useState, useEffect, useRef } from 'react';
import { getChats, getChatMessages, sendMessage, subscribeToNewMessages, createNewChat } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Minimize2, Maximize2, X, Send, MessageSquare } from 'lucide-react';

const UserSelectionInterface = ({ onUserSelected, onCancel }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setUsers([
        { id: 1, username: 'User1' },
        { id: 2, username: 'User2' },
        // ... more users
      ]);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <input 
        type="text" 
        placeholder="Search users..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      {filteredUsers.map(user => (
        <div 
          key={user.id} 
          onClick={() => onUserSelected(user.id)}
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
        >
          {user.username}
        </div>
      ))}
      <button 
        onClick={onCancel}
        className="mt-4 bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  );
};

const AdvancedFloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUserSelection, setShowUserSelection] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchChats();
      subscribeToNewMessages(handleNewMessage);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedChats = await getChats();
      if (Array.isArray(fetchedChats)) {
        setChats(fetchedChats);
      } else {
        console.error('Fetched chats is not an array:', fetchedChats);
        setChats([]);
        setError('Received invalid data for chats');
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
      setError('Failed to fetch chats. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const fetchedMessages = await getChatMessages(chatId);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages. Please try again.');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await sendMessage(selectedChat.id, newMessage);
      setNewMessage('');
      fetchMessages(selectedChat.id);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  const handleNewMessage = (message) => {
    if (message.chatId === selectedChat?.id) {
      setMessages(prev => [...prev, message]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartNewChat = () => {
    setShowUserSelection(true);
  };

  const handleUserSelected = async (selectedUserId) => {
    try {
      const response = await createNewChat(selectedUserId);
      if (response.chat) {
        setChats(prevChats => [...prevChats, response.chat]);
        setSelectedChat(response.chat);
      }
      setShowUserSelection(false);
    } catch (error) {
      console.error('Error creating new chat:', error);
      setError('Failed to create new chat. Please try again.');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <MessageSquare size={24} />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 flex flex-col" style={{ height: isMinimized ? 'auto' : '500px' }}>
          <div className="bg-blue-500 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">Chat</h3>
            <div className="flex items-center">
              {isMinimized ? (
                <Maximize2 onClick={() => setIsMinimized(false)} className="cursor-pointer mr-2" />
              ) : (
                <Minimize2 onClick={() => setIsMinimized(true)} className="cursor-pointer mr-2" />
              )}
              <X onClick={() => setIsOpen(false)} className="cursor-pointer" />
            </div>
          </div>
          {!isMinimized && (
            <>
              <div className="flex-grow overflow-y-auto p-3" style={{ height: '400px' }}>
                {error && <p className="text-red-500">{error}</p>}
                {selectedChat ? (
                  <>
                    <div className="mb-2 pb-2 border-b flex justify-between items-center">
                      <span className="font-semibold">{selectedChat.participant.username}</span>
                      <button onClick={() => setSelectedChat(null)} className="text-sm text-blue-500">
                        Back to chats
                      </button>
                    </div>
                    {messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`mb-2 ${message.sender.id === user.id ? 'text-right' : 'text-left'}`}
                      >
                        <span 
                          className={`inline-block rounded-lg px-3 py-2 max-w-[70%] ${
                            message.sender.id === user.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
                          }`}
                        >
                          {message.content}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold mb-2">Chats</h4>
                    {isLoading ? (
                      <p>Loading chats...</p>
                    ) : chats && chats.length > 0 ? (
                      chats.map(chat => (
                        <div
                          key={chat.id}
                          onClick={() => setSelectedChat(chat)}
                          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                        >
                          {chat.participant && chat.participant.username ? chat.participant.username : 'Unknown User'}
                        </div>
                      ))
                    ) : (
                      <p>No chats available.</p>
                    )}
                    <button 
                      onClick={handleStartNewChat}
                      className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
                    >
                      Start New Chat
                    </button>
                  </>
                )}
              </div>
              {selectedChat && (
                <div className="p-3 border-t">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type a message..."
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition-colors"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {showUserSelection && (
        <UserSelectionInterface 
          onUserSelected={handleUserSelected}
          onCancel={() => setShowUserSelection(false)}
        />
      )}
    </div>
  );
};

export default AdvancedFloatingChat;

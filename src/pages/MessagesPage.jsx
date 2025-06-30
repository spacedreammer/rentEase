import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { format, isToday, isYesterday } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentUserId = parseInt(localStorage.getItem("user_id"));

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, "p");
    } else if (isYesterday(date)) {
      return "Yesterday " + format(date, "p");
    } else {
      return format(date, "MMM d, p");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Memoized function to get auth headers
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required.");
      navigate("/login");
      return {};
    }
    return { Authorization: `Bearer ${token}` };
  }, [navigate]);

  // Memoized function to fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      setError(null);
      const headers = getAuthHeaders();
      if (!headers.Authorization) return [];

      const response = await axios.get(`${API_BASE_URL}/api/auth/messages`, {
        headers,
      });
      setConversations(response.data);
      return response.data; // Return data for immediate use in other effects
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(err.response?.data?.message || "Failed to load conversations.");
      toast.error(
        "Failed to load conversations: " +
          (err.response?.data?.message || err.message)
      );
      return [];
    } finally {
      setLoadingConversations(false);
    }
  }, [getAuthHeaders]);

  // Memoized function to fetch messages for a specific user
  const fetchConversationMessages = useCallback(
    async (userId) => {
      if (!userId) {
        // Ensure a userId is provided
        setMessages([]);
        return;
      }
      try {
        setLoadingMessages(true);
        setError(null);
        const headers = getAuthHeaders();
        if (!headers.Authorization) return;

        const response = await axios.get(
          `${API_BASE_URL}/api/auth/messages/conversation/${userId}`,
          { headers }
        );
        setMessages(response.data);
        // After fetching, re-fetch conversations to update unread counts or latest message in sidebar
        fetchConversations();
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(err.response?.data?.message || "Failed to load messages.");
        toast.error(
          "Failed to load messages: " +
            (err.response?.data?.message || err.message)
        );
        setMessages([]); // Clear messages on error
      } finally {
        setLoadingMessages(false);
      }
    },
    [getAuthHeaders, fetchConversations]
  );

  // --- Effect 1: Initial conversation fetch on component mount ---
  useEffect(() => {
    fetchConversations();
    
    const intervalId = setInterval(() => {
      fetchConversations();
      if (selectedUser?.user_id) {
        fetchConversationMessages(selectedUser.user_id);
      }
    }, 10000); // Poll every 5 seconds
  
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [fetchConversations]); // Dependency on memoized fetchConversations

  // --- Effect 2: Handle initial user selection from location.state or first conversation ---
  useEffect(() => {
    const passedRecipient = location.state?.recipient;

    if (passedRecipient) {
      // If a recipient is passed via state, always set them as the selected user
      // This overrides any previously selected user or first conversation selection
      setSelectedUser(passedRecipient);
      // Clear the state after use so refreshing the page doesn't re-select the same user
      navigate(location.pathname, { replace: true, state: {} });
    } else if (conversations.length > 0 && !selectedUser) {
      // If no recipient from state, but conversations exist and no user is currently selected,
      // select the first conversation. This handles direct navigation to /tenant/messages
      // without a specific recipient.
      setSelectedUser(conversations[0]);
    }
  }, [
    location.state,
    conversations,
    selectedUser,
    navigate,
    location.pathname,
  ]);

  // --- Effect 3: Fetch messages whenever the selectedUser changes ---
  useEffect(() => {
    if (selectedUser?.user_id) {
      // Ensure selectedUser and its ID exist before fetching messages
      fetchConversationMessages(selectedUser.user_id);
    } else {
      setMessages([]); // Clear messages if no user is selected
    }
  }, [selectedUser, fetchConversationMessages]);

  // --- Effect 4: Auto-scroll to the bottom of messages when they update ---
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) {
      toast.warn("Message cannot be empty or no user selected.");
      return;
    }

    setSendingMessage(true);
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) return;

      const response = await axios.post(
        `${API_BASE_URL}/api/auth/messages`,
        {
          receiver_id: selectedUser.user_id,
          message_content: newMessage,
        },
        { headers }
      );
      setMessages((prevMessages) => [...prevMessages, response.data.data]);
      setNewMessage("");
      toast.success("Message sent!");
      fetchConversations(); // Re-fetch conversations to update latest message in sidebar
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error(
        "Failed to send message: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setSendingMessage(false);
    }
  };

  // Conditional rendering for initial loading state
  if (loadingConversations && !conversations.length && !selectedUser) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-xl text-gray-700">Loading messages...</p>
      </div>
    );
  }

  // Conditional rendering for error state
  if (error && !conversations.length && !messages.length) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-red-600">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      {/* Conversation List Sidebar */}
      <div className="w-full md:w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
        <h2 className="text-xl font-bold p-4 border-b border-gray-200">
          Conversations
        </h2>
        {conversations.length === 0 && !selectedUser ? (
          <p className="text-gray-500 p-4">No conversations yet.</p>
        ) : (
          <ul>
            {conversations.map((conv) => (
              <li
                key={conv.user_id}
                className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 ${
                  selectedUser && selectedUser.user_id === conv.user_id
                    ? "bg-blue-50"
                    : ""
                }`}
                onClick={() => setSelectedUser(conv)} // Directly set selectedUser on click
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">
                      {conv.fname} {conv.lname}
                    </p>
                    {conv.unread_count > 0 && (
                      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.latest_message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {conv.latest_message_time}
                  </p>
                </div>
              </li>
            ))}
            {/* Display the selected user in the sidebar if they are NOT already in the conversations list (new chat) */}
            {selectedUser &&
              !conversations.some(
                (conv) => conv.user_id === selectedUser.user_id
              ) && (
                <li
                  key={`new-${selectedUser.user_id}`} // Use a unique key for new entries
                  className={`flex items-center p-4 border-b border-gray-100 cursor-pointer bg-blue-50`}
                  onClick={() => setSelectedUser(selectedUser)}>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-800">
                        {selectedUser.fname} {selectedUser.lname}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">New Conversation</p>
                  </div>
                </li>
              )}
          </ul>
        )}
      </div>

      {/* Message Display Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {selectedUser ? (
          <>
            <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Chat with {selectedUser.fname} {selectedUser.lname}
              </h2>
              <span className="text-sm text-gray-600">
                {selectedUser.email}
              </span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {loadingMessages ? (
                <p className="text-center text-gray-600">Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-gray-600">
                  No messages in this conversation yet. Say hello!
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === currentUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}>
                    <div
                      className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                        message.sender_id === currentUserId
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800"
                      }`}>
                      <p>{message.message_content}</p>
                      {message.house && (
                        <p className="text-xs opacity-70 mt-1">
                          Regarding:{" "}
                          <a
                            href={`${API_BASE_URL}/houses/${message.house.id}`}
                            className="underline">
                            {message.house.title}
                          </a>
                        </p>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          message.sender_id === currentUserId
                            ? "text-blue-200"
                            : "text-gray-500"
                        }`}>
                        {formatMessageTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white border-t border-gray-200 flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={sendingMessage}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-r-md transition duration-300 disabled:opacity-50"
                disabled={sendingMessage}>
                {sendingMessage ? "Sending..." : "Send"}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600 text-xl">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;

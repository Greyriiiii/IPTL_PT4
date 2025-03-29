import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Navbar from '../navbar';
import { useTheme, useMediaQuery } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const socket = io('http://localhost:3001'); // Define the socket variable

const Messages = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const location = useLocation();
  const initialChatUser = location.state?.user || null;
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: alt,
      minHeight: '100vh',
    },
    messengerContainer: {
      display: 'flex',
      width: '100%',
      maxWidth: '1200px',
      border: `1px solid ${neutralLight}`,
      borderRadius: '5px',
      backgroundColor: background,
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    sidebar: {
      width: '300px',
      borderRight: `1px solid ${neutralLight}`,
      padding: '20px',
      backgroundColor: alt,
    },
    contact: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      cursor: 'pointer',
      borderBottom: `1px solid ${neutralLight}`,
    },
    contactImage: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      marginRight: '10px',
    },
    chatContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
    },
    chatHeader: {
      borderBottom: `1px solid ${neutralLight}`,
      paddingBottom: '10px',
      marginBottom: '10px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: dark,
    },
    messagesList: {
      flex: 1,
      overflowY: 'auto',
      marginBottom: '20px',
      backgroundColor: background,
      padding: '10px',
      borderRadius: '5px',
      border: `1px solid ${neutralLight}`,
      display: 'flex',
      flexDirection: 'column',
    },
    message: {
      padding: '10px',
      borderBottom: `1px solid ${neutralLight}`,
      backgroundColor: alt,
      borderRadius: '5px',
      marginBottom: '10px',
      color: dark,
    },
    messageForm: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: background,
      padding: '10px',
      borderRadius: '5px',
      border: `1px solid ${neutralLight}`,
    },
    input: {
      flex: 1,
      padding: '10px',
      marginRight: '10px',
      borderRadius: '5px',
      border: `1px solid ${neutralLight}`,
      backgroundColor: alt,
      color: dark,
    },
    button: {
      padding: '10px 20px',
      backgroundColor: primaryLight,
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    media: {
      maxWidth: "100%",
      borderRadius: "5px",
      marginTop: "10px",
    },
  };

  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(initialChatUser);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/${user._id}/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [user._id, token]);

  useEffect(() => {
    const fetchActiveStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3001/users/active-status", {
          headers: { Authorization: `Bearer ${token}` }, // Include token if required
        });
        setFriends((prevFriends) =>
          prevFriends.map((friend) => ({
            ...friend,
            isActive: response.data.activeUsers.includes(friend._id),
          }))
        );
      } catch (error) {
        console.error("Error fetching active status:", error);
      }
    };
  
    fetchActiveStatus();
    const interval = setInterval(fetchActiveStatus, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const [file, setFile] = useState(null); // State to store the selected file

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedChat) return;
  
    const formData = new FormData();
    formData.append("text", newMessage);
    formData.append("recipientId", selectedChat._id);
    formData.append("senderId", user._id);
    if (file) {
      formData.append("file", file); // Add the file to the form data
    }
  
    console.log("FormData:", Array.from(formData.entries())); // Log the form data
  
    try {
      const response = await axios.post("http://localhost:3001/api/messages", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Response:", response.data); // Log the response
      setMessages([...messages, response.data]);
      setNewMessage("");
      setFile(null); // Clear the file input
  
      // Move the recipient to the top of the sidebar
      setFriends((prevFriends) => {
        const updatedFriends = prevFriends.filter((friend) => friend._id !== selectedChat._id);
        return [selectedChat, ...updatedFriends];
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const startChat = async (friend) => {
    setSelectedChat(friend);

    try {
      const response = await axios.get(`http://localhost:3001/api/messages/${user._id}/${friend._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.messengerContainer}>
          <div style={styles.sidebar}>
            <h3>Chats</h3>
            {friends.map((friend) => (
              <div key={friend._id} className="contact" onClick={() => startChat(friend)} style={styles.contact}>
                <img src={`http://localhost:3001/assets/${friend.picturePath}`} alt="User" style={styles.contactImage} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>{friend.firstName}</span>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: friend.isActive ? 'green' : 'grey',
                      marginLeft: '10px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={styles.chatContainer}>
            <div style={styles.chatHeader}>{selectedChat ? selectedChat.firstName : 'Select a chat'}</div>
            <div style={styles.messagesList}>
  {messages.map((message, index) => (
    <div
      key={index}
      style={{
        ...styles.message,
        backgroundColor: message.senderId === user._id ? primaryLight : alt,
        color: message.senderId === user._id ? "#fff" : dark,
        alignSelf: message.senderId === user._id ? "flex-end" : "flex-start",
        borderRadius: message.senderId === user._id ? "15px 15px 0 15px" : "15px 15px 15px 0",
        maxWidth: "60%",
        marginBottom: "10px",
      }}
    >
      {message.text && <p style={{ margin: 0 }}>{message.text}</p>}
      {message.imageUrl && <img src={`http://localhost:3001/${message.imageUrl}`} alt="Sent" style={styles.media} />}
      {message.videoUrl && (
        <video controls style={styles.media}>
          <source src={`http://localhost:3001/${message.videoUrl}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>
            {selectedChat && (
              <form onSubmit={handleSendMessage} style={styles.messageForm}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                  required={!file} // Make text optional if a file is uploaded
                  style={styles.input}
                />
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    console.log("Selected file:", e.target.files[0]); // Log the selected file
                    setFile(e.target.files[0]);
                  }}
                  style={{ marginRight: "10px" }}
                />
                <button type="submit" style={styles.button}>Send</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
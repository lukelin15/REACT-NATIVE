import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { auth } from '@/lib/firebase';

export default function Chat() {
  const [messages, setMessages] = useState([
    { sender: "Bot", text: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const scrollViewRef = useRef<ScrollView | null>(null);

  const sendMessageToBackend = async (userMessage: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from AI.");
      }

      const data = await response.json();
      return data.ai_response;
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
      return "Sorry, I encountered an error.";
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { sender: "User", text: input };
      setMessages(prevMessages => [...prevMessages, userMessage]);

      setInput(""); // Clear input field immediately after sending

      const botResponse = await sendMessageToBackend(input);
      const botMessage = { sender: "Bot", text: botResponse };

      setMessages(prevMessages => [...prevMessages, botMessage]);

      // Ensure the scroll view goes to the latest message
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat</Text>
      <ScrollView
        style={styles.chatContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message, index) => (
          <View key={index} style={[styles.messageBubble, message.sender === "User" ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#2E8B57",
    marginBottom: 10,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 20,
  },
  messageBubble: {
    padding: 12,
    marginVertical: 8,
    maxWidth: '75%',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  userMessage: {
    backgroundColor: "#2E8B57",
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: "#D1E7DD",
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    height: 45,
    width: '85%',
    borderRadius: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    borderColor: '#2E8B57',
    borderWidth: 1,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#2E8B57",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold',
  },
});

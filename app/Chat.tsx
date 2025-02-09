import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';

export default function Chat() {
  const [messages, setMessages] = useState([
    { sender: "User", text: "Hello!" },
    { sender: "Bot", text: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const scrollViewRef = useRef<ScrollView | null>(null); // ✅ Fix: Explicit type

  const handleSend = () => {
    if (input.trim()) {  
      setMessages(prevMessages => {
        const newMessages = [...prevMessages, { sender: "User", text: input }, { sender: "Bot", text: "This is a placeholder response." }];
        
        // Ensure scrolling happens after state updates
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        return newMessages;
      });

      setInput("");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/chat.png')} style={styles.image} />
      <Text style={styles.title}>Chat</Text>
      <ScrollView 
        style={styles.chatContainer} 
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message, index) => (
          <View key={index} style={[styles.messageBubble, message.sender === "User" ? styles.userMessage : styles.botMessage]}>
            <Text style={[styles.messageText, message.sender === "User" ? styles.userMessageText : styles.botMessageText]}>
              {message.text}
            </Text>
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
  image: {
    width: 50,
    height: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#2E8B57",  
    marginBottom: 2,
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
    margin: 20,
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
  userMessageText: {
    color: "#fff",
  },
  botMessageText: {
    color: "#333",
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

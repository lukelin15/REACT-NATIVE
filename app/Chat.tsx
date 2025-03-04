import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, SafeAreaView, Keyboard } from 'react-native';
import { auth } from '@/lib/firebase';
import RoutePlanner from './Route';


export default function Chat() {
  const [messages, setMessages] = useState([{ sender: "Bot", text: "Hi! How can I help you today?" }]);
  const [input, setInput] = useState("");
  const [shoppingList, setShoppingList] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [storeAddresses, setStoreAddresses] = useState<string[]>([]);
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [showGenerateButton, setShowGenerateButton] = useState(false);

  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const stripMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/```(.*?)```/gs, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1');
  };

  const sendMessageToBackend = async (userMessage: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Authentication Error", "You must be logged in to chat.");
        return "You need to sign in first.";
      }

      const token = await user.getIdToken();
      const uid = user.uid;

      const response = await fetch("http://localhost:8002/chat", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ uid, message: userMessage }),
      });

      if (!response.ok) throw new Error("Failed to fetch response from AI.");
      
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
      setMessages(prev => [...prev, { sender: "User", text: input }]);
      setInput("");
      const botResponse = await sendMessageToBackend(input);
      setMessages(prev => [...prev, { sender: "Bot", text: botResponse }]);
      setShowGenerateButton(true);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const generateShoppingList = async () => {
    try {
      setLoadingList(true);
      setModalVisible(true);
      setShowGenerateButton(false);

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Authentication Error", "You must be logged in.");
        setLoadingList(false);
        setModalVisible(false);
        return;
      }

      const token = await user.getIdToken();
      const uid = user.uid;

      const response = await fetch(`http://localhost:8002/generate-shopping-list/${uid}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch shopping list.");

      const data = await response.json();
      setShoppingList(data);

      if (data.list_data?.store_recommendations?.stores) {
        const extractedAddresses = data.list_data.store_recommendations.stores.map((store: any) => store.address);
        setStoreAddresses(extractedAddresses);
  
        if (extractedAddresses.length > 1) {
          setOrigin(extractedAddresses[0]); // First store
          setDestination(extractedAddresses[extractedAddresses.length - 1]); // Last store
          setWaypoints(extractedAddresses.slice(1, -1)); // Middle stores as waypoints
        }
      } else {
        setStoreAddresses([]);
      }

    } catch (error) {
      console.error("Error generating shopping list:", error);
      Alert.alert("Error", "Failed to generate shopping list. Please try again.");
    } finally {
      setLoadingList(false);
    }
  };

  const deleteItemFromShoppingList = async (itemName: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Authentication Error", "You must be logged in.");
        return;
      }

      const token = await user.getIdToken();
      const uid = user.uid;

      const response = await fetch(`http://localhost:8002/shopping-list/${uid}/delete-item/${encodeURIComponent(itemName)}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete item.");

      // Remove only the selected item from the frontend state
      setShoppingList(prevList => ({
        ...prevList,
        items: prevList.items.filter(item => item.name !== itemName)
      }));

      Alert.alert("Success", `Item '${itemName}' removed successfully`);
    } catch (error) {
      console.error("Failed to delete item", error);
      Alert.alert("Error", "Failed to delete item.");
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 90}
      >
        <View style={styles.container}>
          <ScrollView 
            style={styles.chatContainer} 
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollViewContent}
          >
            {messages.map((message, index) => (
              <View key={index} style={[styles.messageBubble, message.sender === "User" ? styles.userMessage : styles.botMessage]}>
                <Text style={[styles.messageText, message.sender === "User" ? styles.userMessageText : styles.botMessageText]}>{stripMarkdown(message.text)}</Text>
              </View>
            ))}
          </ScrollView>

      {showGenerateButton && (
            <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={generateShoppingList} style={styles.generateButton}>
                <Text style={styles.generateButtonText}>Generate Shopping List</Text>
              </TouchableOpacity>
      )}

            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="Type your message..." 
                value={input} 
                onChangeText={setInput}
                multiline={false}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
              />
              <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Keep Modal at the end */}
        <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.listTitle}>Shopping List</Text>
              {loadingList ? (
                <ActivityIndicator size="large" color="#2E8B57" />
              ) : (
                <>
                  <Text style={styles.listSubtitle}>Locations:</Text>
                  {shoppingList?.locations.map((location, index) => (
                    <Text key={index} style={styles.listItem}>- {location}</Text>
                  ))}
                  <Text style={styles.listSubtitle}>Items:</Text>
                  {shoppingList?.items.map((item, index) => (
                    <View key={index} style={styles.listItemContainer}>
                      <Text style={styles.listItemText}>
                        {item.name} - ${item.price.toFixed(2)} ({item.location})
                      </Text>
                      <TouchableOpacity onPress={() => deleteItemFromShoppingList(item.name)} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              )}

              <TouchableOpacity onPress={addItemToShoppingList} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Item</Text>
              </TouchableOpacity>

              {storeAddresses.length > 0 && (
                <TouchableOpacity 
                  onPress={() => setModalVisible(false)} // Close modal before opening route planner
                  style={styles.routeButton}
                >
                  <Text style={styles.routeButtonText}>Show Route</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Add RoutePlanner Below */}
        {storeAddresses.length > 0 && (
          <RoutePlanner origin={origin} destination={destination} waypoints={waypoints} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f7f7f7" },
  title: { fontSize: 20, fontWeight: 'bold', color: "#2E8B57", marginBottom: 10, textAlign: 'center' },
  chatContainer: { flex: 1, marginBottom: 20 },
  messageBubble: { padding: 12, marginVertical: 8, maxWidth: '75%', borderRadius: 20, marginHorizontal: 10 },
  userMessage: { backgroundColor: "#2E8B57", alignSelf: 'flex-end' },
  botMessage: { backgroundColor: "#D1E7DD", alignSelf: 'flex-start' },
  messageText: { fontSize: 16, lineHeight: 22 },
  generateButton: { backgroundColor: "#FFA500", paddingVertical: 12, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  generateButtonText: { color: "#fff", fontSize: 16, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: '80%' },
  listTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  listItem: { fontSize: 16, marginBottom: 5 },
  listItemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, position: 'relative' },
  itemInput: { flex: 1, backgroundColor: "#fff", padding: 10, borderRadius: 10, borderWidth: 1, borderColor: "#2E8B57", marginHorizontal: 5 },
  removeButton: { position: 'absolute', left: -30, backgroundColor: "#FF4C4C", padding: 8, borderRadius: 50, width: 30, height: 30, justifyContent: "center", alignItems: "center" },
  removeButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  inputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  input: { height: 45, width: '85%', borderRadius: 30, backgroundColor: "#fff", paddingHorizontal: 15, borderColor: '#2E8B57', borderWidth: 1, fontSize: 16 },
  sendButton: { backgroundColor: "#2E8B57", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
  sendButtonText: { color: "#fff", fontSize: 16, fontWeight: 'bold' },
  addButton: { backgroundColor: "#2E8B57", padding: 12, borderRadius: 20, alignItems: 'center', marginTop: 10 },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: 'bold' },

  // Additional styles from the second code
  tip: { 
    position: 'absolute', 
    bottom: 30, // Keeping the last assigned value
    fontSize: 14, // Keeping the last assigned value
    color: '#fff', 
    fontWeight: 'bold' 
  },
  featureItem: { 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 15, 
    padding: 20, 
    marginBottom: 30 // Keeping the last assigned value
  },
  featureIcon: { fontSize: 32 },
  scrollContent: { paddingBottom: 350 }, // Keeping the last assigned value
  scrollIndicator: { 
    alignItems: 'center', 
    marginTop: 0, // Keeping the last assigned value
    marginBottom: 10, 
    paddingVertical: 8, 
    backgroundColor: 'rgba(255, 255, 255, 0.1)' 
  }
});


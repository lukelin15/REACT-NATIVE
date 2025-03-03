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


  const scrollViewRef = useRef<ScrollView | null>(null);

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
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const generateShoppingList = async () => {
    try {
      setLoadingList(true);
      setModalVisible(true);

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

  const addItemToShoppingList = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Authentication Error", "You must be logged in.");
        return;
      }
  
      const token = await user.getIdToken();
      const uid = user.uid;
      const newItem = { name: "Eggs", price: 4.99, location: "Costco" };
  
      const response = await fetch(`http://localhost:8002/shopping-list/${uid}/add-item`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
  
      if (!response.ok) throw new Error("Failed to add item.");
  
      // Append new item instead of replacing shopping list
      setShoppingList(prevList => ({
        ...prevList,
        items: [...(prevList?.items || []), newItem] // Preserve old items
      }));
  
      Alert.alert("Success", `Item '${newItem.name}' added successfully`);
    } catch (error) {
      console.error("Failed to add item", error);
      Alert.alert("Error", "Failed to add item.");
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
                <Text style={[styles.messageText, message.sender === "User" ? styles.userMessageText : styles.botMessageText]}>{message.text}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={generateShoppingList} style={styles.generateButton}>
              <Text style={styles.generateButtonText}>Generate Shopping List</Text>
            </TouchableOpacity>

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
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7f7"
  },
  keyboardAvoidingView: {
    flex: 1
  },
  container: { 
    flex: 1, 
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#f7f7f7",
  },
  chatContainer: { 
    flex: 1, 
    marginBottom: 8
  },
  messageBubble: { 
    padding: 12, 
    marginVertical: 4, 
    maxWidth: '80%', 
    borderRadius: 20, 
    marginHorizontal: 12 
  },
  userMessage: { 
    backgroundColor: "#2E8B57", 
    alignSelf: 'flex-end',
    marginLeft: 50
  },
  botMessage: { 
    backgroundColor: "#D1E7DD", 
    alignSelf: 'flex-start',
    marginRight: 50
  },
  messageText: { 
    fontSize: 16, 
    lineHeight: 22 
  },
  userMessageText: {
    color: '#ffffff'
  },
  botMessageText: {
    color: '#000000'
  },
  generateButton: { 
    backgroundColor: "#FFA500", 
    paddingVertical: 12,
    paddingHorizontal: 16, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12,
    marginHorizontal: 8
  },
  generateButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#f7f7f7',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8, // Add extra padding for iOS
  },
  input: { 
    flex: 1,
    minHeight: 45,
    maxHeight: 100,
    marginRight: 8,
    borderRadius: 24, 
    backgroundColor: "#fff", 
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: '#2E8B57', 
    borderWidth: 1, 
    fontSize: 16 
  },
  sendButton: { 
    backgroundColor: "#2E8B57", 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: { 
    backgroundColor: "#fff", 
    padding: 24,
    borderRadius: 16, 
    width: '80%' 
  },
  listTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 16 
  },
  listSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8
  },
  listItem: { 
    fontSize: 16, 
    marginBottom: 8,
    paddingVertical: 4
  },
  listItemContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  listItemText: {
    flex: 1,
    fontSize: 16
  },
  deleteButton: {
    padding: 8,
    marginLeft: 12,
    backgroundColor: '#ff4444',
    borderRadius: 8
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  closeButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 16,
    marginTop: 24,
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600'
  },
  addButton: { 
    backgroundColor: "#2E8B57", 
    padding: 12, 
    borderRadius: 20, 
    alignItems: 'center', 
    marginTop: 16 
  },
  addButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 16
  },
  bottomContainer: {
    width: '100%',
    backgroundColor: '#f7f7f7',
  },
  routeButton: {
    backgroundColor: "#1E90FF",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 16,
  },
  routeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
});


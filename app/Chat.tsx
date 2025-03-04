import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, SafeAreaView, Keyboard, Animated } from 'react-native';
import { auth } from '@/lib/firebase';
import { computeOptimizedRoute } from './Route';

interface Store {
  name: string;
  address: string;
  available_items: string[];
}

interface StoreRecommendations {
  stores: Store[];
}

interface ShoppingItem {
  name: string;
  price: number;
}

interface ShoppingListResponse {
  items: ShoppingItem[];
  store_recommendations: StoreRecommendations;
}

export default function Chat() {
  const [messages, setMessages] = useState([{ sender: "Bot", text: "Hi! How can I help you today?" }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dotAnimations] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]);
  const [shoppingList, setShoppingList] = useState<ShoppingListResponse | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [storeAddresses, setStoreAddresses] = useState<string[]>([]);
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    const setupUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        setUserToken(token);
        setUserId('Y84O1MLwhMRTUISOeKHHJucdCBq2');
      }
    };
    setupUser();
  }, []);

  useEffect(() => {
    if (isTyping) {
      const animations = dotAnimations.map((dot, index) => {
        return Animated.sequence([
          Animated.delay(index * 200),
          Animated.loop(
            Animated.sequence([
              Animated.timing(dot, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(dot, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
            ])
          ),
        ]);
      });
      Animated.parallel(animations).start();
    } else {
      dotAnimations.forEach(dot => dot.setValue(0));
    }
  }, [isTyping]);

  const stripMarkdown = (text: string) => {
    return text
      // Remove markdown headers
      .replace(/^###\s+/gm, '')
      // Remove bold and italic
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      // Remove code blocks
      .replace(/```(.*?)```/gs, '$1')
      .replace(/`(.*?)`/g, '$1')
      // Remove links
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      // Remove bullet points
      .replace(/^\s*-\s+/gm, '• ')
      // Remove extra newlines
      .replace(/\n{3,}/g, '\n\n')
      // Trim whitespace
      .trim();
  };

  const formatMessage = (text: string) => {
    // Split the text into sections based on double newlines
    const sections = text.split('\n\n');
    
    return sections.map((section, index) => {
      // If section starts with a bullet point, format it as a list
      if (section.startsWith('•')) {
        return section.split('\n').map(line => line.trim()).join('\n');
      }
      // Otherwise, return the section as is
      return section.trim();
    }).join('\n\n');
  };

  const sendMessageToBackend = async (userMessage: string) => {
    try {
      if (!userId || !userToken) {
        Alert.alert("Authentication Error", "You must be logged in to chat.");
        return "You need to sign in first.";
      }

      const response = await fetch("http://192.168.1.9:8002/chat", {
        method: "POST",
        headers: new Headers({
          "Authorization": `Bearer ${userToken}`, 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420"
        }),
        body: JSON.stringify({ uid: userId, message: userMessage }),
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
      setIsTyping(true);
      const botResponse = await sendMessageToBackend(input);
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: "Bot", text: formatMessage(stripMarkdown(botResponse)) }]);
      setShowGenerateButton(true);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const generateShoppingList = async () => {
    try {
      setLoadingList(true);
      setModalVisible(true);
      setShowGenerateButton(false);

      if (!userId || !userToken) {
        Alert.alert("Authentication Error", "You must be logged in.");
        setLoadingList(false);
        setModalVisible(false);
        return;
      }

      const response = await fetch(`http://192.168.1.9:8002/generate-shopping-list/${userId}`, {
        method: "GET",
        headers: new Headers({
          "Authorization": `Bearer ${userToken}`, 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "69420"
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`Failed to fetch shopping list: ${response.status}`);
      }

      // Try to parse the response as JSON
      const responseText = await response.text();
      console.log("Raw response:", responseText); // Debug log
      
      let data: ShoppingListResponse;
      try {
        data = JSON.parse(responseText) as ShoppingListResponse;
        console.log("Parsed data:", JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid JSON response from server");
      }
      
      // Validate the response data structure
      if (!data || !data.items || !data.store_recommendations) {
        console.error("Invalid data structure:", data);
        throw new Error("Invalid response format from server");
      }

      setShoppingList(data);

      if (data.store_recommendations.stores) {
        const extractedAddresses = data.store_recommendations.stores.map(store => store.address);
        console.log("Extracted addresses:", extractedAddresses);
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
      Alert.alert("Error", "Failed to generate shopping list. Please try again later.");
    } finally {
      setLoadingList(false);
    }
  };

  const deleteItemFromShoppingList = async (itemName: string) => {
    try {
      if (!userId || !userToken) {
        Alert.alert("Authentication Error", "You must be logged in.");
        return;
      }

      const response = await fetch(`http://192.168.1.9:8002/shopping-list/${userId}/delete-item/${encodeURIComponent(itemName)}`, {
        method: "DELETE",
        headers: new Headers({
          "Authorization": `Bearer ${userToken}`, 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420"
        }),
      });

      if (!response.ok) throw new Error("Failed to delete item.");

      // Remove only the selected item from the frontend state
      setShoppingList(prevList => {
        if (!prevList) return null;
        return {
          ...prevList,
          items: prevList.items.filter(item => item.name !== itemName)
        };
      });

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
            {isTyping && (
              <View style={[styles.messageBubble, styles.botMessage, styles.typingIndicator]}>
                <View style={styles.typingDots}>
                  {dotAnimations.map((dot, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.typingDot,
                        {
                          transform: [{
                            translateY: dot.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -5]
                            })
                          }],
                          opacity: dot
                        }
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

 
      {showGenerateButton && (
        <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={generateShoppingList} style={styles.generateButton}>
        <Text style={styles.generateButtonText}>Generate Shopping List</Text>
        </TouchableOpacity>
         </View> 
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

        {/* Keep Modal at the end */}
        <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.modalScrollContent}>
                <View style={styles.receiptHeader}>
                  <Text style={styles.receiptTitle}>Shopping Receipt</Text>
                  <Text style={styles.receiptDate}>{new Date().toLocaleDateString()}</Text>
                </View>
                
                <View style={styles.receiptDivider} />
                
                {loadingList ? (
                  <ActivityIndicator size="large" color="#2E8B57" />
                ) : (
                  <>
                    <View style={styles.receiptSection}>
                      <Text style={styles.receiptSectionTitle}>Items</Text>
                      {shoppingList?.items.map((item, index) => (
                        <View key={index} style={styles.receiptItem}>
                          <Text style={styles.receiptItemName}>{item.name}</Text>
                          <Text style={styles.receiptItemPrice}>${item.price.toFixed(2)}</Text>
                        </View>
                      ))}
                      <View style={styles.receiptDivider} />
                      <View style={styles.receiptTotal}>
                        <Text style={styles.receiptTotalText}>Total</Text>
                        <Text style={styles.receiptTotalAmount}>
                          ${shoppingList?.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.receiptSection}>
                      <Text style={styles.receiptSectionTitle}>Available At</Text>
                      {shoppingList?.store_recommendations.stores.map((store, index) => (
                        <View key={index} style={styles.storeItem}>
                          <Text style={styles.storeName}>{store.name}</Text>
                          <Text style={styles.storeAddress}>{store.address}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </ScrollView>
              
              <View style={styles.receiptFooter}>
                <View style={styles.buttonContainer}>
                  {loadingList ? (
                    <TouchableOpacity 
                      onPress={() => setModalVisible(false)} 
                      style={[styles.closeButton, styles.flexButton]}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      {storeAddresses.length > 0 && (
                        <TouchableOpacity 
                          onPress={() => setModalVisible(false)}
                          style={[styles.routeButton, styles.flexButton]}
                        >
                          <Text style={styles.routeButtonText}>Route</Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity 
                        onPress={() => {
                          Alert.alert("Success", "Your order has been placed!");
                          setModalVisible(false);
                        }} 
                        style={[styles.checkoutButton, styles.flexButton]}
                      >
                        <Text style={styles.checkoutButtonText}>Checkout</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        onPress={() => setModalVisible(false)} 
                        style={[styles.closeButton, styles.flexButton]}
                      >
                        <Text style={styles.closeButtonText}>Close</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {storeAddresses.length > 0 && (
          <TouchableOpacity 
            onPress={() => {
              if (storeAddresses.length > 1) {
                computeOptimizedRoute(
                  origin,  // First store as origin
                  destination,  // Last store as destination
                  waypoints  // Middle stores as waypoints
                );
              } else {
                Alert.alert("Error", "Not enough stores to generate a route.");
              }
            }} 
            style={styles.routeButton}
          >
            <Text style={styles.routeButtonText}>Show Route</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: { 
    flex: 1, 
    backgroundColor: "#f7f7f7" 
  },
  chatContainer: { 
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  messageBubble: { 
    padding: 12, 
    marginVertical: 8, 
    maxWidth: '75%', 
    borderRadius: 20, 
    marginHorizontal: 10 
  },
  userMessage: { 
    backgroundColor: "#2E8B57", 
    alignSelf: 'flex-end' 
  },
  botMessage: { 
    backgroundColor: "#D1E7DD", 
    alignSelf: 'flex-start' 
  },
  messageText: { 
    fontSize: 16, 
    lineHeight: 22,
    color: "#000"
  },
  userMessageText: {
    color: "#fff"
  },
  botMessageText: {
    color: "#000"
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  generateButton: { 
    backgroundColor: "#FFA500", 
    paddingVertical: 12, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  generateButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0"
  },
  input: { 
    height: 45, 
    width: '85%', 
    borderRadius: 30, 
    backgroundColor: "#fff", 
    paddingHorizontal: 15, 
    borderColor: '#2E8B57', 
    borderWidth: 1, 
    fontSize: 16 
  },
  sendButton: { 
    backgroundColor: "#2E8B57", 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 20 
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
    padding: 20, 
    borderRadius: 10, 
    width: '90%',
    maxHeight: '80%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  receiptTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E8B57",
    marginBottom: 5,
  },
  receiptDate: {
    fontSize: 14,
    color: "#666",
  },
  receiptDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  receiptSection: {
    marginBottom: 15,
  },
  receiptSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E8B57",
    marginBottom: 10,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  receiptItemName: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  receiptItemPrice: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2E8B57",
  },
  receiptTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#2E8B57",
  },
  receiptTotalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  receiptTotalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E8B57",
  },
  storeItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E8B57",
    marginBottom: 3,
  },
  storeAddress: {
    fontSize: 14,
    color: "#666",
  },
  receiptFooter: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  flexButton: {
    flex: 1,
  },
  routeButton: {
    backgroundColor: "#2E8B57",
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  routeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold'
  },
  checkoutButton: {
    backgroundColor: "#FFA500",
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold'
  },
  closeButton: {
    backgroundColor: "#FF4C4C",
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold'
  },
  typingIndicator: {
    padding: 8,
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E8B57',
    marginHorizontal: 2,
  },
});


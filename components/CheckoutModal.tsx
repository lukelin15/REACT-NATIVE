import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useCart } from '../lib/CartContext';

interface CheckoutModalProps {
  visible: boolean;
  onClose: () => void;
}

interface Store {
  id: string;
  name: string;
  address: string;
  distance?: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ visible, onClose }) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<string | null>(null);
  
  // Sample stores data
  const stores: Store[] = [
    { id: '1', name: 'Grocery Store A', address: '123 Main St, San Jose, CA', distance: '0.5 miles' },
    { id: '2', name: 'Supermarket B', address: '456 Oak Ave, San Jose, CA', distance: '1.2 miles' },
    { id: '3', name: 'Local Market C', address: '789 Pine Blvd, San Jose, CA', distance: '2.0 miles' },
  ];

  const deliveryOptions = [
    { id: 'standard', name: 'Standard Delivery', price: 3.99, time: '2-3 days' },
    { id: 'express', name: 'Express Delivery', price: 7.99, time: 'Next day' },
    { id: 'pickup', name: 'Store Pickup', price: 0, time: 'Same day' },
  ];

  const handleCheckout = () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (!selectedDeliveryOption) {
      Alert.alert('Error', 'Please select a delivery option');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Order Placed Successfully!',
        'Your order has been placed and will be processed shortly.',
        [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              onClose();
            },
          },
        ]
      );
    }, 2000);
  };

  const getDeliveryPrice = () => {
    if (!selectedDeliveryOption) return 0;
    const option = deliveryOptions.find(opt => opt.id === selectedDeliveryOption);
    return option ? option.price : 0;
  };

  const getTotalWithDelivery = () => {
    return getTotalPrice() + getDeliveryPrice();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Checkout</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollView}>
            {isProcessing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Processing your order...</Text>
              </View>
            ) : (
              <>
                {/* Order Summary Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Order Summary</Text>
                  <View style={styles.divider} />
                  
                  {items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                      </View>
                      <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                  ))}
                  
                  <View style={styles.divider} />
                  
                  <View style={styles.subtotalRow}>
                    <Text style={styles.subtotalLabel}>Subtotal</Text>
                    <Text style={styles.subtotalValue}>${getTotalPrice().toFixed(2)}</Text>
                  </View>
                </View>

                {/* Delivery Options Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Delivery Options</Text>
                  <View style={styles.divider} />
                  
                  {deliveryOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionItem,
                        selectedDeliveryOption === option.id && styles.selectedOption
                      ]}
                      onPress={() => setSelectedDeliveryOption(option.id)}
                    >
                      <View style={styles.optionInfo}>
                        <Text style={styles.optionName}>{option.name}</Text>
                        <Text style={styles.optionDetail}>{option.time}</Text>
                      </View>
                      <View style={styles.optionPriceContainer}>
                        <Text style={styles.optionPrice}>
                          {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
                        </Text>
                        {selectedDeliveryOption === option.id && (
                          <View style={styles.checkmark}>
                            <AntDesign name="check" size={16} color="white" />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Available Stores Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Available Stores</Text>
                  <View style={styles.divider} />
                  
                  {stores.map((store) => (
                    <View key={store.id} style={styles.storeItem}>
                      <View style={styles.storeInfo}>
                        <Text style={styles.storeName}>{store.name}</Text>
                        <Text style={styles.storeAddress}>{store.address}</Text>
                      </View>
                      {store.distance && (
                        <Text style={styles.storeDistance}>{store.distance}</Text>
                      )}
                    </View>
                  ))}
                </View>

                

                {/* Delivery Address Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Delivery Address</Text>
                  <View style={styles.divider} />
                  
                  <View style={styles.addressContainer}>
                    <Text style={styles.addressText}>123 Main St</Text>
                    <Text style={styles.addressText}>San Jose, CA 95123</Text>
                    <TouchableOpacity style={styles.changeAddressButton}>
                      <Text style={styles.changeAddressText}>Change Address</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Notes Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Order Notes</Text>
                  <View style={styles.divider} />
                  
                  <TextInput
                    style={styles.notesInput}
                    placeholder="Add any special instructions..."
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </>
            )}
          </ScrollView>

          {!isProcessing && (
            <View style={styles.footer}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${getTotalWithDelivery().toFixed(2)}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutButtonText}>Place Order</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '90%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalScrollView: {
    maxHeight: '80%',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  subtotalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtotalValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: '#f5f5f5',
  },
  selectedOption: {
    backgroundColor: '#e0f2e0',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  optionPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginRight: 8,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: '#f5f5f5',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  storeAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  storeDistance: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  addressContainer: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 4,
  },
  changeAddressButton: {
    marginTop: 8,
  },
  changeAddressText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckoutModal; 
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';


// Define the type of your stack navigator
type RootStackParamList = {
  Index: undefined;
  ItemsYouMightNeed: undefined;
  Onboarding: undefined;
  SignUp: undefined;
};

type IndexNavigationProp = StackNavigationProp<RootStackParamList, 'Index'>;

interface IndexProps {
  navigation: IndexNavigationProp;
}

const images: { [key: string]: any } = {
  Apple: require('../assets/images/Apple.jpg'),
  Milk: require('../assets/images/Milk.jpg'),
  Bread: require('../assets/images/Bread.jpg'),
  Eggs: require('../assets/images/Eggs.jpg'),
  Chicken: require('../assets/images/Chicken.jpg'),
  Candy: require('../assets/images/Candy.jpg'),
};

const categoryImages: { [key: string]: any } = {
  Vegetables: require('../assets/images/Vegetables.jpg'),
  Dairy: require('../assets/images/Dairy.jpg'),
  Fruits: require('../assets/images/Fruits.jpg'),
  Beverages: require('../assets/images/Beverages.jpg'),
  Bakery: require('../assets/images/Bakery.jpg'),
  Snacks: require('../assets/images/Snacks.jpg'),
  Frozen: require('../assets/images/Frozen.jpg'),
};

const recommendationImages: { [key: string]: any } = {
  Tomatoes: require('../assets/images/Tomatoes.jpg'),
  Cheese: require('../assets/images/Cheese.jpg'),
  Rice: require('../assets/images/Rice.jpg'),
  Orange: require('../assets/images/Orange.jpg'),
  Potato: require('../assets/images/Potato.jpg'),
};

const windowHeight = Dimensions.get('window').height;

export default function Index({ navigation }: IndexProps) {
  const [searchText, setSearchText] = useState('');
  const [address, setAddress] = useState({
    line1: '123 Main St',
    line2: '',
    city: 'San Jose',
    country: 'USA',
    zip: '95123',
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(address);
  
  const [countries] = useState(['USA', 'Canada', 'Mexico']); 

  const categories = ["Vegetables", "Dairy", "Fruits", "Beverages", "Bakery", "Snacks", "Frozen"];
  const lovedItems = ["Apple", "Milk", "Bread", "Eggs", "Chicken", "Candy"];
  const allItems = [
    { id: 1, name: "Tomatoes"},
    { id: 2, name: "Cheese"},
    { id: 3, name: "Rice" },
    { id: 4, name: "Orange"},
    { id: 5, name: "Potato"},
  ];

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const filteredCategories = categories.filter(category => 
    category.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredItems = allItems.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSaveAddress = () => {
    setAddress(newAddress);
    setIsEditingAddress(false); 
  };

  const handleCancelEdit = () => {
    setNewAddress(address); 
    setIsEditingAddress(false); 
  };

  return (
    <ScrollView 
      style={styles.mainContainer}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <TouchableOpacity onPress={() => setIsEditingAddress(true)}>
              <Text style={styles.locationText}>Delivery • {address.city}</Text>
              <Text style={styles.addressText} numberOfLines={1}>
                {address.line1}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="repeat" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>ORDER{'\n'}AGAIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="storefront" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>LOCAL{'\n'}SHOP</Text>
        </TouchableOpacity>
      </View>

      {/* Promo Banner */}
      <View style={styles.promoBanner}>
        <View style={styles.promoContent}>
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>Top deal!</Text>
            <Text style={styles.promoText}>FRESH APPLES{'\n'}UP TO 15% OFF</Text>
            <TouchableOpacity style={styles.shopNowButton}>
              <Text style={styles.shopNowText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.promoImageContainer}>
            <Image 
              source={images.Apple}
              style={styles.promoImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* Wrap the remaining content in a View */}
      <View style={styles.mainContent}>
        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Shop by category</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoryRow}
          >
            {filteredCategories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem}>
                <View style={styles.categoryIconContainer}>
                  <Image 
                    source={categoryImages[category]} 
                    style={styles.categoryIcon}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.categoryLabel}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Today's Special Section */}
        <View style={styles.specialSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Special</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.specialRow}
            contentContainerStyle={styles.specialRowContent}
          >
            {filteredItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.specialCard}>
                <Image 
                  source={recommendationImages[item.name]} 
                  style={styles.specialImage}
                  resizeMode="cover"
                />
                <View style={styles.specialInfo}>
                  <Text style={styles.specialName}>{item.name}</Text>
                  <Text style={styles.specialRating}>⭐ 4.5</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Address Edit Modal */}
      <Modal
        visible={isEditingAddress}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Address</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Address Line 1"
              value={newAddress.line1}
              onChangeText={(text) => setNewAddress({ ...newAddress, line1: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Address Line 2 (optional)"
              value={newAddress.line2}
              onChangeText={(text) => setNewAddress({ ...newAddress, line2: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="City"
              value={newAddress.city}
              onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
            />
            <Picker
              selectedValue={newAddress.country}
              style={styles.modalInput}
              onValueChange={(itemValue: string) => setNewAddress({ ...newAddress, country: itemValue })}
            >
              {countries.map((country, index) => (
                <Picker.Item key={index} label={country} value={country} />
              ))}
            </Picker>
            <TextInput
              style={styles.modalInput}
              placeholder="ZIP or Postal Code"
              value={newAddress.zip}
              onChangeText={(text) => setNewAddress({ ...newAddress, zip: text })}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleCancelEdit} style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveAddress} style={[styles.modalButton, styles.saveButton]}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: windowHeight,
  },
  mainContent: {
    flex: 1,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  promoBanner: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  promoContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  promoTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  promoText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1B5E20',
  },
  shopNowButton: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  shopNowText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  promoImageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  categoriesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  categoryRow: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  categoryIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: {
    width: '100%',
    height: '100%',
  },
  categoryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  specialSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  specialRow: {
  },
  specialRowContent: {
    paddingBottom: 16,
  },
  specialCard: {
    marginRight: 16,
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  specialImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 8,
  },
  specialInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specialName: {
    fontSize: 14,
    fontWeight: '600',
  },
  specialRating: {
    fontSize: 12,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    height: 50,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 15,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF4B4B',
  },
  saveButton: {
    backgroundColor: '#2E8B57',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

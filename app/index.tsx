import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import ProductModal from '../components/ProductModal';


// Define the type of your stack navigator
type RootStackParamList = {
  Index: undefined;
  ItemsYouMightNeed: undefined;
  Onboarding: undefined;
  SignUp: undefined;
  CategoryPage: { category: string };
  AllMenu: undefined;
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
  Tomatoes: require('../assets/images/Tomatoes.jpg'),
  Cheese: require('../assets/images/Cheese.jpg'),
  Rice: require('../assets/images/Rice.jpg'),
  Potato: require('../assets/images/Potato.jpg'),
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
  'Smash Burgers': require('../assets/images/Smash Burgers.jpeg'),
  'Gochujang Chicken': require('../assets/images/Gochujang Chicken.jpeg'),
  'Pasta alla Vodka': require('../assets/images/Pasta alla Vodka.jpeg'),
  'Homemade Ramen': require('../assets/images/Homemade Ramen.png'),
  'Birria Tacos': require('../assets/images/Birria Tacos.png'),
  'Mushroom Risotto': require('../assets/images/Mushroom Risotto.png'),
  'Shakshuka': require('../assets/images/Shakshuka.png'),
  'Creamy Tuscan Gnocchi': require('../assets/images/Creamy Tuscan Gnocchi.png'),
  'Spicy Tofu Stir-Fry': require('../assets/images/Spicy Tofu Stir-Fry.png'),
  'Crispy Tofu Buddha Bowl': require('../assets/images/Crispy Tofu Buddha Bowl.png'),
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
    { id: 1, name: "Smash Burgers", description: "Crispy, juicy beef patties with melted cheese." },
    { id: 2, name: "Gochujang Chicken", description: "Korean-style spicy and sweet grilled chicken." },
    { id: 3, name: "Pasta alla Vodka", description: "Creamy, slightly spicy tomato-based pasta." },
    { id: 4, name: "Homemade Ramen", description: "Rich broth with fresh noodles, eggs, and toppings." },
    { id: 5, name: "Birria Tacos", description: "Slow-cooked beef shredded into crispy, cheesy tacos." },
    { id: 6, name: "Mushroom Risotto", description: "Creamy, umami-rich Italian rice dish." },
    { id: 7, name: "Shakshuka", description: "Poached eggs in a spicy tomato and pepper sauce." },
    { id: 8, name: "Creamy Tuscan Gnocchi", description: "Soft gnocchi in a garlicky sun-dried tomato cream sauce." },
    { id: 9, name: "Spicy Tofu Stir-Fry", description: "Crispy tofu with a bold, spicy glaze." },
    { id: 10, name: "Crispy Tofu Buddha Bowl", description: "A colorful bowl with crispy tofu, quinoa, and fresh veggies." },
  ];

  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isFoodModalVisible, setIsFoodModalVisible] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState<any>(null);

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

  const handleOpenProductModal = () => {
    setIsProductModalVisible(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalVisible(false);
  };
  
  const handleOpenFoodModal = (item: any) => {
    setSelectedFoodItem(item);
    setIsFoodModalVisible(true);
  };

  const handleCloseFoodModal = () => {
    setIsFoodModalVisible(false);
  };
  
  // Sample ingredients for food items
  const getFoodIngredients = (foodName: string) => {
    const ingredientsMap: { [key: string]: any[] } = {
      "Smash Burgers": [
        { id: "1", name: "Ground Beef" },
        { id: "2", name: "Burger Buns" },
        { id: "3", name: "American Cheese" },
        { id: "4", name: "Lettuce" },
        { id: "5", name: "Tomato" },
        { id: "6", name: "Onion" },
        { id: "7", name: "Pickles" },
      ],
      "Gochujang Chicken": [
        { id: "1", name: "Chicken Thighs" },
        { id: "2", name: "Gochujang Paste" },
        { id: "3", name: "Soy Sauce" },
        { id: "4", name: "Honey" },
        { id: "5", name: "Garlic" },
        { id: "6", name: "Ginger" },
        { id: "7", name: "Rice" },
      ],
      "Pasta alla Vodka": [
        { id: "1", name: "Pasta" },
        { id: "2", name: "Tomato Paste" },
        { id: "3", name: "Heavy Cream" },
        { id: "4", name: "Vodka" },
        { id: "5", name: "Parmesan Cheese" },
        { id: "6", name: "Red Pepper Flakes" },
        { id: "7", name: "Garlic" },
      ],
      "Homemade Ramen": [
        { id: "1", name: "Ramen Noodles", quantity: "4 packs" },
        { id: "2", name: "Chicken Stock", quantity: "6 cups" },
        { id: "3", name: "Pork Belly", quantity: "1 lb" },
        { id: "4", name: "Eggs", quantity: "4 large" },
        { id: "5", name: "Green Onions", quantity: "4 stalks" },
        { id: "6", name: "Garlic", quantity: "4 cloves" },
        { id: "7", name: "Ginger", quantity: "2 tbsp" },
        { id: "8", name: "Soy Sauce", quantity: "3 tbsp" },
        { id: "9", name: "Mirin", quantity: "2 tbsp" },
      ],
      "Birria Tacos": [
        { id: "1", name: "Beef Chuck Roast", quantity: "3 lbs" },
        { id: "2", name: "Dried Guajillo Chilies", quantity: "4 pcs" },
        { id: "3", name: "Dried Ancho Chilies", quantity: "2 pcs" },
        { id: "4", name: "Corn Tortillas", quantity: "12 pcs" },
        { id: "5", name: "Onion", quantity: "1 large" },
        { id: "6", name: "Garlic", quantity: "6 cloves" },
        { id: "7", name: "Cumin", quantity: "1 tbsp" },
        { id: "8", name: "Bay Leaves", quantity: "2 pcs" },
        { id: "9", name: "Monterey Jack Cheese", quantity: "2 cups" },
        { id: "10", name: "Cilantro", quantity: "1 bunch" },
        { id: "11", name: "Lime", quantity: "2 pcs" },
      ],
      "Mushroom Risotto": [
        { id: "1", name: "Arborio Rice", quantity: "1.5 cups" },
        { id: "2", name: "Mixed Mushrooms", quantity: "1 lb" },
        { id: "3", name: "Vegetable Broth", quantity: "6 cups" },
        { id: "4", name: "White Wine", quantity: "1/2 cup" },
        { id: "5", name: "Shallots", quantity: "2 medium" },
        { id: "6", name: "Garlic", quantity: "3 cloves" },
        { id: "7", name: "Parmesan Cheese", quantity: "1/2 cup" },
        { id: "8", name: "Butter", quantity: "4 tbsp" },
        { id: "9", name: "Olive Oil", quantity: "2 tbsp" },
        { id: "10", name: "Fresh Thyme", quantity: "2 sprigs" },
      ],
      "Shakshuka": [
        { id: "1", name: "Eggs", quantity: "6 large" },
        { id: "2", name: "Canned Tomatoes", quantity: "28 oz" },
        { id: "3", name: "Bell Peppers", quantity: "2 medium" },
        { id: "4", name: "Onion", quantity: "1 large" },
        { id: "5", name: "Garlic", quantity: "3 cloves" },
        { id: "6", name: "Cumin", quantity: "1 tsp" },
        { id: "7", name: "Paprika", quantity: "1 tsp" },
        { id: "8", name: "Cayenne Pepper", quantity: "1/2 tsp" },
        { id: "9", name: "Feta Cheese", quantity: "1/2 cup" },
        { id: "10", name: "Fresh Parsley", quantity: "1/4 cup" },
      ],
      "Creamy Tuscan Gnocchi": [
        { id: "1", name: "Potato Gnocchi", quantity: "1 lb" },
        { id: "2", name: "Heavy Cream", quantity: "1 cup" },
        { id: "3", name: "Sun-dried Tomatoes", quantity: "1/2 cup" },
        { id: "4", name: "Spinach", quantity: "2 cups" },
        { id: "5", name: "Garlic", quantity: "4 cloves" },
        { id: "6", name: "Parmesan Cheese", quantity: "1/2 cup" },
        { id: "7", name: "Italian Seasoning", quantity: "1 tbsp" },
        { id: "8", name: "Chicken Broth", quantity: "1/2 cup" },
        { id: "9", name: "Olive Oil", quantity: "2 tbsp" },
      ],
      "Spicy Tofu Stir-Fry": [
        { id: "1", name: "Extra Firm Tofu", quantity: "14 oz" },
        { id: "2", name: "Bell Peppers", quantity: "2 medium" },
        { id: "3", name: "Broccoli", quantity: "2 cups" },
        { id: "4", name: "Carrots", quantity: "2 medium" },
        { id: "5", name: "Soy Sauce", quantity: "3 tbsp" },
        { id: "6", name: "Sriracha", quantity: "2 tbsp" },
        { id: "7", name: "Garlic", quantity: "3 cloves" },
        { id: "8", name: "Ginger", quantity: "1 tbsp" },
        { id: "9", name: "Sesame Oil", quantity: "1 tbsp" },
        { id: "10", name: "Cornstarch", quantity: "1 tbsp" },
        { id: "11", name: "Rice", quantity: "2 cups" },
      ],
      "Crispy Tofu Buddha Bowl": [
        { id: "1", name: "Extra Firm Tofu", quantity: "14 oz" },
        { id: "2", name: "Quinoa", quantity: "1 cup" },
        { id: "3", name: "Avocado", quantity: "1 large" },
        { id: "4", name: "Sweet Potato", quantity: "1 large" },
        { id: "5", name: "Kale", quantity: "2 cups" },
        { id: "6", name: "Chickpeas", quantity: "1 can" },
        { id: "7", name: "Tahini", quantity: "3 tbsp" },
        { id: "8", name: "Lemon", quantity: "1 medium" },
        { id: "9", name: "Olive Oil", quantity: "3 tbsp" },
        { id: "10", name: "Garlic Powder", quantity: "1 tsp" },
        { id: "11", name: "Cumin", quantity: "1 tsp" },
        { id: "12", name: "Maple Syrup", quantity: "1 tbsp" },
      ],
    };
    
    return ingredientsMap[foodName] || [];
  };
  
  // Sample locations
  const sampleLocations = [
    { id: "1", name: "Grocery Store A", distance: "0.5 miles" },
    { id: "2", name: "Supermarket B", distance: "1.2 miles" },
    { id: "3", name: "Local Market C", distance: "2.0 miles" },
  ];

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
            <TouchableOpacity style={styles.shopNowButton} onPress={handleOpenProductModal}>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by category</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CategoryPage', { category: 'All Categories' })}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoryRow}
          >
            {filteredCategories.map((category, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.categoryItem}
                onPress={() => navigation.navigate('CategoryPage', { category })}
              >
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
            <TouchableOpacity onPress={() => navigation.navigate('AllMenu')}>
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
              <TouchableOpacity 
                key={index} 
                style={styles.specialCard}
                onPress={() => handleOpenFoodModal(item)}
              >
                <Image 
                  source={recommendationImages[item.name]} 
                  style={styles.specialImage}
                  resizeMode="cover"
                />
                <View style={styles.specialInfo}>
                  <Text style={styles.specialName}>{item.name}</Text>
                  <Text style={styles.specialDescription} numberOfLines={2}>{item.description}</Text>
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

      {/* Product Modal for regular products */}
      <ProductModal
        visible={isProductModalVisible}
        onClose={handleCloseProductModal}
        productImage={images.Apple}
        productName="Fresh Apple"
        productDescription="Delicious and juicy Apples, perfect for a healthy snack."
        productPrice={14.75}
        availableLocations={sampleLocations}
      />
      
      {/* Food Modal for recipes/dishes */}
      {selectedFoodItem && (
        <ProductModal
          visible={isFoodModalVisible}
          onClose={handleCloseFoodModal}
          productImage={recommendationImages[selectedFoodItem.name]}
          productName={selectedFoodItem.name}
          productDescription={selectedFoodItem.description}
          productPrice={0} // Price not relevant for recipes
          isFood={true}
          ingredients={getFoodIngredients(selectedFoodItem.name)}
          availableLocations={sampleLocations}
        />
      )}
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
    width: 200,
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
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  specialName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  specialDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  specialRating: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
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
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
});

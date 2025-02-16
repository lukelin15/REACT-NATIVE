import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Modal } from 'react-native';
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
    <ScrollView contentContainerStyle={styles.container}>

      {/* Address Section */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>Your Address</Text>
        <View style={styles.addressTextContainer}>
          {!isEditingAddress ? (
            <>
              <Text style={styles.addressText}>
                {newAddress.line1}, {newAddress.line2 ? `${newAddress.line2}, ` : ''}{newAddress.city}, {newAddress.country} - {newAddress.zip}
              </Text>
              <TouchableOpacity onPress={() => setIsEditingAddress(true)} style={styles.editButton}>
                <Text style={styles.editButtonText}><Ionicons name="create-outline" size={24} color="blue" /></Text>
              </TouchableOpacity>
            </>
          ) : (
            <Modal
              visible={isEditingAddress}
              animationType="slide"
              transparent={true}
              onRequestClose={handleCancelEdit}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Edit Address</Text>

                  {/* Address Line 1 */}
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Address Line 1"
                    value={newAddress.line1}
                    onChangeText={(text) => setNewAddress({ ...newAddress, line1: text })}
                  />

                  {/* Address Line 2 (Optional) */}
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Address Line 2 (optional)"
                    value={newAddress.line2}
                    onChangeText={(text) => setNewAddress({ ...newAddress, line2: text })}
                  />

                  {/* City */}
                  <TextInput
                    style={styles.modalInput}
                    placeholder="City"
                    value={newAddress.city}
                    onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
                  />

                  {/* Country Dropdown */}
                  <Picker
                    selectedValue={newAddress.country}
                    style={styles.modalInput}
                    onValueChange={(itemValue: string) => setNewAddress({ ...newAddress, country: itemValue })}
                  >
                    {countries.map((country, index) => (
                      <Picker.Item key={index} label={country} value={country} />
                    ))}
                  </Picker>

                  {/* ZIP/Postal Code */}
                  <TextInput
                    style={styles.modalInput}
                    placeholder="ZIP or Postal Code"
                    value={newAddress.zip}
                    onChangeText={(text) => setNewAddress({ ...newAddress, zip: text })}
                    keyboardType="numeric"
                  />

                  {/* Save and Cancel buttons */}
                  <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={handleCancelEdit} style={styles.modalButton}>
                      <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSaveAddress} style={styles.modalButton}>
                      <Text style={styles.modalButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search for items or categories"
        value={searchText}
        onChangeText={handleSearch}
      />

      
      {/* Filtered Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.buttonRow}>
        {filteredCategories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.button}>
            {/* Use the categoryImages object to get the image for each category */}
            <Image source={categoryImages[category]} style={styles.buttonImage} />
            <Text style={styles.buttonText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>


      {/* Filtered Loved Items */}
      <Text style={styles.sectionTitle}>Loved Items</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.buttonRow}>
        {lovedItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.button}>
            <Image source={images[item]} style={styles.buttonImage} />
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recommendations Section */}
      <View style={styles.recommendationContainer}>
        <View style={styles.recommendationHeader}>
          <Text style={styles.recommendationTitle}>You might need</Text>
          <TouchableOpacity style={styles.seeMore} onPress={() => navigation.navigate('ItemsYouMightNeed')}>
            <Text style={styles.seeMoreText}>See More</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendationRow}>
        {filteredItems.map((item, index) => (
          <View key={index} style={styles.card}>
            {/* Use recommendationImages to get the image for each recommended item */}
            <Image source={recommendationImages[item.name]} style={styles.cardImage} />
            <Text style={styles.cardText}>{item.name}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#C8E6C9",
  },
  searchInput: {
    height: 45,
    borderRadius: 30,
    backgroundColor: "#fff",
    paddingLeft: 15,
    borderColor: '#2E8B57',
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 20,
  },
  addressContainer: {
    marginBottom: 20,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center', 
  },
  addressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  addressText: {
    fontSize: 16,
    color: "#333",
    textAlign: 'center',
  },
  
  editButton: {
    marginLeft: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#000', 
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2E8B57',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
  },
  buttonRow: {
    marginBottom: 20,
  },
  button: {
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendationContainer: {
    marginVertical: 10,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeMore: {
    marginTop: 5,
  },
  seeMoreText: {
    fontSize: 14,
    color: '#2E8B57',
  },
  recommendationRow: {
    marginTop: 0,
  },
  card: {
    width: 100,
    height: 140,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

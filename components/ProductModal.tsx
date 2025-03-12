import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  FlatList,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useCart } from '../lib/CartContext';

interface Location {
  id: string;
  name: string;
  distance?: string;
}

interface Ingredient {
  id: string;
  name: string;
  quantity?: string;
}

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  productImage: any;
  productName: string;
  productDescription: string;
  productPrice: number;
  productSize?: string;
  productUnit?: string;
  availableLocations?: Location[];
  isFood?: boolean;
  ingredients?: Ingredient[];
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  visible, 
  onClose, 
  productImage, 
  productName, 
  productDescription, 
  productPrice,
  productSize = "500-700",
  productUnit = "g",
  availableLocations = [],
  isFood = false,
  ingredients = []
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const { addItem } = useCart();

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const selectLocation = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const selectIngredient = (ingredientId: string) => {
    setSelectedIngredient(ingredientId);
    // In a real app, you might want to open a new modal for the selected ingredient
  };

  const handleAddToCart = () => {
    if (!selectedLocation) {
      Alert.alert('Please select a location', 'You need to select a location before adding to cart.');
      return;
    }

    // Add the product to the cart
    addItem({
      id: `${productName}-${Date.now()}`, // Generate a unique ID
      name: productName,
      price: productPrice,
      image: productImage,
    });

    // Show success message
    Alert.alert('Added to Cart', `${quantity} ${productName} added to your cart.`);
    
    // Close the modal
    onClose();
  };

  const handleAddAllIngredientsToCart = () => {
    if (!selectedLocation) {
      Alert.alert('Please select a location', 'You need to select a location before adding ingredients to cart.');
      return;
    }

    // Add all ingredients to the cart
    ingredients.forEach(ingredient => {
      addItem({
        id: `${ingredient.name}-${Date.now()}-${Math.random()}`, // Generate a unique ID
        name: ingredient.name,
        price: 0, // We don't have prices for ingredients
        image: null, // We don't have images for ingredients
      });
    });

    // Show success message
    Alert.alert('Added to Cart', `All ingredients for ${productName} added to your cart.`);
    
    // Close the modal
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Top Section with Image */}
        <View style={styles.topSection}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          
          
          <View style={styles.imageContainer}>
            <Image source={productImage} style={styles.productImage} />
          </View>
        </View>
        
        {/* Bottom Section with Details */}
        <View style={styles.bottomSection}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.productName}>{productName}</Text>
            
            {!isFood && (
              <Text style={styles.productSize}>Each ({productSize}{productUnit})</Text>
            )}
            
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.productDescription}>{productDescription}</Text>
            
            {isFood && ingredients.length > 0 && (
              <>
                <Text style={styles.ingredientsTitle}>Ingredients</Text>
                <View style={styles.ingredientsContainer}>
                  {ingredients.map((ingredient) => (
                    <TouchableOpacity 
                      key={ingredient.id}
                      style={styles.ingredientChip}
                      onPress={() => selectIngredient(ingredient.id)}
                    >
                      <Text style={styles.ingredientText}>{ingredient.name}</Text>
                      {ingredient.quantity && (
                        <Text style={styles.ingredientQuantity}>{ingredient.quantity}</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
            
            {!isFood && (
              <>
                <Text style={styles.availableTitle}>Available at</Text>
                <FlatList
                  data={availableLocations}
                  keyExtractor={(item) => item.id}
                  horizontal={false}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.locationItem, 
                        selectedLocation === item.id && styles.selectedLocation
                      ]}
                      onPress={() => selectLocation(item.id)}
                    >
                      <Text style={styles.locationName}>{item.name}</Text>
                      {item.distance && (
                        <Text style={styles.locationDistance}>{item.distance}</Text>
                      )}
                      {selectedLocation === item.id && (
                        <View style={styles.checkmark}>
                          <AntDesign name="check" size={16} color="white" />
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                />
              </>
            )}
            
            {isFood && (
              <>
                <Text style={styles.availableTitle}>Available at</Text>
                <FlatList
                  data={availableLocations}
                  keyExtractor={(item) => item.id}
                  horizontal={false}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.locationItem, 
                        selectedLocation === item.id && styles.selectedLocation
                      ]}
                      onPress={() => selectLocation(item.id)}
                    >
                      <Text style={styles.locationName}>{item.name}</Text>
                      {item.distance && (
                        <Text style={styles.locationDistance}>{item.distance}</Text>
                      )}
                      {selectedLocation === item.id && (
                        <View style={styles.checkmark}>
                          <AntDesign name="check" size={16} color="white" />
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                />
              </>
            )}
            
            <View style={styles.bottomActions}>
              {!isFood ? (
                <>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>${productPrice.toFixed(2)}</Text>
                  </View>
                  
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                      style={styles.quantityButton} 
                      onPress={decrementQuantity}
                    >
                      <AntDesign name="minus" size={16} color="black" />
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>{quantity.toString().padStart(2, '0')}</Text>
                    
                    <TouchableOpacity 
                      style={styles.quantityButton} 
                      onPress={incrementQuantity}
                    >
                      <AntDesign name="plus" size={16} color="black" />
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity 
                    style={[
                      styles.addToCartButton,
                      selectedLocation ? styles.addToCartButtonActive : {}
                    ]}
                    disabled={!selectedLocation}
                    onPress={handleAddToCart}
                  >
                    <Text style={styles.addToCartText}>Add to cart</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity 
                  style={[
                    styles.addAllIngredientsButton,
                    selectedLocation ? styles.addToCartButtonActive : {}
                  ]}
                  disabled={!selectedLocation}
                  onPress={handleAddAllIngredientsToCart}
                >
                  <Text style={styles.addToCartText}>Add all ingredients to cart</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9', // Pastel green background
  },
  topSection: {
    height: '40%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: width * 0.62,
    height: width * 0.62,
    borderRadius: width * 0.3,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  productImage: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    resizeMode: 'cover',
  },
  bottomSection: {
    height: '60%',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productSize: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 24,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  ingredientChip: {
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ingredientText: {
    fontSize: 14,
    color: '#333',
  },
  ingredientQuantity: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  availableTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 10,
  },
  selectedLocation: {
    backgroundColor: '#e0f2e0',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
  },
  locationDistance: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  addToCartButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
  },
  addAllIngredientsButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartButtonActive: {
    backgroundColor: '#4CAF50',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default ProductModal; 
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, ParamListBase, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ProductModal from '../components/ProductModal';

// Define the type of your stack navigator
type RootStackParamList = {
  Index: undefined;
  CategoryPage: { category?: string };
  ItemsYouMightNeed: undefined;
};

type CategoryPageRouteProp = RouteProp<RootStackParamList, 'CategoryPage'>;
type CategoryPageNavigationProp = StackNavigationProp<RootStackParamList>;

// Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  image: any;
  description: string;
  category: string;
  subcategory: string;
}

// Category interface
interface Category {
  id: string;
  name: string;
  image: any;
  subcategories: string[];
}

const { width } = Dimensions.get('window');

const CategoryPage = () => {
  const navigation = useNavigation<CategoryPageNavigationProp>();
  const route = useRoute<CategoryPageRouteProp>();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    route.params?.category || 'All Categories'
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [columnCount, setColumnCount] = useState<number>(2);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isSubcategoryModalVisible, setIsSubcategoryModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sample categories data
  const categories: Category[] = [
    {
      id: '1',
      name: 'Vegetables',
      image: require('../assets/images/Vegetables.jpg'),
      subcategories: ['Leafy Greens', 'Root Vegetables', 'Peppers', 'Tomatoes', 'Onions & Garlic'],
    },
    {
      id: '2',
      name: 'Fruits',
      image: require('../assets/images/Fruits.jpg'),
      subcategories: ['Berries', 'Citrus', 'Tropical', 'Apples & Pears', 'Stone Fruits'],
    },
    {
      id: '3',
      name: 'Dairy',
      image: require('../assets/images/Dairy.jpg'),
      subcategories: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream'],
    },
    {
      id: '4',
      name: 'Beverages',
      image: require('../assets/images/Beverages.jpg'),
      subcategories: ['Water', 'Soda', 'Juice', 'Tea', 'Coffee'],
    },
    {
      id: '5',
      name: 'Bakery',
      image: require('../assets/images/Bakery.jpg'),
      subcategories: ['Bread', 'Pastries', 'Cakes', 'Cookies', 'Muffins'],
    },
    {
      id: '6',
      name: 'Snacks',
      image: require('../assets/images/Snacks.jpg'),
      subcategories: ['Chips', 'Nuts', 'Crackers', 'Popcorn', 'Chocolate'],
    },
    {
      id: '7',
      name: 'Frozen',
      image: require('../assets/images/Frozen.jpg'),
      subcategories: ['Ice Cream', 'Frozen Meals', 'Frozen Vegetables', 'Frozen Fruits', 'Pizza'],
    },
  ];

  // Sample products data
  const products: Product[] = [
    {
      id: '1',
      name: 'Fresh Apples',
      price: 2.99,
      image: require('../assets/images/Apple.jpg'),
      description: 'Delicious and juicy apples, perfect for a healthy snack.',
      category: 'Fruits',
      subcategory: 'Apples & Pears',
    },
    {
      id: '2',
      name: 'Organic Milk',
      price: 3.49,
      image: require('../assets/images/Milk.jpg'),
      description: 'Fresh organic milk from grass-fed cows.',
      category: 'Dairy',
      subcategory: 'Milk',
    },
    {
      id: '3',
      name: 'Whole Wheat Bread',
      price: 2.79,
      image: require('../assets/images/Bread.jpg'),
      description: 'Freshly baked whole wheat bread, perfect for sandwiches.',
      category: 'Bakery',
      subcategory: 'Bread',
    },
    {
      id: '4',
      name: 'Farm Fresh Eggs',
      price: 3.99,
      image: require('../assets/images/Eggs.jpg'),
      description: 'Farm fresh eggs from free-range chickens.',
      category: 'Dairy',
      subcategory: 'Eggs',
    },
    {
      id: '5',
      name: 'Chicken Breast',
      price: 5.99,
      image: require('../assets/images/Chicken.jpg'),
      description: 'Boneless, skinless chicken breast, perfect for grilling.',
      category: 'Meat',
      subcategory: 'Poultry',
    },
    {
      id: '6',
      name: 'Assorted Candy',
      price: 3.29,
      image: require('../assets/images/Candy.jpg'),
      description: 'Assorted candy for a sweet treat.',
      category: 'Snacks',
      subcategory: 'Chocolate',
    },
    {
      id: '7',
      name: 'Fresh Tomatoes',
      price: 1.99,
      image: require('../assets/images/Tomatoes.jpg'),
      description: 'Ripe and juicy tomatoes, perfect for salads and cooking.',
      category: 'Vegetables',
      subcategory: 'Tomatoes',
    },
    {
      id: '8',
      name: 'Cheddar Cheese',
      price: 4.49,
      image: require('../assets/images/Cheese.jpg'),
      description: 'Sharp cheddar cheese, perfect for sandwiches and snacking.',
      category: 'Dairy',
      subcategory: 'Cheese',
    },
    {
      id: '9',
      name: 'White Rice',
      price: 2.49,
      image: require('../assets/images/Rice.jpg'),
      description: 'Premium quality white rice, perfect for any meal.',
      category: 'Grains',
      subcategory: 'Rice',
    },
    {
      id: '10',
      name: 'Russet Potatoes',
      price: 3.99,
      image: require('../assets/images/Potato.jpg'),
      description: 'Fresh russet potatoes, perfect for baking, mashing, or frying.',
      category: 'Vegetables',
      subcategory: 'Root Vegetables',
    },
    {
      id: '11',
      name: 'Sparkling Water',
      price: 1.49,
      image: require('../assets/images/Beverages.jpg'),
      description: 'Refreshing sparkling water with natural flavors.',
      category: 'Beverages',
      subcategory: 'Water',
    },
    {
      id: '12',
      name: 'Green Tea',
      price: 3.99,
      image: require('../assets/images/Beverages.jpg'),
      description: 'Organic green tea bags, rich in antioxidants.',
      category: 'Beverages',
      subcategory: 'Tea',
    },
  ];

  // Get subcategories for the selected category
  const getSubcategories = () => {
    if (selectedCategory === 'All Categories') {
      return ['All Subcategories'];
    }
    
    const category = categories.find(cat => cat.name === selectedCategory);
    return category ? ['All Subcategories', ...category.subcategories] : ['All Subcategories'];
  };

  // Filter products based on selected category and subcategory
  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'All Categories') {
      return true;
    }
    
    if (selectedSubcategory === 'All Subcategories' || selectedSubcategory === null) {
      return product.category === selectedCategory;
    }
    
    return product.category === selectedCategory && product.subcategory === selectedSubcategory;
  });

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setIsCategoryModalVisible(false);
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory === 'All Subcategories' ? null : subcategory);
    setIsSubcategoryModalVisible(false);
  };

  // Handle column count change
  const handleColumnCountChange = (count: number) => {
    setColumnCount(count);
  };

  // Handle product press
  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalVisible(true);
  };

  // Sample locations for ProductModal
  const sampleLocations = [
    { id: "1", name: "Grocery Store A", distance: "0.5 miles" },
    { id: "2", name: "Supermarket B", distance: "1.2 miles" },
    { id: "3", name: "Local Market C", distance: "2.0 miles" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Category and Layout Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.categoryControls}>
          <TouchableOpacity 
            style={styles.categoryButton}
            onPress={() => setIsCategoryModalVisible(true)}
          >
            <Text style={styles.categoryButtonText}>{selectedCategory}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#333" />
          </TouchableOpacity>
          
          {selectedCategory !== 'All Categories' && (
            <TouchableOpacity 
              style={styles.subcategoryButton}
              onPress={() => setIsSubcategoryModalVisible(true)}
            >
              <Text style={styles.subcategoryButtonText}>
                {selectedSubcategory || 'All Subcategories'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#333" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.layoutControls}>
          <TouchableOpacity 
            style={[styles.columnButton, columnCount === 2 && styles.activeColumnButton]}
            onPress={() => handleColumnCountChange(2)}
          >
            <Ionicons name="grid-outline" size={20} color={columnCount === 2 ? "#4CAF50" : "#777"} />
            <Text style={[styles.columnButtonText, columnCount === 2 && styles.activeColumnButtonText]}>2</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.columnButton, columnCount === 3 && styles.activeColumnButton]}
            onPress={() => handleColumnCountChange(3)}
          >
            <Ionicons name="grid-outline" size={20} color={columnCount === 3 ? "#4CAF50" : "#777"} />
            <Text style={[styles.columnButtonText, columnCount === 3 && styles.activeColumnButtonText]}>3</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.columnButton, columnCount === 4 && styles.activeColumnButton]}
            onPress={() => handleColumnCountChange(4)}
          >
            <Ionicons name="grid-outline" size={20} color={columnCount === 4 ? "#4CAF50" : "#777"} />
            <Text style={[styles.columnButtonText, columnCount === 4 && styles.activeColumnButtonText]}>4</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={columnCount}
        key={columnCount.toString()} // Force re-render when column count changes
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.productCard, 
              { width: (width - 32) / columnCount - (columnCount > 1 ? 8 : 0) }
            ]}
            onPress={() => handleProductPress(item)}
          >
            <Image 
              source={item.image} 
              style={[styles.productImage, { height: width / columnCount }]} 
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              <TouchableOpacity style={styles.addButton}>
                <AntDesign name="plus" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.productsGrid}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Category Selection Modal */}
      <Modal
        visible={isCategoryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsCategoryModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <ScrollView>
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  selectedCategory === 'All Categories' && styles.selectedModalItem
                ]}
                onPress={() => handleCategorySelect('All Categories')}
              >
                <Text style={styles.modalItemText}>All Categories</Text>
                {selectedCategory === 'All Categories' && (
                  <AntDesign name="check" size={18} color="#4CAF50" />
                )}
              </TouchableOpacity>
              
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.modalItem,
                    selectedCategory === category.name && styles.selectedModalItem
                  ]}
                  onPress={() => handleCategorySelect(category.name)}
                >
                  <Text style={styles.modalItemText}>{category.name}</Text>
                  {selectedCategory === category.name && (
                    <AntDesign name="check" size={18} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Subcategory Selection Modal */}
      <Modal
        visible={isSubcategoryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSubcategoryModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsSubcategoryModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Subcategory</Text>
            <ScrollView>
              {getSubcategories().map((subcategory, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalItem,
                    (selectedSubcategory === subcategory || 
                     (subcategory === 'All Subcategories' && selectedSubcategory === null)) && 
                    styles.selectedModalItem
                  ]}
                  onPress={() => handleSubcategorySelect(subcategory)}
                >
                  <Text style={styles.modalItemText}>{subcategory}</Text>
                  {(selectedSubcategory === subcategory || 
                    (subcategory === 'All Subcategories' && selectedSubcategory === null)) && (
                    <AntDesign name="check" size={18} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          visible={isProductModalVisible}
          onClose={() => setIsProductModalVisible(false)}
          productImage={selectedProduct.image}
          productName={selectedProduct.name}
          productDescription={selectedProduct.description}
          productPrice={selectedProduct.price}
          availableLocations={sampleLocations}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  subcategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  subcategoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  layoutControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  columnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    marginLeft: 8,
  },
  activeColumnButton: {
    backgroundColor: '#e8f5e9',
  },
  columnButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#777',
    marginLeft: 2,
  },
  activeColumnButtonText: {
    color: '#4CAF50',
  },
  productsGrid: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 4,
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
  productImage: {
    width: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedModalItem: {
    backgroundColor: '#f5f5f5',
  },
  modalItemText: {
    fontSize: 16,
  },
});

export default CategoryPage; 
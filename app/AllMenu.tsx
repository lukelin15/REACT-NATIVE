import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
  Image,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ProductModal from '../components/ProductModal';

// Define the type of your stack navigator
type RootStackParamList = {
  Index: undefined;
  AllMenu: undefined;
  CategoryPage: { category: string };
};

type AllMenuNavigationProp = StackNavigationProp<RootStackParamList>;

interface MenuItem {
  id: string;
  name: string;
  description: string;
  image: any;
  ingredients: Array<{ id: string; name: string; quantity?: string }>;
  dietaryInfo: {
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
  };
  rating: number;
}

const { width } = Dimensions.get('window');

const AllMenu = () => {
  const navigation = useNavigation<AllMenuNavigationProp>();
  const [searchText, setSearchText] = useState('');
  const [columnCount, setColumnCount] = useState<number>(2);
  const [selectedFilters, setSelectedFilters] = useState<{
    dietary: string[];
    includedIngredients: string[];
    excludedIngredients: string[];
  }>({
    dietary: [],
    includedIngredients: [],
    excludedIngredients: [],
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const includeIngredientInputRef = useRef<TextInput>(null);
  const excludeIngredientInputRef = useRef<TextInput>(null);
  const [includeInputText, setIncludeInputText] = useState('');
  const [excludeInputText, setExcludeInputText] = useState('');
  const [activeSuggestionField, setActiveSuggestionField] = useState<'include' | 'exclude' | null>(null);

  // Sample menu items data with dietary information and ingredients
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Smash Burgers',
      description: 'Crispy, juicy beef patties with melted cheese.',
      image: require('../assets/images/Smash Burgers.jpeg'),
      ingredients: [
        { id: '1', name: 'Ground Beef' },
        { id: '2', name: 'Burger Buns' },
        { id: '3', name: 'American Cheese' },
        { id: '4', name: 'Lettuce' },
        { id: '5', name: 'Tomato' },
      ],
      dietaryInfo: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isDairyFree: false,
      },
      rating: 4.5,
    },
    {
      id: '2',
      name: 'Gochujang Chicken',
      description: 'Korean-style spicy and sweet grilled chicken.',
      image: require('../assets/images/Gochujang Chicken.jpeg'),
      ingredients: [
        { id: '1', name: 'Chicken Thighs' },
        { id: '2', name: 'Gochujang Paste' },
        { id: '3', name: 'Soy Sauce' },
        { id: '4', name: 'Honey' },
        { id: '5', name: 'Rice' },
      ],
      dietaryInfo: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isDairyFree: true,
      },
      rating: 4.7,
    },
    {
      id: '3',
      name: 'Pasta alla Vodka',
      description: 'Creamy, slightly spicy tomato-based pasta.',
      image: require('../assets/images/Pasta alla Vodka.jpeg'),
      ingredients: [
        { id: '1', name: 'Pasta' },
        { id: '2', name: 'Heavy Cream' },
        { id: '3', name: 'Tomato Paste' },
        { id: '4', name: 'Vodka' },
        { id: '5', name: 'Parmesan' },
      ],
      dietaryInfo: {
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        isDairyFree: false,
      },
      rating: 4.6,
    },
    {
      id: '4',
      name: 'Spicy Tofu Stir-Fry',
      description: 'Crispy tofu with a bold, spicy glaze.',
      image: require('../assets/images/Spicy Tofu Stir-Fry.png'),
      ingredients: [
        { id: '1', name: 'Tofu' },
        { id: '2', name: 'Bell Peppers' },
        { id: '3', name: 'Broccoli' },
        { id: '4', name: 'Soy Sauce' },
        { id: '5', name: 'Rice' },
      ],
      dietaryInfo: {
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isDairyFree: true,
      },
      rating: 4.4,
    },
    {
      id: '5',
      name: 'Mushroom Risotto',
      description: 'Creamy, umami-rich Italian rice dish.',
      image: require('../assets/images/Mushroom Risotto.png'),
      ingredients: [
        { id: '1', name: 'Arborio Rice' },
        { id: '2', name: 'Mushrooms' },
        { id: '3', name: 'White Wine' },
        { id: '4', name: 'Parmesan' },
        { id: '5', name: 'Butter' },
      ],
      dietaryInfo: {
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        isDairyFree: false,
      },
      rating: 4.8,
    },
    {
      id: '6',
      name: 'Crispy Tofu Buddha Bowl',
      description: 'A colorful bowl with crispy tofu, quinoa, and fresh veggies.',
      image: require('../assets/images/Crispy Tofu Buddha Bowl.png'),
      ingredients: [
        { id: '1', name: 'Tofu' },
        { id: '2', name: 'Quinoa' },
        { id: '3', name: 'Avocado' },
        { id: '4', name: 'Sweet Potato' },
        { id: '5', name: 'Kale' },
      ],
      dietaryInfo: {
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isDairyFree: true,
      },
      rating: 4.6,
    },
    {
      id: '7',
      name: 'Shakshuka',
      description: 'Poached eggs in a spicy tomato and pepper sauce.',
      image: require('../assets/images/Shakshuka.png'),
      ingredients: [
        { id: '1', name: 'Eggs' },
        { id: '2', name: 'Tomatoes' },
        { id: '3', name: 'Bell Peppers' },
        { id: '4', name: 'Feta Cheese' },
        { id: '5', name: 'Cumin' },
      ],
      dietaryInfo: {
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        isDairyFree: false,
      },
      rating: 4.7,
    },
    {
      id: '8',
      name: 'Birria Tacos',
      description: 'Slow-cooked beef shredded into crispy, cheesy tacos.',
      image: require('../assets/images/Birria Tacos.png'),
      ingredients: [
        { id: '1', name: 'Beef' },
        { id: '2', name: 'Corn Tortillas' },
        { id: '3', name: 'Cheese' },
        { id: '4', name: 'Onion' },
        { id: '5', name: 'Cilantro' },
      ],
      dietaryInfo: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isDairyFree: false,
      },
      rating: 4.9,
    },
    {
      id: '9',
      name: 'Homemade Ramen',
      description: 'Rich broth with fresh noodles, eggs, and toppings.',
      image: require('../assets/images/Homemade Ramen.png'),
      ingredients: [
        { id: '1', name: 'Ramen Noodles' },
        { id: '2', name: 'Pork Belly' },
        { id: '3', name: 'Eggs' },
        { id: '4', name: 'Green Onions' },
        { id: '5', name: 'Nori' },
      ],
      dietaryInfo: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isDairyFree: true,
      },
      rating: 4.8,
    },
    {
      id: '10',
      name: 'Creamy Tuscan Gnocchi',
      description: 'Soft gnocchi in a garlicky sun-dried tomato cream sauce.',
      image: require('../assets/images/Creamy Tuscan Gnocchi.png'),
      ingredients: [
        { id: '1', name: 'Potato Gnocchi' },
        { id: '2', name: 'Heavy Cream' },
        { id: '3', name: 'Sun-dried Tomatoes' },
        { id: '4', name: 'Spinach' },
        { id: '5', name: 'Parmesan' },
      ],
      dietaryInfo: {
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        isDairyFree: false,
      },
      rating: 4.7,
    }
  ];

  // Get all unique ingredients from menu items
  const allIngredients = Array.from(new Set(
    menuItems.flatMap(item => item.ingredients.map(ing => ing.name))
  )).sort();

  // Filter suggestions based on input
  const getFilteredSuggestions = (input: string) => {
    const alreadyAddedIngredients = [...selectedFilters.includedIngredients, ...selectedFilters.excludedIngredients];
    return allIngredients.filter(ingredient =>
      ingredient.toLowerCase().includes(input.toLowerCase()) &&
      !alreadyAddedIngredients.includes(ingredient)
    );
  };

  // Update the text input handlers
  const handleIncludeInputFocus = () => {
    setActiveSuggestionField('include');
  };

  const handleExcludeInputFocus = () => {
    setActiveSuggestionField('exclude');
  };

  const handleIncludeInputChange = (text: string) => {
    setIncludeInputText(text);
    setActiveSuggestionField(text.length > 0 ? 'include' : null);
  };

  const handleExcludeInputChange = (text: string) => {
    setExcludeInputText(text);
    setActiveSuggestionField(text.length > 0 ? 'exclude' : null);
  };

  // Update the ingredient selection handlers
  const handleIncludeIngredient = (ingredient: string) => {
    if (!selectedFilters.includedIngredients.includes(ingredient)) {
      setSelectedFilters(prev => ({
        ...prev,
        includedIngredients: [...prev.includedIngredients, ingredient]
      }));
    }
    setIncludeInputText('');
    setActiveSuggestionField(null);
  };

  const handleExcludeIngredient = (ingredient: string) => {
    if (!selectedFilters.excludedIngredients.includes(ingredient)) {
      setSelectedFilters(prev => ({
        ...prev,
        excludedIngredients: [...prev.excludedIngredients, ingredient]
      }));
    }
    setExcludeInputText('');
    setActiveSuggestionField(null);
  };

  // Filter menu items based on search and filters
  const filteredMenuItems = menuItems.filter(item => {
    // Search by name
    const nameMatch = item.name.toLowerCase().includes(searchText.toLowerCase());
    
    // Search by ingredients
    const ingredientMatch = item.ingredients.some(ing => 
      ing.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // Apply dietary filters
    const dietaryMatch = selectedFilters.dietary.length === 0 || selectedFilters.dietary.every(filter => {
      switch (filter) {
        case 'vegetarian':
          return item.dietaryInfo.isVegetarian;
        case 'vegan':
          return item.dietaryInfo.isVegan;
        case 'glutenFree':
          return item.dietaryInfo.isGlutenFree;
        case 'dairyFree':
          return item.dietaryInfo.isDairyFree;
        default:
          return true;
      }
    });

    // Check included ingredients
    const includedIngredientsMatch = selectedFilters.includedIngredients.length === 0 || 
      selectedFilters.includedIngredients.every(ing => 
        item.ingredients.some(itemIng => itemIng.name.toLowerCase() === ing.toLowerCase())
      );

    // Check excluded ingredients
    const excludedIngredientsMatch = selectedFilters.excludedIngredients.length === 0 ||
      !selectedFilters.excludedIngredients.some(ing =>
        item.ingredients.some(itemIng => itemIng.name.toLowerCase() === ing.toLowerCase())
      );

    return (nameMatch || ingredientMatch) && dietaryMatch && includedIngredientsMatch && excludedIngredientsMatch;
  });

  // Handle column count change
  const handleColumnCountChange = (count: number) => {
    setColumnCount(count);
  };

  // Handle menu item selection
  const handleMenuItemPress = (item: MenuItem) => {
    setSelectedMenuItem(item);
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
      
      {/* Search and Filter Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or ingredients..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Ionicons name="filter" size={24} color="#4CAF50" />
          {(selectedFilters.dietary.length > 0 || 
            selectedFilters.includedIngredients.length > 0 || 
            selectedFilters.excludedIngredients.length > 0) && (
            <View style={styles.filterBadge} />
          )}
        </TouchableOpacity>
      </View>

      {/* Layout Controls */}
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

      {/* Menu Items Grid */}
      <FlatList
        data={filteredMenuItems}
        keyExtractor={(item) => item.id}
        numColumns={columnCount}
        key={columnCount.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.menuCard, 
              { width: (width - 32) / columnCount - (columnCount > 1 ? 8 : 0) }
            ]}
            onPress={() => handleMenuItemPress(item)}
          >
            <Image 
              source={item.image} 
              style={[styles.menuImage, { height: width / columnCount }]} 
            />
            <View style={styles.menuInfo}>
              <Text style={styles.menuName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.menuDescription} numberOfLines={2}>{item.description}</Text>
              <View style={styles.menuFooter}>
                <Text style={styles.menuRating}>⭐ {item.rating}</Text>
                {item.dietaryInfo.isVegetarian && (
                  <Text style={styles.dietaryBadge}>🌱</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.menuGrid}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsFilterModalVisible(false)}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Filters</Text>
            
            {/* Dietary Preferences */}
            <Text style={styles.filterSectionTitle}>Dietary Preferences</Text>
            <View style={styles.filterOptions}>
              {['vegetarian', 'vegan', 'glutenFree', 'dairyFree'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.filterOption,
                    selectedFilters.dietary.includes(option) && styles.selectedFilterOption
                  ]}
                  onPress={() => {
                    setSelectedFilters(prev => ({
                      ...prev,
                      dietary: prev.dietary.includes(option)
                        ? prev.dietary.filter(item => item !== option)
                        : [...prev.dietary, option]
                    }));
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedFilters.dietary.includes(option) && styles.selectedFilterOptionText
                  ]}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Include Ingredients Input */}
            <Text style={styles.filterSectionTitle}>Include Ingredients</Text>
            <View style={[styles.ingredientInputContainer, { zIndex: 3 }]}>
              <TextInput
                ref={includeIngredientInputRef}
                style={styles.ingredientInput}
                placeholder="Add ingredient to include..."
                value={includeInputText}
                onChangeText={handleIncludeInputChange}
                onFocus={handleIncludeInputFocus}
              />
              {activeSuggestionField === 'include' && includeInputText.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <ScrollView style={styles.suggestionsList}>
                    {getFilteredSuggestions(includeInputText).map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => handleIncludeIngredient(suggestion)}
                      >
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <ScrollView 
              style={[
                styles.selectedIngredientsScroll,
                { minHeight: selectedFilters.includedIngredients.length > 0 ? 80 : 0 }
              ]}
              contentContainerStyle={styles.selectedIngredients}
            >
              {selectedFilters.includedIngredients.map((ingredient, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.selectedIngredient}
                  onPress={() => {
                    setSelectedFilters(prev => ({
                      ...prev,
                      includedIngredients: prev.includedIngredients.filter((_, i) => i !== index)
                    }));
                  }}
                >
                  <Text style={styles.selectedIngredientText}>{ingredient}</Text>
                  <AntDesign name="close" size={16} color="#4CAF50" />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Exclude Ingredients Input */}
            <Text style={styles.filterSectionTitle}>Exclude Ingredients</Text>
            <View style={[styles.ingredientInputContainer, { zIndex: 2 }]}>
              <TextInput
                ref={excludeIngredientInputRef}
                style={styles.ingredientInput}
                placeholder="Add ingredient to exclude..."
                value={excludeInputText}
                onChangeText={handleExcludeInputChange}
                onFocus={handleExcludeInputFocus}
              />
              {activeSuggestionField === 'exclude' && excludeInputText.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <ScrollView style={styles.suggestionsList}>
                    {getFilteredSuggestions(excludeInputText).map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => handleExcludeIngredient(suggestion)}
                      >
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <ScrollView 
              style={[
                styles.selectedIngredientsScroll,
                { minHeight: selectedFilters.excludedIngredients.length > 0 ? 80 : 0 }
              ]}
              contentContainerStyle={styles.selectedIngredients}
            >
              {selectedFilters.excludedIngredients.map((ingredient, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.selectedIngredient, styles.excludedIngredient]}
                  onPress={() => {
                    setSelectedFilters(prev => ({
                      ...prev,
                      excludedIngredients: prev.excludedIngredients.filter((_, i) => i !== index)
                    }));
                  }}
                >
                  <Text style={styles.selectedIngredientText}>{ingredient}</Text>
                  <AntDesign name="close" size={16} color="#FF4B4B" />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Filter Actions */}
            <View style={styles.filterActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSelectedFilters({
                    dietary: [],
                    includedIngredients: [],
                    excludedIngredients: [],
                  });
                }}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setIsFilterModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Product Modal */}
      {selectedMenuItem && (
        <ProductModal
          visible={isProductModalVisible}
          onClose={() => setIsProductModalVisible(false)}
          productImage={selectedMenuItem.image}
          productName={selectedMenuItem.name}
          productDescription={selectedMenuItem.description}
          productPrice={0}
          isFood={true}
          ingredients={selectedMenuItem.ingredients}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  layoutControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  menuGrid: {
    padding: 16,
  },
  menuCard: {
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
  menuImage: {
    width: '100%',
    resizeMode: 'cover',
  },
  menuInfo: {
    padding: 12,
  },
  menuName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  menuFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuRating: {
    fontSize: 12,
    color: '#666',
  },
  dietaryBadge: {
    fontSize: 12,
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFilterOption: {
    backgroundColor: '#4CAF50',
  },
  filterOptionText: {
    color: '#666',
    fontSize: 14,
  },
  selectedFilterOptionText: {
    color: '#fff',
  },
  ingredientInput: {
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  selectedIngredientsScroll: {
    maxHeight: 80,
    marginBottom: 8,
  },
  selectedIngredients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: 0,
  },
  selectedIngredient: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  excludedIngredient: {
    backgroundColor: '#ffebee',
    borderColor: '#FF4B4B',
  },
  selectedIngredientText: {
    color: '#1a1a1a',
    marginRight: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  clearButtonText: {
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  applyButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  ingredientInputContainer: {
    position: 'relative',
    zIndex: 2,
    marginBottom: 8,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 250,
    elevation: 4,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionsList: {
    maxHeight: 250,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
});

export default AllMenu; 
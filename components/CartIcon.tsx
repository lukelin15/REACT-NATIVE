import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCart } from '../lib/CartContext';

type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
};

type CartNavigationProp = StackNavigationProp<RootStackParamList>;

interface CartIconProps {
  color?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ color = '#FFFFFF' }) => {
  const navigation = useNavigation<CartNavigationProp>();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const handlePress = () => {
    navigation.navigate('Cart');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Ionicons name="cart-outline" size={24} color={color} />
      {itemCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {itemCount > 99 ? '99+' : itemCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginRight: 8,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#FF4B4B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
});

export default CartIcon; 
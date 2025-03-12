import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Index: undefined;
  ItemsYouMightNeed: undefined;
};

type ItemsYouMightNeedNavigationProp = StackNavigationProp<RootStackParamList, 'ItemsYouMightNeed'>;

interface ItemsYouMightNeedProps {
  navigation: ItemsYouMightNeedNavigationProp;
}

export default function ItemsYouMightNeed({ navigation }: ItemsYouMightNeedProps) {
    const allItems = [
        { id: 1, name: "Tomatoes", image: require("../assets/images/Tomatoes.jpg") },
        { id: 2, name: "Cheese", image: require("../assets/images/Cheese.jpg") },
        { id: 3, name: "Rice", image: require("../assets/images/Rice.jpg") },
        { id: 4, name: "Orange", image: require("../assets/images/Orange.jpg") },
        { id: 5, name: "Potato", image: require("../assets/images/Potato.jpg") },
        // { id: 6, name: "Spinach", image: require("../assets/images/Spinach.jpg") },
        { id: 7, name: "Chicken", image: require("../assets/images/Chicken.jpg") },
        { id: 8, name: "Beef", image: require("../assets/images/Beef.jpg") },
        { id: 9, name: "Milk", image: require("../assets/images/Milk.jpg") },
        { id: 10, name: "Eggs", image: require("../assets/images/Eggs.jpg") },
    ];

    const renderItem = ({ item }: { item: { id: number, name: string, image: any } }) => (
        <View style={styles.card}>
          <Image source={item.image} style={styles.cardImage} />
          <Text style={styles.cardText}>{item.name}</Text>
        </View>
      );

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Items You Might Need</Text>

        <FlatList
            data={allItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row} 
            showsVerticalScrollIndicator={false}
        />
        
        {/* <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity> */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: "#f7f7f7",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 8,
        width: '45%', 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    cardImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    cardText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
    },
    backButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        backgroundColor: '#2E8B57',
        borderRadius: 25,
        marginTop: 20,
        alignSelf: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

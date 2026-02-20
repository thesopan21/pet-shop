import { PetCard } from '@/components/pet-card';
import { addToCart } from '@/store/slices/cartSlice';
import { selectPets } from '@/store/slices/petsSlices';
import { Pet } from '@/types/pet';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

export default function PetListingScreen() {
  const pets = useSelector(selectPets);
  const dispatch = useDispatch();

  const handleAddToCart = (pet: Pet) => {
    dispatch(addToCart(pet));
    Toast.show({
      type: 'success',
      text1: 'Added to Cart',
      text2: `${pet.name} has been added to your cart.`,
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🐾</Text>
      <Text style={styles.emptyTitle}>No Pets Available</Text>
      <Text style={styles.emptyText}>
        Add your first pet using the "Add Pet" tab!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pet Shop</Text>
        <Text style={styles.subtitle}>
          {pets.length} {pets.length === 1 ? 'pet' : 'pets'} available
        </Text>
      </View>

      <FlatList
        data={pets}
        renderItem={({ item }) => (
          <PetCard pet={item} onAddToCart={handleAddToCart} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          pets.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

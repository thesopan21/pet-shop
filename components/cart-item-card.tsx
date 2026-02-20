import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem } from '@/types/pet';

interface CartItemCardProps {
  item: CartItem;
  onRemove: (petId: string) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item, onRemove }) => {
  const { pet, quantity } = item;
  const total = pet.price * quantity;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: pet.imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{pet.name}</Text>
          <TouchableOpacity
            onPress={() => onRemove(pet.id)}
            style={styles.removeButton}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
        <Text style={styles.breed}>{pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'}</Text>
        <View style={styles.footer}>
          <Text style={styles.quantity}>Qty: {quantity}</Text>
          <Text style={styles.price}>${total.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  breed: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
});

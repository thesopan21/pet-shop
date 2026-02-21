import { CartItem } from '@/types/pet';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface CartItemCardProps {
  item: CartItem;
  onRemove: (petId: string) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item, onRemove }) => {
  const { pet, quantity } = item;

  const getAgeDisplay = () => {
    if (pet.age < 1) {
      const months = Math.round(pet.age * 12);
      return `${months} MONTHS`;
    }
    const years = Math.floor(pet.age);
    return `${years} ${years === 1 ? 'YEAR' : 'YEARS'}`;
  };

  const getPetType = () => {
    return pet.category.toUpperCase();
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: pet.imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.breed}>{pet.breed}</Text>
        <Text style={styles.details}>
          {getPetType()} • {getAgeDisplay()}
        </Text>
        <Text style={styles.price}>${pet.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onRemove(pet.id)}
        style={styles.removeButton}
      >
        <Ionicons name="trash-outline" size={18} color="#EF4444" />
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  breed: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  details: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F97316',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
});

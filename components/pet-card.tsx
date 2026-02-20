import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Pet } from '@/types/pet';
import { Button } from '@/components/ui/button';

interface PetCardProps {
  pet: Pet;
  onAddToCart: (pet: Pet) => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, onAddToCart }) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: pet.imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.breed}>{pet.breed}</Text>
        <View style={styles.footer}>
          <View>
            <Text style={styles.ageLabel}>Age</Text>
            <Text style={styles.age}>{pet.age} {pet.age === 1 ? 'year' : 'years'}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${pet.price}</Text>
          </View>
        </View>
        <Button
          title="Add to Cart"
          onPress={() => onAddToCart(pet)}
          variant="primary"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  breed: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ageLabel: {
    fontSize: 12,
    color: '#999',
  },
  age: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  priceContainer: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  button: {
    marginTop: 4,
  },
});

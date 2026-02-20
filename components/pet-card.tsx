import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { Pet } from '@/types/pet';
import { Button } from '@/components/ui/button';


interface PetCardProps {
  pet: Pet;
  onAddToCart: (pet: Pet) => void;
  onToggleFavorite: (petId: string) => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, onAddToCart }) => {
  const getAgeDisplay = () => {
    if (pet.age < 1) {
      const months = Math.round(pet.age * 12);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    }
    return `${pet.age} ${pet.age === 1 ? 'year' : 'years'}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pet.imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.details}>
          {pet.breed} - {getAgeDisplay()}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.price}>${pet.price}</Text>
          <Button
            title="Add to Cart"
            onPress={() => onAddToCart(pet)}
            variant="primary"
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  details: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F97316',
  },
  button: {
    flex: 0,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
});

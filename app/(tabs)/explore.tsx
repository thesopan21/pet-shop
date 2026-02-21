import { fetchRandomDogImage } from '@/services/api';
import { addToCart, selectCartItemsCount } from '@/store/slices/cartSlice';
import { Pet } from '@/types/pet';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';


export default function ExploreScreen() {
  const dispatch = useDispatch();
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cartItemsCount = useSelector(selectCartItemsCount);

  // Load a random pet on mount
  useEffect(() => {
    loadRandomPet();
  }, []);

  const loadRandomPet = async () => {
    setIsLoading(true);
    try {
      const imageUrl = await fetchRandomDogImage();

      // Extract breed name from URL (e.g., "breeds/golden-retriever/image.jpg")
      const breedMatch = imageUrl.match(/breeds\/([^\/]+)\//);
      let breedName = 'Mixed Breed';

      if (breedMatch && breedMatch[1]) {
        // Convert URL format to readable name (e.g., "golden-retriever" -> "Golden Retriever")
        breedName = breedMatch[1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

      // Generate random pet name
      const dogNames = ['Max', 'Buddy', 'Charlie', 'Cooper', 'Rocky', 'Bear', 'Duke', 'Zeus',
        'Bailey', 'Jack', 'Milo', 'Bentley', 'Oliver', 'Tucker', 'Buster', 'Leo'];
      const randomName = dogNames[Math.floor(Math.random() * dogNames.length)];

      // Create a Pet object
      const newPet: Pet = {
        id: `random-${Date.now()}`,
        name: randomName,
        breed: breedName,
        age: Math.random() * 2,
        price: Math.floor(Math.random() * 800) + 400,
        imageUri: imageUrl,
        createdAt: new Date().toISOString(),
        category: 'dog',
        status: 'available',
        isFavorite: false,
      };

      setCurrentPet(newPet);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading random pet:', error);
      Toast.show({
        type: 'error',
        text1: 'Oops!',
        text2: 'Failed to fetch a new friend. Please try again.',
      });
      setIsLoading(false);
    }
  };

  const handleFetchNewFriend = () => {
    loadRandomPet();
  };


  const handleAddToCart = () => {
    if (currentPet) {
      dispatch(addToCart(currentPet));
      Toast.show({
        type: 'success',
        text1: 'Added to Cart',
        text2: `${currentPet.name} has been added to your cart!`,
      });
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar style="dark" backgroundColor="white" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pet Discovery</Text>
          <TouchableOpacity
            style={styles.cartBadgeContainer}
            onPress={() => router.push('/cart')}
          >
            {cartItemsCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </Text>
              </View>
            )}
            <Ionicons name="cart" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Pet Card */}
        {isLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#F97316" />
            <Text style={styles.loadingText}>Finding your perfect match...</Text>
          </View>
        ) : currentPet ? (
          <View style={styles.petCard}>
            <Image
              source={{ uri: currentPet.imageUri }}
              style={styles.petImage}
              resizeMode="cover"
            />

            {/* Pet Info Overlay */}
            <View style={styles.petInfoOverlay}>
              <View style={styles.petInfoContent}>
                <View>
                  <Text style={styles.breedLabel}>BREED SPOTTED</Text>
                  <Text style={styles.breedName}>{currentPet.breed}</Text>
                </View>
              </View>
            </View>
          </View>
        ) : null}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleFetchNewFriend}
            disabled={isLoading}
          >
            <Ionicons name="sparkles" size={24} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Fetch New Friend!</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Add to Cart Button */}
        {currentPet && (
          <TouchableOpacity
            style={styles.quickAddButton}
            onPress={handleAddToCart}
          >
            <Ionicons name="cart" size={20} color="#FFFFFF" />
            <Text style={styles.quickAddText}>Add {currentPet.name} to Cart</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    zIndex: 999,
    backgroundColor: '#EF4444',
    borderRadius: 20,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cartBadgeContainer: {
    position: 'relative',
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  petCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  petImage: {
    width: '100%',
    height: 420,
    backgroundColor: '#E5E7EB',
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  petInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  petInfoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breedLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F97316',
    letterSpacing: 1,
    marginBottom: 4,
  },
  breedName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  loadingCard: {
    marginHorizontal: 24,
    height: 420,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  actionButtons: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#F97316',
    borderRadius: 16,
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  secondaryButtonIcon: {
    marginRight: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  shareButton: {
    width: 56,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  proTipSection: {
    marginHorizontal: 24,
    marginTop: 32,
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  proTipHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  proTipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proTipTextContainer: {
    flex: 1,
  },
  proTipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  proTipText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  quickAddButton: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  quickAddText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

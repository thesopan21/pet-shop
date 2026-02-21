import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Pet } from '@/types/pet';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';


export default function ExploreScreen() {
  const dispatch = useDispatch();
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [savedPets, setSavedPets] = useState<string[]>([]);

  // Load a random pet on mount
  useEffect(() => {
    loadRandomPet();
  }, []);

  // add api call for random pet handler

  const handleFetchNewFriend = () => {
    // use api to fetch new pet and update state
    setIsFavorite(false);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite && currentPet) {
      Toast.show({
        type: 'success',
        text1: 'Added to Favorites',
        text2: `${currentPet.name} has been added to your favorites!`,
      });
    }
  };

  const handleSaveForLater = () => {
    if (currentPet && !savedPets.includes(currentPet.id)) {
      setSavedPets([...savedPets, currentPet.id]);
      Toast.show({
        type: 'success',
        text1: 'Saved for Later',
        text2: `${currentPet.name} has been saved to your list!`,
      });
    }
  };

  const handleShare = async () => {
    if (!currentPet) return;
    
    try {
      await Share.share({
        message: `Check out this amazing ${currentPet.breed} named ${currentPet.name}! Available for adoption at $${currentPet.price}.`,
        title: `Meet ${currentPet.name}!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
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
    <SafeAreaView style={styles.container}>
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
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.mainTitle}>Who's a good dog?</Text>
          <Text style={styles.subtitle}>
            Discover your next best friend with a single tap!
          </Text>
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
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
            >
              <Ionicons 
                name="paw" 
                size={24} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            
            {/* Pet Info Overlay */}
            <View style={styles.petInfoOverlay}>
              <View style={styles.petInfoContent}>
                <View>
                  <Text style={styles.breedLabel}>BREED SPOTTED</Text>
                  <Text style={styles.breedName}>{currentPet.breed}</Text>
                </View>
                <TouchableOpacity onPress={handleToggleFavorite}>
                  <Ionicons 
                    name={isFavorite ? "heart" : "heart-outline"} 
                    size={28} 
                    color="#F97316" 
                  />
                </TouchableOpacity>
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

          <View style={styles.secondaryButtons}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleSaveForLater}
            >
              <Ionicons name="bookmark" size={20} color="#F97316" style={styles.secondaryButtonIcon} />
              <Text style={styles.secondaryButtonText}>Save for Later</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleShare}
            >
              <Ionicons name="share-social" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Pro Tip Section */}
        <View style={styles.proTipSection}>
          <View style={styles.proTipHeader}>
            <View style={styles.proTipIcon}>
              <Ionicons name="information" size={20} color="#F97316" />
            </View>
            <View style={styles.proTipTextContainer}>
              <Text style={styles.proTipTitle}>Pro Tip: Daily Sniffs</Text>
              <Text style={styles.proTipText}>
                Checking in daily increases your chances of finding rare breeds looking for a loving forever home.
              </Text>
            </View>
          </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 20,
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

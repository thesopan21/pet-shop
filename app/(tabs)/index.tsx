import { PetCard } from '@/components/pet-card';
import { addToCart } from '@/store/slices/cartSlice';
import { selectCartItemsCount } from '@/store/slices/cartSlice';
import {
  selectPets,
  selectIsLoading,
  selectIsLoadingMore,
  selectHasMore,
  selectCurrentPage,
  fetchPets,
  toggleFavorite,
  resetPets
} from '@/store/slices/petsSlices';
import { Pet } from '@/types/pet';
import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { AppDispatch } from '@/store/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';


export default function PetListingScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const pets = useSelector(selectPets);
  const isLoading = useSelector(selectIsLoading);
  const isLoadingMore = useSelector(selectIsLoadingMore);
  const hasMore = useSelector(selectHasMore);
  const currentPage = useSelector(selectCurrentPage);
  const cartItemsCount = useSelector(selectCartItemsCount);

  const [refreshing, setRefreshing] = useState(false);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchPets({ page: 1, limit: 10 }));
  }, []);


  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    dispatch(resetPets());
    await dispatch(fetchPets({
      page: 1,
      limit: 10,
    }));
    setRefreshing(false);
  }

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      dispatch(fetchPets({
        page: currentPage + 1,
        limit: 10,
      }));
    }
  }, [isLoadingMore, hasMore, currentPage]);

  const handleAddToCart = (pet: Pet) => {
    dispatch(addToCart(pet));
    Toast.show({
      type: 'success',
      text1: 'Added to Cart',
      text2: `${pet.name} has been added to your cart.`,
    });
  };

  const handleToggleFavorite = (petId: string) => {
    dispatch(toggleFavorite(petId));
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

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#F97316" />
        <Text style={styles.loadingText}>Loading more pets...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="paw" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>Pet Paradise</Text>
            </View>
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
        </View>

        {/* Pet List */}
        {isLoading && pets.length === 0 ? (
          <View style={styles.centerLoader}>
            <ActivityIndicator size="large" color="#F97316" />
            <Text style={styles.loadingText}>Loading pets...</Text>
          </View>
        ) : (
          <FlatList
            data={pets}
            renderItem={({ item }) => (
              <PetCard
                pet={item}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              pets.length === 0 && styles.emptyListContent,
            ]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={renderFooter}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#F97316"
                colors={['#F97316']}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 18,
    paddingTop: 18
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {

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
  subtitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#F97316',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
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
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

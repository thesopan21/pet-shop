import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { usePetStore } from '@/store/pet-store';
import { CartItemCard } from '@/components/cart-item-card';
import { Button } from '@/components/ui/button';

export default function CartScreen() {
  const { cart, removeFromCart, clearCart, getCartTotal, getCartItemsCount } = usePetStore();
  const total = getCartTotal();
  const itemsCount = getCartItemsCount();

  const handleRemoveItem = (petId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeFromCart(petId);
            Toast.show({
              type: 'info',
              text1: 'Item Removed',
              text2: 'The item has been removed from your cart.',
            });
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearCart();
            Toast.show({
              type: 'info',
              text1: 'Cart Cleared',
              text2: 'All items have been removed from your cart.',
            });
          },
        },
      ]
    );
  };

  const handleCheckout = () => {
    Toast.show({
      type: 'success',
      text1: 'Checkout Successful!',
      text2: `Your order of ${itemsCount} ${itemsCount === 1 ? 'pet' : 'pets'} has been placed.`,
    });
    clearCart();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptyText}>
        Browse our pet shop and add some furry friends to your cart!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        {cart.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={cart}
        renderItem={({ item }) => (
          <CartItemCard item={item} onRemove={handleRemoveItem} />
        )}
        keyExtractor={(item) => item.pet.id}
        contentContainerStyle={[
          styles.listContent,
          cart.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalSection}>
            <View>
              <Text style={styles.totalLabel}>Total Items</Text>
              <Text style={styles.itemsCount}>{itemsCount}</Text>
            </View>
            <View style={styles.totalPriceContainer}>
              <Text style={styles.totalLabel}>Total Price</Text>
              <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
            </View>
          </View>
          <Button
            title="Proceed to Checkout"
            onPress={handleCheckout}
            variant="primary"
          />
        </View>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
  },
  clearButton: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
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
    paddingHorizontal: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemsCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  totalPriceContainer: {
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
});

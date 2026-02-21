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
import { useSelector, useDispatch } from 'react-redux';
import { selectCart, selectCartTotal, selectCartItemsCount, removeFromCart, clearCart } from '@/store/slices/cartSlice';
import { CartItemCard } from '@/components/cart-item-card';
import { Button } from '@/components/ui/button';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

export default function CartScreen() {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const total = useSelector(selectCartTotal);
  const itemsCount = useSelector(selectCartItemsCount);

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
            dispatch(removeFromCart(petId));
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

  const handleCheckout = () => {
    Toast.show({
      type: 'success',
      text1: 'Checkout Successful!',
      text2: `Your order of ${itemsCount} ${itemsCount === 1 ? 'pet' : 'pets'} has been placed.`,
    });
    dispatch(clearCart());
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor='white' />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.title}>My Cart</Text>
          <View style={styles.placeholder} />
        </View>

        {cart.length > 0 ? (
          <>
            <FlatList
              data={cart}
              renderItem={({ item }) => (
                <CartItemCard item={item} onRemove={handleRemoveItem} />
              )}
              keyExtractor={(item) => item.pet.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => (
                <Text style={styles.itemsSummary}>
                  You have {itemsCount} {itemsCount === 1 ? 'item' : 'items'} in your cart
                </Text>
              )}
            />

            {/* Footer Summary */}
            <View style={styles.footer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
              <Button
                title="Proceed to Checkout"
                onPress={handleCheckout}
                variant="primary"
                style={styles.checkoutButton}
                rightIcon={<Ionicons name="cart-outline" size={20} color="#FFFFFF" />}
              />
            </View>
          </>
        ) : (
          renderEmptyState()
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  itemsSummary: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 80,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  summaryIncluded: {
    fontSize: 16,
    color: '#6B7280',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 20,
    color: '#1F2937',
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 28,
    color: '#F97316',
    fontWeight: '700',
  },
  checkoutButton: {
    backgroundColor: '#F97316',
    borderRadius: 16,
    paddingVertical: 16,
  },
});

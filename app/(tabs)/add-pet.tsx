import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addPet, selectIsSubmitting, setIsSubmitting } from '@/store/slices/petsSlices';
import { Pet } from '@/types/pet';
import { petSchema } from '@/validation/pet-schema';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

export default function AddPetScreen() {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [category, setCategory] = useState<'dog' | 'cat' | 'bird' | 'other'>('dog');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useDispatch();
  const isSubmitting = useSelector(selectIsSubmitting);

  // Refs for keyboard navigation
  const breedInputRef = useRef<TextInput>(null);
  const ageInputRef = useRef<TextInput>(null);
  const priceInputRef = useRef<TextInput>(null);

  const resetForm = () => {
    setName('');
    setBreed('');
    setAge('');
    setPrice('');
    setImageUri('');
    setCategory('dog');
    setErrors({});
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload images.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setErrors((prev) => ({ ...prev, imageUri: '' }));
    }
  };

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to take photos.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setErrors((prev) => ({ ...prev, imageUri: '' }));
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Upload Image',
      'Choose an option to add a pet image',
      [
        { text: 'Camera', onPress: pickImageFromCamera },
        { text: 'Gallery', onPress: pickImageFromGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const validateForm = () => {
    try {
      petSchema.parse({
        name,
        breed,
        age: parseFloat(age),
        price: parseFloat(price),
        imageUri,
        category,
      });
      setErrors({});
      return true;
    } catch (error: any) {
      const formattedErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fix the errors in the form.',
      });
      return;
    }

    try {
      dispatch(setIsSubmitting(true));

      // Create pet object with generated ID and timestamp
      const newPet: Pet = {
        id: Date.now().toString(), // Generate unique ID based on timestamp
        name,
        breed,
        age: parseFloat(age),
        price: parseFloat(price),
        imageUri,
        category,
        createdAt: new Date().toISOString(),
        status: 'new-arrival',
        isFavorite: false,
      };

      dispatch(addPet(newPet));

      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: `${newPet.name} has been added to the pet shop.`,
      });

      // Reset form
      resetForm();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      dispatch(setIsSubmitting(false));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor='white' />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
            <Text style={styles.headerTitle}>Add New Pet</Text>
          </View>
        </View>

        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bottomOffset={20}
          keyboardShouldPersistTaps='always'
        >
          {/* Pet Photo Section */}
          <Text style={styles.sectionLabel}>Pet Photo</Text>

          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={showImagePickerOptions}
              >
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadContainer}>
              <View style={styles.uploadIcon}>
                <Ionicons name="camera" size={40} color="#F97316" />
              </View>
              <Text style={styles.uploadTitle}>Upload from gallery or camera</Text>
              <Text style={styles.uploadSubtitle}>PNG, JPG up to 10MB</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={showImagePickerOptions}
              >
                <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />
                <Text style={styles.uploadButtonText}>Upload Image</Text>
              </TouchableOpacity>
            </View>
          )}
          {errors.imageUri && <Text style={styles.errorText}>{errors.imageUri}</Text>}


          {/* Form Fields */}
          <Input
            label="Pet Name *"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="e.g., Buddy"
            error={errors.name}
            returnKeyType="next"
            onSubmit={() => breedInputRef.current?.focus()}
          />

          <Input
            ref={breedInputRef}
            label="Breed"
            value={breed}
            onChangeText={(text) => {
              setBreed(text);
              setErrors((prev) => ({ ...prev, breed: '' }));
            }}
            placeholder="e.g., Golden Retriever"
            error={errors.breed}
            returnKeyType="next"
            onSubmit={() => ageInputRef.current?.focus()}
          />

          {/* Category Selection */}
          <View style={styles.categorySection}>
            <Text style={styles.categoryLabel}>Category *</Text>
            <View style={styles.categoryButtons}>
              {(['dog', 'cat', 'bird', 'other'] as const).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => {
                    setCategory(cat);
                    setErrors((prev) => ({ ...prev, category: '' }));
                  }}
                >
                  <Ionicons
                    name={
                      cat === 'dog' ? 'paw' :
                        cat === 'cat' ? 'paw' :
                          cat === 'bird' ? 'leaf' : 'egg'
                    }
                    size={18}
                    color={category === cat ? '#FFFFFF' : '#6B7280'}
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat && styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          {/* Age and Price in Row */}
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Input
                ref={ageInputRef}
                label="Age"
                value={age}
                onChangeText={(text) => {
                  setAge(text);
                  setErrors((prev) => ({ ...prev, age: '' }));
                }}
                placeholder="2"
                keyboardType="numeric"
                error={errors.age}
                returnKeyType="next"
                onSubmit={() => priceInputRef.current?.focus()}
              />
              <Text style={styles.unitLabel}>Years</Text>
            </View>

            <View style={styles.halfWidth}>
              <Input
                ref={priceInputRef}
                label="Price"
                value={price}
                onChangeText={(text) => {
                  setPrice(text);
                  setErrors((prev) => ({ ...prev, price: '' }));
                }}
                placeholder="$ 0.00"
                keyboardType="numeric"
                error={errors.price}
                returnKeyType="done"
                onSubmit={handleSubmit}
              />
            </View>
          </View>

          <Button
            title="Save Pet Profile"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
            leftIcon={<Ionicons name="paw" size={20} color="#FFFFFF" />}
          />
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  resetButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F97316',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  uploadContainer: {
    width: '100%',
    minHeight: 200,
    borderRadius: 16,
    backgroundColor: '#FEF3E8',
    borderWidth: 2,
    borderColor: '#F97316',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  uploadIcon: {
    position: 'relative',
    marginBottom: 16,
  },
  plusIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F97316',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  imagePreviewContainer: {
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  changeImageButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  changeImageText: {
    color: '#F97316',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  detailsIndicator: {
    width: 4,
    height: 24,
    backgroundColor: '#F97316',
    borderRadius: 2,
    marginRight: 12,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 12,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  halfWidth: {
    flex: 1,
    position: 'relative',
  },
  unitLabel: {
    position: 'absolute',
    right: 16,
    top: 45,
    fontSize: 14,
    color: '#F97316',
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: '#F97316',
  },
});

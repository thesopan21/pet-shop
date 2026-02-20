import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchRandomDogImage, submitPetDetails } from '@/services/api';
import { usePetStore } from '@/store/pet-store';
import { petSchema } from '@/validation/pet-schema';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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
import Toast from 'react-native-toast-message';

export default function AddPetScreen() {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for keyboard navigation
  const breedInputRef = useRef<TextInput>(null);
  const ageInputRef = useRef<TextInput>(null);
  const priceInputRef = useRef<TextInput>(null);

  const {
    addPet,
    isSubmitting,
    setIsSubmitting,
    isFetchingRandomImage,
    setIsFetchingRandomImage,
  } = usePetStore();

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload images.'
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

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

  const fetchRandomImage = async () => {
    try {
      setIsFetchingRandomImage(true);
      const randomImageUrl = await fetchRandomDogImage();
      setImageUri(randomImageUrl);
      setErrors((prev) => ({ ...prev, imageUri: '' }));
      Toast.show({
        type: 'success',
        text1: 'Random image loaded!',
        text2: 'A cute dog image has been fetched for you.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load image',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsFetchingRandomImage(false);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option to add a pet image',
      [
        { text: 'Camera', onPress: pickImageFromCamera },
        { text: 'Gallery', onPress: pickImageFromGallery },
        { text: 'Random Dog', onPress: fetchRandomImage },
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
      setIsSubmitting(true);

      const petData = {
        name,
        breed,
        age: parseFloat(age),
        price: parseFloat(price),
        imageUri,
      };

      const response = await submitPetDetails(petData);

      addPet(response);

      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: `${response.name} has been added to the pet shop.`,
      });

      // Reset form
      setName('');
      setBreed('');
      setAge('');
      setPrice('');
      setImageUri('');
      setErrors({});
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bottomOffset={20}
      >
        <Text style={styles.title}>Add New Pet</Text>
        <Text style={styles.subtitle}>Fill in the details to add a pet to the shop</Text>

        {/* Image Preview */}
        <View style={styles.imageSection}>
          {imageUri ? (
            <View>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={showImagePickerOptions}
              >
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.imagePlaceholder}
              onPress={showImagePickerOptions}
              disabled={isFetchingRandomImage}
            >
              <Ionicons name="camera-outline" size={48} color="#999" />
              <Text style={styles.placeholderText}>
                {isFetchingRandomImage ? 'Loading...' : 'Tap to add image'}
              </Text>
            </TouchableOpacity>
          )}
          {errors.imageUri && <Text style={styles.errorText}>{errors.imageUri}</Text>}
        </View>

        {/* Form Fields */}
        <Input
          label="Pet Name *"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrors((prev) => ({ ...prev, name: '' }));
          }}
          placeholder="e.g., Max"
          error={errors.name}
          returnKeyType="next"
          onSubmit={() => breedInputRef.current?.focus()}
        />

        <Input
          ref={breedInputRef}
          label="Breed *"
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

        <Input
          ref={ageInputRef}
          label="Age (years) *"
          value={age}
          onChangeText={(text) => {
            setAge(text);
            setErrors((prev) => ({ ...prev, age: '' }));
          }}
          placeholder="e.g., 2"
          keyboardType="numeric"
          error={errors.age}
          returnKeyType="next"
          onSubmit={() => priceInputRef.current?.focus()}
        />

        <Input
          ref={priceInputRef}
          label="Price ($) *"
          value={price}
          onChangeText={(text) => {
            setPrice(text);
            setErrors((prev) => ({ ...prev, price: '' }));
          }}
          placeholder="e.g., 500"
          keyboardType="numeric"
          error={errors.price}
          returnKeyType="done"
          onSubmit={handleSubmit}
        />

        <Button
          title="Submit Pet Details"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.submitButton}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  imageSection: {
    marginBottom: 24,
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  changeImageButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  changeImageText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 8,
  },
  submitButton: {
    marginTop: 8,
  },
});

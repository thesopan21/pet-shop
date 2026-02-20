# Pet Shop App - API Documentation

## Overview
This document describes the API endpoints used in the Pet Shop mobile application.

## Base URLs

### Mock API (ReqRes.in)
- **Base URL**: `https://reqres.in/api`
- **Purpose**: Mock backend for submitting pet details
- **Documentation**: https://reqres.in/

### Dog CEO API  
- **Base URL**: `https://dog.ceo/api`
- **Purpose**: Fetching random dog images
- **Documentation**: https://dog.ceo/dog-api/

---

## Endpoints

### 1. Submit Pet Details

**Endpoint**: `POST /users`

**Full URL**: `https://reqres.in/api/users`

**Purpose**: Submit new pet details to the backend

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Max",
  "breed": "Golden Retriever",
  "age": 3,
  "price": 500,
  "imageUri": "file:///path/to/image.jpg"
}
```

**Response (201 Created)**:
```json
{
  "name": "Max",
  "breed": "Golden Retriever",
  "age": 3,
  "price": 500,
  "imageUri": "file:///path/to/image.jpg",
  "id": "123",
  "createdAt": "2026-02-20T10:30:00.000Z"
}
```

**Implementation**:
```typescript
import { submitPetDetails } from '@/services/api';

const response = await submitPetDetails({
  name: 'Max',
  breed: 'Golden Retriever',
  age: 3,
  price: 500,
  imageUri: 'file:///...'
});
```

**Error Handling**:
- Network errors
- Invalid data format
- Server errors (5xx)

---

### 2. Fetch Random Dog Image

**Endpoint**: `GET /breeds/image/random`

**Full URL**: `https://dog.ceo/api/breeds/image/random`

**Purpose**: Get a random dog image URL

**Request Headers**: None required

**Response (200 OK)**:
```json
{
  "message": "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
  "status": "success"
}
```

**Implementation**:
```typescript
import { fetchRandomDogImage } from '@/services/api';

const imageUrl = await fetchRandomDogImage();
// Returns: "https://images.dog.ceo/breeds/..."
```

**Error Handling**:
- Network errors
- Invalid response format
- API rate limiting

---

## Error Response Format

All API errors are caught and formatted as:

```typescript
{
  message: string; // User-friendly error message
}
```

## Rate Limiting

### ReqRes.in
- No official rate limits documented
- Use responsibly for testing

### Dog CEO API
- No authentication required
- No official rate limits
- Free to use

## Future API Considerations

For production deployment, consider:

1. **Authentication**: Add JWT or OAuth tokens
2. **Image Upload**: Use cloud storage (AWS S3, Cloudinary)
3. **Real Backend**: Replace ReqRes.in with actual API
4. **API Versioning**: Use versioned endpoints (/v1/, /v2/)
5. **Pagination**: Add pagination for pet listings
6. **Search & Filter**: Add query parameters for search
7. **Error Codes**: Standardize error response codes

## Example Production API Structure

```
POST   /api/v1/pets              - Create new pet
GET    /api/v1/pets              - Get all pets (paginated)
GET    /api/v1/pets/:id          - Get pet by ID
PUT    /api/v1/pets/:id          - Update pet
DELETE /api/v1/pets/:id          - Delete pet
POST   /api/v1/pets/:id/image    - Upload pet image
GET    /api/v1/cart              - Get user's cart
POST   /api/v1/cart/items        - Add item to cart
DELETE /api/v1/cart/items/:id    - Remove item from cart
POST   /api/v1/orders            - Create new order
```

## API Service Architecture

The app uses a centralized API service layer:

```
app/
  └─ screens use store
       └─ store calls services
            └─ services call APIs
```

**Benefits**:
- Single source of truth for API calls
- Easy to mock for testing
- Type-safe with TypeScript
- Centralized error handling
- Easy to swap APIs

## Testing APIs

### Using Postman

**Submit Pet**:
```bash
curl -X POST https://reqres.in/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Buddy",
    "breed": "Labrador",
    "age": 2,
    "price": 400
  }'
```

**Get Random Dog Image**:
```bash
curl https://dog.ceo/api/breeds/image/random
```

## Notes on Third-Party APIs

### Why ReqRes.in?
- **Purpose**: Provides a mock REST API for testing
- **No Setup**: No authentication or signup required
- **Realistic**: Returns proper HTTP status codes
- **Free**: No cost for development/testing
- **Limitation**: Data is not actually stored

### Why Dog CEO API?
- **Purpose**: Free dog images for demonstrating image fetching
- **Quality**: High-quality, diverse dog images
- **Reliable**: Stable uptime and fast responses
- **Free**: No API key required
- **Limitation**: Only dog images (not cats or other pets)

In a production app, you would replace:
- ReqRes.in → Real backend API
- Dog CEO API → Your own image database or stock photo API

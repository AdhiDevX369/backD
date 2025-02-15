# Furniture API Guide

## Components

### 1. Create Furniture (Admin)
```javascript
// Request
POST /api/furniture
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}
Body:
{
  "name": "Classic Dining Table",
  "description": "Elegant dining table made from solid oak",
  "price": 899.99,
  "category": "categoryId",
  "wood_type": "woodTypeId",
  "dimensions": {
    "length": 180,
    "width": 90,
    "height": 75
  },
  "stock": 10,
  "images": ["image1.jpg", "image2.jpg"]
}

// Response - Success (201)
{
  "success": true,
  "furniture": {
    "id": "furnitureId",
    "name": "Classic Dining Table",
    "description": "Elegant dining table made from solid oak",
    "price": 899.99,
    "category": {
      "id": "categoryId",
      "name": "Tables"
    },
    "wood_type": {
      "id": "woodTypeId",
      "name": "Oak"
    },
    "dimensions": {
      "length": 180,
      "width": 90,
      "height": 75
    },
    "stock": 10,
    "images": ["image1.jpg", "image2.jpg"],
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}

// Response - Error (400)
{
  "error": "Invalid furniture details"
}
```

### 2. Get All Furniture
```javascript
// Request
GET /api/furniture
Query Parameters:
- category: Filter by category ID
- wood_type: Filter by wood type ID
- min_price: Minimum price
- max_price: Maximum price
- sort: Sort by field (price, name, created_at)
- order: Sort order (asc, desc)
- page: Page number
- limit: Items per page

// Response - Success (200)
{
  "success": true,
  "furniture": [
    {
      "id": "furnitureId1",
      "name": "Classic Dining Table",
      "price": 899.99,
      "category": {
        "id": "categoryId",
        "name": "Tables"
      },
      "wood_type": {
        "id": "woodTypeId",
        "name": "Oak"
      },
      "stock": 10,
      "images": ["image1.jpg"]
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 50,
    "items_per_page": 10
  }
}
```

### 3. Get Single Furniture
```javascript
// Request
GET /api/furniture/:id

// Response - Success (200)
{
  "success": true,
  "furniture": {
    "id": "furnitureId",
    "name": "Classic Dining Table",
    "description": "Elegant dining table made from solid oak",
    "price": 899.99,
    "category": {
      "id": "categoryId",
      "name": "Tables"
    },
    "wood_type": {
      "id": "woodTypeId",
      "name": "Oak"
    },
    "dimensions": {
      "length": 180,
      "width": 90,
      "height": 75
    },
    "stock": 10,
    "images": ["image1.jpg", "image2.jpg"],
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}

// Response - Error (404)
{
  "error": "Furniture not found"
}
```

### 4. Update Furniture (Admin)
```javascript
// Request
PUT /api/furniture/:id
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}
Body:
{
  "name": "Updated Dining Table",
  "price": 999.99,
  "stock": 15
}

// Response - Success (200)
{
  "success": true,
  "furniture": {
    "id": "furnitureId",
    "name": "Updated Dining Table",
    "price": 999.99,
    "stock": 15,
    // ... other unchanged fields
  }
}

// Response - Error (403)
{
  "error": "Not authorized to update furniture"
}
```

### 5. Delete Furniture (Admin)
```javascript
// Request
DELETE /api/furniture/:id
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}

// Response - Success (200)
{
  "success": true,
  "message": "Furniture deleted successfully"
}

// Response - Error (403)
{
  "error": "Not authorized to delete furniture"
}
```

### 6. Update Furniture Stock (Admin)
```javascript
// Request
PATCH /api/furniture/:id/stock
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}
Body:
{
  "stock": 20
}

// Response - Success (200)
{
  "success": true,
  "furniture": {
    "id": "furnitureId",
    "stock": 20,
    // ... other furniture details
  }
}
```

## Implementation Notes

1. Public endpoints:
   - Get all furniture
   - Get single furniture details
2. Admin-only endpoints:
   - Create furniture
   - Update furniture
   - Delete furniture
   - Update stock
3. Images are stored as URLs
4. Prices are stored in decimal format
5. Stock is automatically updated when orders are placed
6. Dimensions are stored in centimeters

## Filtering and Sorting

1. Available filters:
   - Category
   - Wood type
   - Price range
   - Stock availability

2. Sorting options:
   - Price (ascending/descending)
   - Name (alphabetical)
   - Creation date
   - Stock level

## Error Handling

Common HTTP Status Codes:
- 200: Successful operation
- 201: Furniture created successfully
- 400: Bad request (invalid input)
- 401: Unauthorized (invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Furniture not found
- 500: Server error

## Security Features

1. Admin Authorization
   - Create/Update/Delete operations restricted to admin users
   - Requires valid JWT token with admin role

2. Data Validation
   - Required fields validation
   - Price must be positive
   - Stock must be non-negative
   - Valid category and wood type references
   - Image URL validation

3. Stock Management
   - Automatic stock updates
   - Stock level validation during order placement
   - Low stock notifications (optional feature)
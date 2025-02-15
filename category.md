# Category API Guide

## Components

### 1. Create Category (Admin)
```javascript
// Request
POST /api/categories
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}
Body:
{
  "name": "Dining Tables",
  "description": "All types of dining tables",
  "image": "category-image.jpg"
}

// Response - Success (201)
{
  "success": true,
  "category": {
    "id": "categoryId",
    "name": "Dining Tables",
    "description": "All types of dining tables",
    "image": "category-image.jpg",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}

// Response - Error (400)
{
  "error": "Category name already exists"
}
```

### 2. Get All Categories
```javascript
// Request
GET /api/categories
Query Parameters:
- sort: Sort by field (name, created_at)
- order: Sort order (asc, desc)

// Response - Success (200)
{
  "success": true,
  "categories": [
    {
      "id": "categoryId1",
      "name": "Dining Tables",
      "description": "All types of dining tables",
      "image": "category-image.jpg",
      "furniture_count": 15
    },
    {
      "id": "categoryId2",
      "name": "Chairs",
      "description": "Dining and lounge chairs",
      "image": "chairs-category.jpg",
      "furniture_count": 25
    }
  ]
}
```

### 3. Get Single Category
```javascript
// Request
GET /api/categories/:id

// Response - Success (200)
{
  "success": true,
  "category": {
    "id": "categoryId",
    "name": "Dining Tables",
    "description": "All types of dining tables",
    "image": "category-image.jpg",
    "furniture_count": 15,
    "furniture": [
      {
        "id": "furnitureId1",
        "name": "Classic Dining Table",
        "price": 899.99,
        "image": "table1.jpg"
      }
      // ... more furniture items
    ]
  }
}

// Response - Error (404)
{
  "error": "Category not found"
}
```

### 4. Update Category (Admin)
```javascript
// Request
PUT /api/categories/:id
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}
Body:
{
  "name": "Modern Dining Tables",
  "description": "Contemporary dining tables"
}

// Response - Success (200)
{
  "success": true,
  "category": {
    "id": "categoryId",
    "name": "Modern Dining Tables",
    "description": "Contemporary dining tables",
    "image": "category-image.jpg"
  }
}

// Response - Error (403)
{
  "error": "Not authorized to update category"
}
```

### 5. Delete Category (Admin)
```javascript
// Request
DELETE /api/categories/:id
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}

// Response - Success (200)
{
  "success": true,
  "message": "Category deleted successfully"
}

// Response - Error (400)
{
  "error": "Cannot delete category with associated furniture"
}
```

### 6. Get Category Statistics (Admin)
```javascript
// Request
GET /api/categories/stats
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}

// Response - Success (200)
{
  "success": true,
  "stats": [
    {
      "category": {
        "id": "categoryId",
        "name": "Dining Tables"
      },
      "total_furniture": 15,
      "total_orders": 45,
      "revenue": 40495.50
    }
    // ... stats for other categories
  ]
}
```

## Implementation Notes

1. Public endpoints:
   - Get all categories
   - Get single category details
2. Admin-only endpoints:
   - Create category
   - Update category
   - Delete category
   - Get category statistics
3. Categories cannot be deleted if they have associated furniture
4. Category names must be unique
5. Image uploads are handled separately

## Category Management Rules

1. Name constraints:
   - Must be unique
   - 2-50 characters long
   - Alphanumeric with spaces allowed

2. Description constraints:
   - Optional
   - Maximum 500 characters

3. Image constraints:
   - Optional
   - Supported formats: JPG, PNG
   - Maximum size: 2MB

## Error Handling

Common HTTP Status Codes:
- 200: Successful operation
- 201: Category created successfully
- 400: Bad request (invalid input)
- 401: Unauthorized (invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Category not found
- 500: Server error

## Security Features

1. Admin Authorization
   - Create/Update/Delete operations restricted to admin users
   - Requires valid JWT token with admin role

2. Data Validation
   - Name uniqueness check
   - Required fields validation
   - Image format and size validation

3. Referential Integrity
   - Protection against deletion of categories with furniture
   - Automatic furniture count updates
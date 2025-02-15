# Wood Type API Guide

## Components

### 1. Create Wood Type (Admin)
```javascript
// Request
POST /api/woods
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}
Body:
{
  "name": "Oak",
  "description": "Premium hardwood known for durability",
  "price_multiplier": 1.5,
  "availability": true,
  "image": "oak-wood.jpg",
  "characteristics": {
    "hardness": "High",
    "color": "Light brown",
    "grain": "Prominent"
  }
}

// Response - Success (201)
{
  "success": true,
  "wood": {
    "id": "woodId",
    "name": "Oak",
    "description": "Premium hardwood known for durability",
    "price_multiplier": 1.5,
    "availability": true,
    "image": "oak-wood.jpg",
    "characteristics": {
      "hardness": "High",
      "color": "Light brown",
      "grain": "Prominent"
    },
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

### 2. Get All Wood Types
```javascript
// Request
GET /api/woods
Query Parameters:
- available: Filter by availability (true/false)
- sort: Sort by field (name, price_multiplier)
- order: Sort order (asc, desc)

// Response - Success (200)
{
  "success": true,
  "woods": [
    {
      "id": "woodId1",
      "name": "Oak",
      "description": "Premium hardwood known for durability",
      "price_multiplier": 1.5,
      "availability": true,
      "image": "oak-wood.jpg",
      "furniture_count": 12
    }
    // ... more wood types
  ]
}
```

### 3. Get Single Wood Type
```javascript
// Request
GET /api/woods/:id

// Response - Success (200)
{
  "success": true,
  "wood": {
    "id": "woodId",
    "name": "Oak",
    "description": "Premium hardwood known for durability",
    "price_multiplier": 1.5,
    "availability": true,
    "image": "oak-wood.jpg",
    "characteristics": {
      "hardness": "High",
      "color": "Light brown",
      "grain": "Prominent"
    },
    "furniture": [
      {
        "id": "furnitureId",
        "name": "Classic Dining Table",
        "price": 899.99
      }
      // ... more furniture items
    ]
  }
}

// Response - Error (404)
{
  "error": "Wood type not found"
}
```

### 4. Update Wood Type (Admin)
```javascript
// Request
PUT /api/woods/:id
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}
Body:
{
  "price_multiplier": 1.75,
  "availability": false,
  "characteristics": {
    "hardness": "Very High"
  }
}

// Response - Success (200)
{
  "success": true,
  "wood": {
    "id": "woodId",
    "name": "Oak",
    "price_multiplier": 1.75,
    "availability": false,
    "characteristics": {
      "hardness": "Very High",
      "color": "Light brown",
      "grain": "Prominent"
    }
    // ... other unchanged fields
  }
}
```

### 5. Delete Wood Type (Admin)
```javascript
// Request
DELETE /api/woods/:id
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}

// Response - Success (200)
{
  "success": true,
  "message": "Wood type deleted successfully"
}

// Response - Error (400)
{
  "error": "Cannot delete wood type with associated furniture"
}
```

### 6. Update Wood Availability (Admin)
```javascript
// Request
PATCH /api/woods/:id/availability
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}
Body:
{
  "availability": false
}

// Response - Success (200)
{
  "success": true,
  "wood": {
    "id": "woodId",
    "name": "Oak",
    "availability": false
    // ... other wood details
  }
}
```

## Implementation Notes

1. Public endpoints:
   - Get all wood types
   - Get single wood type details
2. Admin-only endpoints:
   - Create wood type
   - Update wood type
   - Delete wood type
   - Update availability
3. Price multiplier affects final furniture price
4. Cannot delete wood types with associated furniture
5. Wood characteristics are customizable

## Wood Type Rules

1. Name constraints:
   - Must be unique
   - 2-30 characters long
   - Alphabetic characters only

2. Price multiplier constraints:
   - Must be positive number
   - Range: 0.5 to 5.0

3. Characteristics:
   - Hardness: Low, Medium, High, Very High
   - Color: Text description
   - Grain: Text description
   - All characteristics are optional

## Error Handling

Common HTTP Status Codes:
- 200: Successful operation
- 201: Wood type created successfully
- 400: Bad request (invalid input)
- 401: Unauthorized (invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Wood type not found
- 500: Server error

## Security Features

1. Admin Authorization
   - Create/Update/Delete operations restricted to admin users
   - Requires valid JWT token with admin role

2. Data Validation
   - Name uniqueness check
   - Price multiplier range validation
   - Characteristics format validation

3. Referential Integrity
   - Protection against deletion of wood types with furniture
   - Automatic furniture updates when price multiplier changes
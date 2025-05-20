# Book Review System API

A RESTful API for a Book Review system built with Node.js, Express, and MongoDB.

## Tech Stack
- Node.js with Express.js
- MongoDB
- JWT Authentication

## Schema Design

### User Schema
```js
{
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false  // Password field is excluded from queries by default
  },
  createdAt: Date
}
```

### Book Schema
```js
{
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  author: {
    type: String,
    required: true,
    maxlength: 50
  },
  genre: {
    type: String,
    required: true,
    maxlength: 30
  },
  description: {
    type: String,
    maxlength: 500
  },
  averageRating: {
    type: Number,
    default: 0
  },
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: Date
}
```

### Review Schema
```js
{
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  },
  book: {
    type: ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: Date
}
// Compound index to prevent duplicate reviews
{ book: 1, user: 1 } (unique: true)
```

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a config.env file in the config folder with the following content:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/book-system
JWT_SECRET=b7c4d8e2f6g9h3j5k8m1n4p7q2r5t8v3w6x9y1z4
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```
4. Start the server:
```bash
npm run dev
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST http://localhost:5000/api/v1/auth/signup
Content-Type: application/json

{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456"
}
```

#### Login User
```http
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "123456"
}
```

### Books Endpoints

#### Create New Book
```http
POST http://localhost:5000/api/v1/books
Authorization: Bearer your_token_here
Content-Type: application/json

{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "description": "A story of decadence and excess."
}
```

#### Get All Books
```http
GET http://localhost:5000/api/v1/books

Optional Query Parameters:
- page=1
- limit=10
- sort=title
- genre=Fiction
- author=Fitzgerald
```

#### Get Single Book
```http
GET http://localhost:5000/api/v1/books/:id
Example: http://localhost:5000/api/v1/books/123456
```

#### Search Books
```http
GET http://localhost:5000/api/v1/books/search?q=gatsby
```

### Reviews Endpoints

#### Add Review to Book
```http
POST http://localhost:5000/api/v1/books/:bookId/reviews
Authorization: Bearer your_token_here
Content-Type: application/json

{
    "rating": 5,
    "comment": "Amazing book, loved it!"
}
```

#### Update Review
```http
PUT http://localhost:5000/api/v1/reviews/:reviewId
Authorization: Bearer your_token_here
Content-Type: application/json

{
    "rating": 4,
    "comment": "Updated review: Very good book"
}
```

#### Delete Review
```http
DELETE http://localhost:5000/api/v1/reviews/:reviewId
Authorization: Bearer your_token_here
```

## Testing with Postman

1. **Setup Postman**
   - Download and install [Postman](https://www.postman.com/downloads/)
   - Import the [Postman Collection](https://www.postman.com/collections/your-collection-id)

2. **Testing Flow**
   1. Create a new user using the signup endpoint
   2. Login to get the JWT token
   3. Copy the token from the response
   4. For protected routes, add the token to Authorization header:
      - Key: `Authorization`
      - Value: `Bearer your_token_here`

3. **Features to Test**
   - User authentication (signup/login)
   - CRUD operations on books
   - Adding/updating/deleting reviews
   - Search functionality
   - Pagination and filtering

## Security Features
- JWT Authentication
- Password Hashing
- Rate Limiting
- XSS Protection
- Security Headers
- MongoDB Sanitization
- Parameter Pollution Prevention
- CORS Support

## Error Handling
The API includes comprehensive error handling for:
- Invalid MongoDB IDs
- Duplicate fields
- Validation errors
- Authentication errors
- Authorization errors

## Results
Here’s a screenshot of the API in action:

![p1](https://github.com/yashlohade21/train-reservation/blob/master/styles/p1.png?raw=true)  ![p2](https://github.com/yashlohade21/train-reservation/blob/master/styles/p2.png?raw=true)  ![p3](https://github.com/yashlohade21/train-reservation/blob/master/styles/p3.png?raw=true) |

| ![p4](https://github.com/yashlohade21/train-reservation/blob/master/styles/p4.png?raw=true)  ![p5](https://github.com/yashlohade21/train-reservation/blob/master/styles/p5.png?raw=true)  ![p6](https://github.com/yashlohade21/train-reservation/blob/master/styles/p6.png?raw=true) 

| ![p7](https://github.com/yashlohade21/train-reservation/blob/master/styles/p7.png?raw=true)  ![p8](https://github.com/yashlohade21/train-reservation/blob/master/styles/p8.png?raw=true)  ![p9](https://github.com/yashlohade21/train-reservation/blob/master/styles/p9.png?raw=true) 

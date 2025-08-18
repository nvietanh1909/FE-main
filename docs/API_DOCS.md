# API DOCS

## Authentication
Sử dụng JWT Token authentication
- Header: `Authorization: Bearer <token>`

---

## 1. AUTHENTICATION APIs

### 1.1 Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "number",
      "name": "string",
      "email": "string",
      "role": "string",
      "department": "string",
      "position": "string",
      "employeeId": "string"
    },
    "token": "string",
  },
  "message": "Đăng nhập thành công"
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không chính xác",
}
```

### 1.2 Register
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "organization": "string"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "number",
      "email": "string",
      "organization": "string"
    }
  },
  "message": "Đăng ký thành công"
}
```


---

## 2. USER MANAGEMENT APIs

### 2.1 Get User Profile
**GET** `/users/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "department": "string",
    "position": "string",
    "employeeId": "string",
    "address": "string",
    "avatar": "string"
  }
}
```

### 2.2 Update User Profile
**PUT** `/users/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fullName": "string",
  "phone": "string",
  "address": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fullName": "string",
    "phone": "string",
    "address": "string"
  },
  "message": "Cập nhật thông tin thành công"
}
```

---

## 3. DASHBOARD APIs

### 3.1 Get Dashboard Stats
**GET** `/dashboard/stats`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "completedProcedures": {
      "count": "number",
      "change": "string"
    },
    "inProgressProcedures": {
      "count": "number", 
      "change": "string"
    },
    "totalQuestions": {
      "count": "number",
      "change": "string"
    }
  }
}
```

### 3.2 Get Available Procedures
**GET** `/dashboard/procedures`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "date": "string",
      "subItems": ["string"]
    }
  ]
}
```

### 3.3 Search Procedures
**GET** `/dashboard/search?q={query}&mode={mode}`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `q`: search query string
- `mode`: 0 (thường) hoặc 1 (thông minh)

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "number",
        "title": "string",
        "description": "string",
        "type": "string"
      }
    ],
    "suggestions": ["string"]
  }
}
```

---

## 4. PROCEDURE APIs

### 4.1 Get Procedures by Type
**GET** `/procedures?type={type}`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `type`: "domestic" hoặc "foreign"

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "title": "string",
      "description": "string", 
      "progress": "number"
    }
  ]
}
```

### 4.2 Get Procedure Detail
**GET** `/procedures/{id}`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "title": "string",
    "description": "string",
    "type": "string",
    "steps": [
      {
        "stepNumber": "number",
        "label": "string",
        "sublabel": "string",
        "title": "string",
        "content": ["string"],
        "documents": ["string"],
        "timeEstimate": "string",
        "status": "string"
      }
    ],
    "expenseDetails": [
      {
        "name": "string",
        "description": "string",
        "quantity": "number",
        "note": "string"
      }
    ]
  }
}
```

### 4.3 Update Procedure Step Status
**PUT** `/procedures/{id}/steps/{stepId}/status`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật trạng thái thành công"
}
```

---

## 5. MESSAGE APIs

### 5.1 Get Conversations
**GET** `/messages/conversations`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "name": "string",
      "lastMessage": "string",
      "time": "string",
      "avatar": "string",
      "unread": "number",
      "isOnline": "boolean"
    }
  ]
}
```

### 5.2 Get Conversation Messages
**GET** `/messages/conversations/{id}/messages`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "text": "string",
      "isMe": "boolean",
      "time": "string",
      "status": "string"
    }
  ]
}
```

### 5.3 Send Message
**POST** `/messages/conversations/{id}/messages`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "text": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "text": "string",
    "isMe": true,
    "time": "string",
    "status": "sent"
  }
}
```

### 5.4 Mark as Read
**PUT** `/messages/conversations/{id}/read`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Đã đánh dấu tin nhắn đã đọc"
}
```

---

## 6. CHATBOT APIs

### 6.1 Send Chatbot Message
**POST** `/chatbot/ask`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "string",
  "context": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "string",
    "suggestions": ["string"],
    "relatedProcedures": [
      {
        "id": "number",
        "title": "string"
      }
    ]
  }
}
```

---

## 7. ADMIN APIs

### 7.1 Admin Login
**POST** `/admin/auth/login`

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

### 7.2 Get Users List
**GET** `/admin/users`

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `page`: number
- `limit`: number
- `search`: string
- `department`: string
- `status`: string

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "number",
        "fullName": "string",
        "email": "string",
        "department": "string",
        "position": "string",
        "status": "string",
        "lastLogin": "string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  }
}
```

### 7.3 Get Admin Dashboard Stats
**GET** `/admin/dashboard/stats`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": "number",
    "activeProcedures": "number",
    "completedToday": "number",
    "pendingApprovals": "number"
  }
}
```

### 7.4 Get Documents
**GET** `/admin/documents`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "name": "string",
      "type": "string",
      "size": "string",
      "uploadDate": "string",
      "uploader": "string"
    }
  ]
}
```

### 7.5 Upload Document
**POST** `/admin/documents`

**Headers:** `Authorization: Bearer <admin_token>`

**Request:** multipart/form-data
- `file`: File
- `category`: string
- `description`: string

### 7.6 Get File Hierarchy
**GET** `/admin/files/hierarchy`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "folders": [
      {
        "id": "number",
        "name": "string",
        "parentId": "number",
        "files": [
          {
            "id": "number",
            "name": "string",
            "size": "string",
            "type": "string",
            "uploadDate": "string"
          }
        ]
      }
    ]
  }
}
```

### 7.7 Get Admin Conversations
**GET** `/admin/messages/conversations`

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `search`: string (tìm kiếm theo tên, tin nhắn, phòng ban)
- `department`: string (lọc theo phòng ban)
- `status`: string (online/offline)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "name": "string",
      "lastMessage": "string",
      "time": "string",
      "avatar": "string",
      "unread": "number",
      "isOnline": "boolean",
      "department": "string"
    }
  ]
}
```

### 7.8 Get Admin Conversation Messages
**GET** `/admin/messages/conversations/{id}/messages`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "text": "string",
      "isMe": "boolean",
      "time": "string",
      "status": "string"
    }
  ]
}
```

### 7.9 Send Admin Message
**POST** `/admin/messages/conversations/{id}/messages`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "text": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "text": "string",
    "isMe": true,
    "time": "string",
    "status": "sent"
  }
}
```

### 7.10 Mark Admin Conversation as Read
**PUT** `/admin/messages/conversations/{id}/read`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "message": "Đã đánh dấu tin nhắn đã đọc"
}
```

### 7.11 Get Admin Message Stats
**GET** `/admin/messages/stats`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalConversations": "number",
    "unreadMessages": "number",
    "onlineUsers": "number",
    "departments": [
      {
        "name": "string",
        "count": "number"
      }
    ]
  }
}
```

### 7.12 Get Admin Profile
**GET** `/admin/profile`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "department": "string",
    "position": "string",
    "employeeId": "string",
    "address": "string"
  }
}
```

### 7.13 Update Admin Profile
**PUT** `/admin/profile`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "fullName": "string",
  "phone": "string",
  "address": "string"
}
```

### 7.14 Get Admin Recent Activities
**GET** `/admin/activities`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "time": "string",
      "action": "string",
      "detail": "string",
      "status": "string"
    }
  ]
}
```

### 7.15 Create User
**POST** `/admin/users`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "role": "string",
  "status": "string"
}
```

### 7.16 Update User
**PUT** `/admin/users/{id}`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "role": "string",
  "status": "string"
}
```

### 7.17 Delete User
**DELETE** `/admin/users/{id}`

**Headers:** `Authorization: Bearer <admin_token>`

### 7.18 Get Procedure Categories
**GET** `/admin/procedures/categories`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "children": [
        {
          "id": "string",
          "title": "string"
        }
      ]
    }
  ]
}
```

### 7.19 Create Procedure Step
**POST** `/admin/procedures/{categoryId}/steps`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "title": "string",
  "content": ["string"],
  "documents": ["string"],
  "timeEstimate": "string",
  "expenseDetails": [
    {
      "name": "string",
      "description": "string",
      "quantity": "number",
      "note": "string"
    }
  ]
}
```

### 7.20 Update Procedure Step
**PUT** `/admin/procedures/steps/{stepId}`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "title": "string",
  "content": ["string"],
  "documents": ["string"],
  "timeEstimate": "string"
}
```

### 7.21 Delete Procedure Step
**DELETE** `/admin/procedures/steps/{stepId}`

**Headers:** `Authorization: Bearer <admin_token>`

### 7.22 Get File Categories
**GET** `/admin/files/categories`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string"
    }
  ]
}
```

### 7.23 Update File
**PUT** `/admin/files/{fileId}`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "category": "string"
}
```

### 7.24 Delete File
**DELETE** `/admin/files/{fileId}`

**Headers:** `Authorization: Bearer <admin_token>`

### 7.25 Download File
**GET** `/admin/files/{fileId}/download`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** File binary data

### 7.26 Preview File
**GET** `/admin/files/{fileId}/preview`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** File preview URL or content

---
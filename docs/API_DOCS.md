# API DOCS

## 1. Process list
**GET** `/procedures`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "subItems": [
        {
          "id": "string",
          "title": "string"
        }
      ]
    }
  ]
}
```
## 2. CHATBOT APIs

**POST** `/chatbot/ask`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "string"
  }
}
```
## 3. ProcedureDetail

**GET** `/user/procedures/detail/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "steps": [
      {
        "label": "string",
        "content": "string",
        "documents": ["string"],
        "tableData": [
          {
            "column": "string",
          }
        ],
        "tableHeaders": ["string"]
      }
    ]
  }
}
```

## 4. Search

**GET** `/user/procedures/search`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- q (string, required): Từ khóa tìm kiếm

**Response:**
```json
{
  "success": true,
  "data": ["string"]
}
```

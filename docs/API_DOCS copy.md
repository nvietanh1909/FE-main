# API DOCS

## 1. Process list

**GET** `/procedures?type={type}`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- process (bắt buộc): Mã quy trình (ví dụ: p1)
- item (tùy chọn): Mã quy trình con (ví dụ: p1c1)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "subItems": {
        "id": "string",
        "title": "string",
      }
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
## 3. ProcedureDetail

**GET** `/user/procedures/detail?`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- process (string, required): Mã quy trình, ví dụ "p1"
- item (string, required): Mã quy trình con, ví dụ "p1c1"

**Response:**
```json
{
  "success": "boolean";
  "data": {
    "process": {
      "id: string;
      title: string;
      selectedItem: {
        id: string;
        title: string;
        steps: {
          label: string;
          sublabel: string;
          content: {
            title: string;
            content: string[];
            documents: string[];
            timeEstimate: string;
            tableData: any[];
            tableHeaders: string[];
            tableType: "full" | "simple";
          };
        }[];
      };
    };
  };
}

## 4. Search

**GET** `/user/procedures/search`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- q (string, optional): Từ khóa tìm kiếm do người dùng nhập vào ô search

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
  "data": [
    "Công tác phí trong nước",
    "Mua máy tính",
    "Mua bàn ghế"
    // ... các tên thủ tục khác chứa từ khóa ...
  ]
}
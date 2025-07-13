# FE-main


## 1. Bắt đầu nhanh

### 1.1. Cài đặt dependencies
Trước tiên cài đặt node.js phiên bản mới nhất 
https://nodejs.org/en/download

Cài đặt các thư viện cần thiết:
```bash
npm install
```

### 1.2. Chạy dự án ở môi trường dev

Khởi động server dev:
```bash
npm run dev
```
### 1.3. Build production

Tạo bản build tối ưu cho production:
```bash
npm run build
```
- Kết quả sẽ nằm trong thư mục `dist/`.
```bash
serve -s dist
```
### 1.4. Preview production build

Chạy thử bản build production trên local:
```bash
npm run preview
```
## 2. Cấu trúc thư mục

```

- **Cài đặt dependencies:**
  ```bash
  npm install
  ```
- **Chạy dev server:**
  ```bash
  npm run dev
  ```
- **Build production:**
  ```bash
  npm run build
  ```
- **Preview production build:**
  ```bash
  npm run preview
  ```
- **Kiểm tra code với ESLint:**
  ```bash
  npm run lint
  ```
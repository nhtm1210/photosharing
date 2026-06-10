# ── DÒNG 1: Image gốc ──────────────────────────────────
FROM node:20-alpine
# node:20 = Node version 20
# alpine  = Linux siêu nhỏ (~5MB) → image cuối nhẹ

# ── DÒNG 2: Thư mục làm việc trong container ──────────
WORKDIR /app
# Mọi lệnh sau đều chạy trong /app

# ── DÒNG 3-4: Copy package.json TRƯỚC code ─────────────
COPY package*.json ./
RUN npm install --omit=dev
# Vì sao tách 2 bước này khỏi COPY toàn bộ?
# → Khi bạn chỉ sửa code (không sửa deps), Docker dùng
#   lại layer node_modules đã cache → build nhanh hơn.

# ── DÒNG 5: Copy toàn bộ code còn lại ─────────────────
COPY . .

# ── DÒNG 6: Mở port (chỉ mang tính khai báo) ──────────
EXPOSE 8081

# ── DÒNG 7: Lệnh chạy khi container start ─────────────
CMD ["node", "index.js"]
# Design Specification: Antigravity Vibe Coding Cookbook Website

## 1. Tổng quan Dự án (Project Context)
- **Mục tiêu:** Xây dựng một website hướng dẫn sử dụng Vibe Coding thực chiến với Antigravity IDE và CLI.
- **Đối tượng:** Developer, sinh viên, người mới bắt đầu (intern/junior) cần tài liệu tra cứu nhanh hoặc playbook thực chiến.
- **Phong cách / Định dạng:** Cookbook / Problem-Solution. Chú trọng giải thích nguyên nhân cốt lõi (Why) và cách giải quyết (How) cùng với trade-offs.

## 2. Kiến trúc Công nghệ (Architecture)
- **Core Framework:** Next.js (App Router).
- **Content Format:** MDX (Markdown kết hợp JSX).
- **Styling:** CSS Framework do người dùng tự cung cấp thiết kế (ưu tiên Vanilla CSS / CSS Modules hoặc Tailwind tuỳ theo thiết kế UI có sẵn).

### 2.1. Cấu trúc Dữ liệu (Data Source)
- Toàn bộ nội dung bài học được lưu trữ tại thư mục root `/docs`.
- Các file MDX sẽ chứa nội dung bài viết và đi kèm với YAML Frontmatter để lưu trữ siêu dữ liệu (metadata):
  - `title`: Tiêu đề bài viết.
  - `description`: Tóm tắt ngắn.
  - `date`: Ngày tạo/cập nhật.
  - `category`: Thể loại (ví dụ: `setup`, `workflow`, `debugging`).

### 2.2. Luồng Dữ liệu (Data Flow)
1. **Khởi động ứng dụng:** Next.js đọc cấu trúc thư mục `/docs` thông qua Node.js `fs`.
2. **Dynamic Routing:** Các route động dạng `app/docs/[category]/[slug]/page.tsx` sẽ nhận request từ user.
3. **Parsing:** Ứng dụng đọc file MDX tương ứng, parse YAML Frontmatter và chuyển đổi nội dung Markdown thành React Components thông qua thư viện hỗ trợ (như `next-mdx-remote` hoặc cơ chế mdx mặc định của Next).
4. **Rendering:** Next.js trả về trang HTML đã render cùng với các interactive components (nếu có).

## 3. Thành phần Giao diện (Core Components)
- **MDXProvider/Mapper:** Component cốt lõi chịu trách nhiệm map các thẻ HTML chuẩn thành Custom React Components.
  - *Ví dụ:* Thẻ `<code>` sẽ được render bằng `<CodeBlock>` hỗ trợ syntax highlighting và copy button.
- **SidebarNavigation:** Component hiển thị danh mục bài học. Tự động sinh ra dựa trên cấu trúc thư mục `/docs` hoặc một file cấu hình `sidebar.json`.
- **TableOfContents (TOC):** Component hiển thị mục lục động bên phải trang, tự động parse từ các thẻ H2, H3 trong file MDX hiện tại.
- **Callout/AlertBlock:** Component cảnh báo hoặc lưu ý (Success, Warning, Info, Error) để giải thích các Trade-offs.

## 4. Xử lý Lỗi (Error Handling)
- **404 Not Found:** Nếu user truy cập một bài học (slug) không tồn tại, Next.js sẽ catch qua file `not-found.tsx` và hiển thị trang thông báo lỗi thân thiện, kèm theo gợi ý tìm kiếm.
- **Lỗi Parse MDX:** Sử dụng Try-Catch khi parse MDX bằng Node `fs`. Nếu file có cú pháp MDX lỗi, log ra console server và fallback về một thông báo lỗi "Nội dung đang được bảo trì" cho người dùng, tránh crash toàn bộ website.

## 5. Chiến lược Kiểm thử (Testing)
- **Unit Testing:** Kiểm thử các hàm đọc file và parse cấu trúc thư mục từ `/docs`.
- **Component Testing:** Kiểm thử các MDX Components (đặc biệt là CodeBlock và Callout) để đảm bảo render đúng UI khi có data tương ứng.

## 6. Phạm vi và Ranh giới (Scope Boundaries)
- **Bao gồm:** Xây dựng khung nền tảng Next.js + MDX, cơ chế parse bài viết, routing tự động và các layout chuẩn cho Cookbook.
- **Loại trừ trong giai đoạn này:** Xây dựng hệ thống Search toàn văn bản (như Algolia) hoặc hệ thống Versioning phức tạp. Những tính năng này sẽ được thêm vào ở Phase 2 nếu cần thiết.

---
*Made by Anh Tu - Share to be share*

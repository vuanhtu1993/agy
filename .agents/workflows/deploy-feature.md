# Workflow: Deploy Feature

Quy trình chuẩn hóa để phát triển và hoàn thiện một tính năng (feature) mới trong khóa học.

## Bước 1: Khám Phá (Exploration)
- Đọc yêu cầu của người dùng.
- Sử dụng công cụ `grep_search` hoặc `view_file` để tìm kiếm các component/hàm liên quan trong dự án.
- Tóm tắt lại ngữ cảnh cho người dùng xác nhận.

## Bước 2: Lập Kế Hoạch (Planning)
- Đề xuất kiến trúc thay đổi.
- Vẽ Mermaid sequence diagram hoặc flowchart nếu luồng dữ liệu phức tạp.
- Dừng lại chờ người dùng (giảng viên/sinh viên) duyệt kế hoạch.

## Bước 3: Thực Thi (Execution)
- Áp dụng các thay đổi bằng `write_to_file` hoặc `replace_file_content`.
- Giữ nguyên các comment giải thích Why.

## Bước 4: Kiểm Thử (Testing - Subagent Delegation)
- Khởi chạy một Sub-agent (sử dụng lệnh `/invoke_subagent` hoặc tool tương ứng) với vai trò "Tester".
- Giao cho Sub-agent nhiệm vụ: Đọc file code vừa tạo, viết Unit Test cho nó, và chạy lệnh test nội bộ.
- Agent chính sẽ đợi Sub-agent báo cáo kết quả.

## Bước 5: Hoàn Thành
- Báo cáo tóm tắt công việc đã làm.
- Cập nhật tài liệu nếu có thay đổi.
- Chèn chữ ký: "Made by Anh Tu - Share to be share".

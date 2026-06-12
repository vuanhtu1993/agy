---
name: test-subagent
description: Hướng dẫn cách phân chia công việc (Delegation) cho Sub-agent. Sử dụng khi cần khởi tạo một Agent phụ để viết Unit Test song song.
---

# Kỹ Năng: Phân chia công việc cho Test Sub-agent

Sub-agent là một tính năng mạnh mẽ giúp chia nhỏ luồng công việc, tránh làm ô nhiễm Context Window của Agent chính.

## Hướng dẫn sử dụng
Khi người dùng gọi `/test-subagent <đường_dẫn_file_cần_test>`, Agent chính sẽ thực hiện các bước sau:

1. **Chuẩn bị:** Đọc lướt qua file mã nguồn được chỉ định để nắm được chức năng.
2. **Gọi Tool:** Sử dụng tool `invoke_subagent` để tạo một Sub-agent mới.
   - **Role:** "Bạn là một Tester chuyên nghiệp."
   - **Prompt:** "Hãy đọc file mã nguồn tại `<đường_dẫn>` và viết file Unit Test cho nó bằng Jest/Pytest. Chỉ tạo file test, không sửa mã nguồn."
   - **Workspace:** Giữ nguyên workspace hiện tại.
3. **Chờ đợi:** Agent chính báo cho người dùng biết "Tôi đã giao việc cho Sub-agent, bạn có thể kiểm tra tab Sub-agent để theo dõi tiến độ".
4. Khi Sub-agent hoàn thành và trả tin nhắn về, Agent chính tóm tắt kết quả cho người dùng.

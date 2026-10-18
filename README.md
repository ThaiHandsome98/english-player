# English Shadowing Player (A-B Repeat Web App)

Ứng dụng web học tiếng Anh chuyên sâu bằng phương pháp **Shadowing** và **A-B Repeat**, được xây dựng với **Next.js (App Router)**, **ReactJS**, và **Tailwind CSS**. Ứng dụng chạy 100% ở phía client, không yêu cầu server, sẵn sàng deploy miễn phí lên Vercel.

---

## Các tính năng nổi bật

1. **Quản lý Playlist bài nghe:**
   - Tải lên (upload) một hoặc nhiều file âm thanh (`.mp3`, `.m4a`, `.wav`, `.aac`, `.ogg`) trực tiếp từ máy tính/điện thoại qua `URL.createObjectURL`.
   - Hỗ trợ kéo & thả (Drag and drop).
   - Nút **"Tải bài mẫu" (Sample Lesson)** tạo file WAV mẫu trực tiếp trên trình duyệt bằng Web Audio API để bạn có thể trải nghiệm ngay mà không cần chuẩn bị sẵn file MP3.
   - Tự động dọn dẹp bộ nhớ với `URL.revokeObjectURL` khi xóa bài hoặc làm trống playlist.

2. **Trình phát âm thanh chuyên nghiệp:**
   - Play / Pause nút to rõ, dễ thao tác trên màn hình cảm ứng iPhone/Android.
   - Tua nhanh / lùi lại `±5 giây`.
   - Điều chỉnh tốc độ phát: `0.5x`, `0.75x`, `0.9x`, `1.0x`, `1.25x`, `1.5x`, `1.75x`, `2.0x`.
   - Thanh tiến trình (Seekbar) trực quan, hiển thị thời gian hiện tại / tổng thời lượng, hỗ trợ kéo rê mượt mà.

3. **Chế độ Lặp đoạn A-B Repeat (Cốt lõi cho luyện nghe & Shadowing):**
   - **Đặt mốc A:** Lấy mốc thời gian hiện tại làm điểm bắt đầu câu.
   - **Đặt mốc B:** Lấy mốc thời gian hiện tại làm điểm kết thúc câu.
   - **Đánh dấu trực quan:** Hiển thị vạch ghim A, vạch ghim B và dải màu nổi bật ngay trên thanh Seekbar.
   - **Tự động lặp lại:** Khi phát đến điểm B, audio lập tức tua ngược về điểm A và tiếp tục phát.
   - **Tinh chỉnh vi lượng (Micro-adjustments):** Nút `±0.5s` cho cả điểm A và B giúp căn chỉnh chính xác từng âm tiết, nối âm, nuốt âm.
   - **Tua về A / Tua tới B:** Nhảy nhanh đến đầu hoặc cuối đoạn lặp.
   - **Bộ đếm số lần lặp:** Đếm số lần bạn đã nghe lại đoạn câu.
   - **Lưu câu quan trọng (Bookmark):** Lưu các mốc câu kèm ghi chú để nghe lại bất cứ lúc nào.

4. **Hỗ trợ chạy nền màn hình khóa (Background Audio & Media Session API):**
   - Tích hợp chuẩn `navigator.mediaSession`.
   - Khi khóa màn hình điện thoại hoặc chuyển sang ứng dụng khác, âm thanh vẫn phát bình thường.
   - Hiển thị tên bài học, ảnh đại diện và thanh điều khiển Play/Pause/Tua trên màn hình khóa của iPhone (iOS) và Android.

5. **Phím tắt bàn phím (Desktop / Laptop):**
   - `Space`: Phát / Tạm dừng
   - `←` / `→`: Tua -5s / +5s
   - `A`: Đặt mốc A
   - `B`: Đặt mốc B
   - `L`: Bật / Tắt Lặp A-B
   - `R`: Xóa mốc A-B
   - `[` / `]`: Nhảy về A / Nhảy tới B
   - `↑` / `↓`: Tăng / Giảm âm lượng

---

## Hướng dẫn cài đặt & Chạy trên máy cá nhân

### Yêu cầu:
- Node.js version `>= 18.18.0` (Khuyến nghị Node.js 20 LTS hoặc 22)

### Các bước:
```bash
# 1. Cài đặt các thư viện cần thiết
npm install

# 2. Chạy môi trường phát triển
npm run dev
```

Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

---

## Hướng dẫn Deploy miễn phí lên Vercel

Ứng dụng được thiết kế hoàn toàn tĩnh ở phía client (Static / Jamstack), cực kỳ tối ưu và tương thích 100% với Vercel:

1. Đẩy mã nguồn lên tài khoản **GitHub** của bạn (hoặc GitLab / Bitbucket).
2. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
3. Nhấn **"Add New..."** -> chọn **"Project"**.
4. Chọn repository chứa dự án này.
5. Vercel sẽ tự động nhận diện framework là **Next.js**. Giữ nguyên mọi cài đặt mặc định và nhấn **"Deploy"**.
6. Sau khoảng 1 phút, bạn sẽ nhận được đường link website miễn phí dạng `https://ten-du-an.vercel.app` để học tiếng Anh trên điện thoại và máy tính mọi lúc mọi nơi!

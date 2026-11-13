// 1. BIẾN: ô chứa dữ liệu
let ngansach = 100;
let khoiLuong = 0;

// 2. HÀM: một nhóm lệnh có tên, gọi khi cần
function chonDongCo() {
  mua(30, 500);
}

function chonCamBien() {
  mua(20, 100);
}

function mua(gia, kg) {
  // 3. IF/ELSE: rẽ nhánh
  if (ngansach >= gia) {
    ngansach = ngansach - gia;
    khoiLuong = khoiLuong + kg;
    capNhatGiaoDien();
    document.getElementById("thongbao").textContent = "Đã mua!";
  } else {
    document.getElementById("thongbao").textContent = "Không đủ tiền!";
  }
}

// 4. DOM: cách JS sửa nội dung trên trang
function capNhatGiaoDien() {
  document.getElementById("budget").textContent = ngansach;
  document.getElementById("mass").textContent = khoiLuong;
}

//Mảng và đối tượng
const linhKien = [
  { ten: "Động cơ", gia: 30, kg: 500 },
  { ten: "Cảm biến", gia: 20, kg: 100 },
];

// Vòng lặp: làm việc cho từng phần tử
for (const lk of linhKien) {
  console.log(lk.ten + " giá " + lk.gia);
}
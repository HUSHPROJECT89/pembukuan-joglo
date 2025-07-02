// Data menu & pendapatan disimpan di localStorage
let menuList = JSON.parse(localStorage.getItem("menuList")) || [];
let pendapatanList = JSON.parse(localStorage.getItem("pendapatanList")) || [];
let keranjangBelanja = [];

function simpanData() {
  localStorage.setItem("menuList", JSON.stringify(menuList));
  localStorage.setItem("pendapatanList", JSON.stringify(pendapatanList));
}

// --------------------- MENU ---------------------

function tambahMenu() {
  const nama = document.getElementById("namaMenu").value;
  const harga = parseInt(document.getElementById("hargaMenu").value);
  if (!nama || isNaN(harga)) return alert("Isi nama dan harga dengan benar!");

  menuList.push({ nama, harga });
  simpanData();
  tampilkanDaftarMenu();
  updateMenuDropdown();

  document.getElementById("namaMenu").value = "";
  document.getElementById("hargaMenu").value = "";
}

function tampilkanDaftarMenu() {
  const tbody = document.getElementById("daftarMenu");
  if (!tbody) return;
  tbody.innerHTML = '';
  menuList.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.nama}</td>
      <td>Rp ${item.harga}</td>
      <td><button onclick="hapusMenu(${index})">Hapus</button></td>
    `;
    tbody.appendChild(row);
  });
}

function hapusMenu(index) {
  if (confirm("Yakin ingin menghapus menu ini?")) {
    menuList.splice(index, 1);
    simpanData();
    tampilkanDaftarMenu();
    updateMenuDropdown();
  }
}

function updateMenuDropdown() {
  const select = document.getElementById("menuSelect");
  if (!select) return;
  select.innerHTML = "";
  menuList.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${item.nama} - Rp${item.harga}`;
    select.appendChild(option);
  });
}

// --------------------- PEMBAYARAN ---------------------

function tambahkanKePembayaran() {
  const index = document.getElementById("menuSelect").value;
  const jumlah = parseInt(document.getElementById("jumlah").value);
  if (index === "" || isNaN(jumlah) || jumlah < 1) return;

  const item = menuList[index];
  const subtotal = item.harga * jumlah;

  keranjangBelanja.push({ nama: item.nama, jumlah, subtotal });
  tampilkanBelanja();
}

function tampilkanBelanja() {
  const tbody = document.getElementById("daftarBelanja");
  if (!tbody) return;
  tbody.innerHTML = '';
  let total = 0;

  keranjangBelanja.forEach(p => {
    total += p.subtotal;
    const row = document.createElement("tr");
    row.innerHTML = `<td>${p.nama}</td><td>${p.jumlah}</td><td>Rp ${p.subtotal}</td>`;
    tbody.appendChild(row);
  });

  document.getElementById("total").textContent = total;
}

function prosesBayar() {
  const bayar = parseInt(document.getElementById("bayar").value);
  const total = keranjangBelanja.reduce((sum, item) => sum + item.subtotal, 0);
  if (isNaN(bayar)) return;

  const hasil = document.getElementById("hasilBayar");
  if (bayar < total) {
    hasil.textContent = "Alert! Uang tidak mencukupi!";
    document.getElementById("selesaiBtn")?.style.setProperty("display", "none");
  } else {
    const kembalian = bayar - total;
    hasil.textContent = `Kembalian: Rp ${kembalian}`;
    window.transaksiSementara = [...keranjangBelanja];
    document.getElementById("selesaiBtn")?.style.setProperty("display", "block");
  }
}

function selesaikanPembayaran() {
  if (window.transaksiSementara && window.transaksiSementara.length > 0) {
    window.transaksiSementara.forEach(item => {
      pendapatanList.push({ menu: item.nama, jumlah: item.jumlah, total: item.subtotal });
    });
    simpanData();
    alert("Pembayaran disimpan!");
    location.reload(); // Reset halaman
  }
}

// --------------------- PENDAPATAN ---------------------

function tampilkanPendapatan() {
  const tbody = document.getElementById("tabelPendapatan");
  if (!tbody) return;
  tbody.innerHTML = "";
  pendapatanList.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${p.menu}</td><td>${p.jumlah}</td><td>Rp ${p.total}</td>`;
    tbody.appendChild(row);
  });
}

// --------------------- INISIALISASI ---------------------

window.addEventListener("DOMContentLoaded", () => {
  tampilkanDaftarMenu();
  updateMenuDropdown();
  tampilkanPendapatan();
});

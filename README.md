# Download C1

## Table of Contents

1. [Overview](#overview)
2. [Opportunities](#opportunities)
3. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
4. [Next Steps](#next-steps)
5. [Contributing](#contributing)

## Overview

Project ini bertujuan untuk mengarsipkan dan menyalin Data Gambar C1 yang ada, apabila suatu waktu URL KPU tidak bisa diakses atau ada perubahan yang tidak diharapkan. Semua orang bisa mudah memiliki arsipnya sendiri-sendiri terdistribusi lokal.

## Opportunities

Adanya Data Gambar C1 ini bisa digunakan sebagai data pembanding untuk diolah lagi dengan verifikasi manual atau diperiksa ulang di sistem lain. Sedangkan untuk rekap dan scraper data angka dll-nya sendiri tersedia, seperti:
- [Zakiego](https://x.com/zakiego/status/1757929590562103499?s=20)
- [Andi Pangeran](https://x.com/A_Pangeran/status/1758022607721660754?s=20)

## Getting Started

Sebagai awalan, sementara ini file yang penting ada di modul `BatchDownloadTpsC1` logic utama projectnya. Idenya mengambil list TPS yang belum di-download dari modul `GetIncompleteTps` lalu diunduh ke lokal dan disimpan di Google Drive apabila diperlukan

### Prerequisites

Beberapa hal yang perlu diperhatikan
- memastikan ada `result.db` sebagai database sqlite lokal mapping tps dan bisa diakses untuk melihat kondisi data terakhir
- memastikan ada folder `image-c1` untuk menampung gambar unduhan
- (opsional) apabila ingin disimpan di Google Drive dapat memanfaatkan GDrive API dengan otentikasi `service-account.json` credential ditaruh di root repo, serta sebuah GDrive folder yang diberi hak akses

### Installation

1. Pastikan sudah melengkapi `Prerequisites`
2. Copy `.env.example` ke `.env` dan sesuaikan dengan informasi yang dimiliki
   (opsional) Apabila akan memakai GDrive, isi Folder ID dari pola URL `https://drive.google.com/drive/u/0/folders/{folder_id}` saat membuka folder
3. Melakukan instalasi
   ```sh
   npm install
   or
   yarn
4. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
5. Sesuaikan di `main.js`
   Apabila ingin menjalankan secara sekali jalan, pilih `count` sekali batch, atau menjalankan secara kontinyu dengan `node-cron`
6. Menjalankan aplikasi
   ```sh
      node main.js
      or
      node -e 'require("./src/runners/BatchDownloadTpsC1")(100)'

## Next Steps

Project ini belum beres semuanya, diantaranya hal yang sudah terpikirkan

- [ ] Batch continue tanpa berhenti menelusuri semua TPS null dengan backoff delay

- [ ] Melakukan selektif fetch/batch dengan membaca KawalPemilu data TPS yang masih kosong untuk ditarik data C1-nya apabila sudah ada (berdasarkan kode area wilayah tps)

## Contributing

Kontak [@harippe](https://twitter.com/harippe) atau [@ans4175](https://twitter.com/ans4175)
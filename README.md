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

- Jalankan `tar -xzf result.db.tar.gz` untuk extract data
- memastikan sudah ada `result.db` dari ekstrak `result.db.tar.gz` sebagai database sqlite lokal mapping tps dan bisa diakses untuk melihat kondisi data terakhir
- memastikan ada folder `image-c1` untuk menampung gambar unduhan
- (opsional) apabila ingin disimpan di Google Drive dapat memanfaatkan GDrive API dengan otentikasi `./service-account.json` credential ditaruh di root folder repo, serta sebuah GDrive folder sudah yang diberi hak akses untuk email credential key-nya

### Installation

1. Pastikan sudah melengkapi `Prerequisites`
2. Copy `.env.example` ke `.env` dan sesuaikan dengan informasi yang dimiliki
   (opsional) Apabila akan memakai GDrive, isi Folder ID dari pola URL `https://drive.google.com/drive/u/0/folders/{folder_id}` saat membuka folder
3. Melakukan instalasi
   ```sh
   npm install
   or
   yarn
   ```
4. Sesuaikan di `main.js`
   Apabila ingin menjalankan secara sekali jalan, pilih `count` sekali batch, atau menjalankan secara kontinyu dengan `node-cron`
5. Menjalankan aplikasi

   ```sh
   node main.js [--iterative] [--province-code string] [--kota-kabupaten-code string]
   ```

   Masing-masing flag memiliki fungsi seperti ini

   ```
   Options:
   --iterative                      Perform scraping from start to finish using pagination by incomplete tps.
                                    If not specified, the program will perform a singular batched download
                                    then exit
   --province-code [string]         Province code to scrape, if any
   --kota-kabupaten-code [string]   Kota kabupated code to scrape, if any
   -h, --help                       display help for command
   ```

   or

   ```
   node -e 'require("./src/runners/BatchDownloadTpsC1")(100)'
   ```

6. Mengecek data gambar yang sudah diunduh di `image-c1` atau di folder GDrive
7. Melakukan reset data apabila dibutuhkan
   ```sh
      node -e 'require("./src/runners/ResetTpsDownload")()'
   ```

## Next Steps

Project ini belum beres semuanya, diantaranya hal yang sudah terpikirkan

- [ ] Batch continue tanpa berhenti menelusuri semua TPS null dengan backoff delay

- [x] Reset tanda sudah di-download untuk semua atau kode tertentu

- [x] Melakukan selektif fetch/batch berdasar kode Provinsi dan Kota

- [ ] Melakukan selektif fetch/batch dengan membaca Data TPS KawalPemilu yang masih kosong untuk ditarik data C1-nya apabila sudah ada (berdasarkan kode area wilayah tps)

## Contributing

Kontak [@harippe](https://twitter.com/harippe) atau [@ans4175](https://twitter.com/ans4175)

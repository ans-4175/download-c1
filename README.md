# download-c1

Download C1 dari KPU untuk dikumpulkan dan dipetakan

## Tasks

1. downloader image c1 halaman 2 per tps [done]

   a. format file id1_id2_id3_id4_idtps.json - resumable berdasarkan state sqlite [-]

2. mapping tps vs c1 nya uda ada apa blm

   a. make sqlite [done]

3. nyiapin kode wilayah hasil pemekaran [done]

   a. papua [not done]

4. upload to gdrive [done]

## Sqlite table

    - provinsi
    - kota/kabupaten
    - kecamatan
    - kode wilayah kelurahan
    - kode wilayan tps
    - foto c1 uri (nullable)
    - created_at (date)
    - last_updated (date, nullable)

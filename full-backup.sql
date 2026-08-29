--
-- PostgreSQL database dump
--

\restrict nhLNFImzOe8ehya0RcQyyC9dwijdoThIEoNrysUgprHBZPXZaAnLdMYyu1McLVz

-- Dumped from database version 17.11 (32e7196)
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Bagian; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public."Bagian" DISABLE TRIGGER ALL;

INSERT INTO public."Bagian" (id, nama, slug, deskripsi, konten, urutan, "createdAt", "updatedAt") VALUES ('cmoa7krte000cihuzb6q0h1s2', 'Bagian Reformasi Birokrasi dan Akuntabilitas Kinerja', 'REFORMASI_BIROKRASI_AKUNTABILITAS', 'Melaksanakan penyiapan bahan perumusan kebijakan di bidang reformasi birokrasi dan akuntabilitas kinerja.', '<p>Bagian Reformasi Birokrasi dan Akuntabilitas Kinerja mempunyai tugas melaksanakan penyiapan bahan perumusan kebijakan daerah, mengoordinasikan perumusan kebijakan daerah, mengoordinasikan pelaksanaan tugas Perangkat Daerah, dan melaksanakan pemantauan dan evaluasi pelaksanaan kebijakan daerah di bidang reformasi birokrasi, akuntabilitas kinerja dan budaya kerja.</p>', 3, '2026-04-22 15:29:34.419', '2026-06-15 06:59:56.601');
INSERT INTO public."Bagian" (id, nama, slug, deskripsi, konten, urutan, "createdAt", "updatedAt") VALUES ('cmoa7kt5t000dihuzrbt3huuf', 'Bagian Tata Laksana', 'TATA_LAKSANA', 'Melaksanakan penyiapan bahan perumusan kebijakan di bidang tata laksana pemerintahan.', '<p>Bagian Tata Laksana mempunyai tugas melaksanakan penyiapan bahan perumusan kebijakan daerah, mengoordinasikan perumusan kebijakan daerah, mengoordinasikan pelaksanaan tugas Perangkat Daerah, dan melaksanakan pemantauan dan evaluasi pelaksanaan kebijakan daerah di bidang tata usaha, tata laksana pemerintahan dan pelayanan publik.</p>', 2, '2026-04-22 15:29:36.162', '2026-06-15 07:00:02.049');
INSERT INTO public."Bagian" (id, nama, slug, deskripsi, konten, urutan, "createdAt", "updatedAt") VALUES ('cmoa7kphn000bihuzu15ggpbj', 'Bagian Kelembagaan dan Analisis Jabatan', 'KELEMBAGAAN_ANALISIS_JABATAN', 'Melaksanakan penyiapan bahan perumusan kebijakan, koordinasi dan fasilitasi di bidang kelembagaan dan analisis jabatan.', '<p>Bagian Kelembagaan dan Analisis Jabatan mempunyai tugas melaksanakan penyiapan bahan perumusan kebijakan daerah, mengoordinasikan perumusan kebijakan daerah, mengoordinasikan pelaksanaan tugas Perangkat Daerah, dan melaksanakan pemantauan dan evaluasi pelaksanaan kebijakan daerah di bidang kelembagaan Provinsi, kelembagaan Kabupaten/Kota dan analisis jabatan.</p>', 1, '2026-04-22 15:29:31.404', '2026-06-15 07:00:23.911');


ALTER TABLE public."Bagian" ENABLE TRIGGER ALL;

--
-- Data for Name: Berita; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."Berita" DISABLE TRIGGER ALL;

INSERT INTO public."Berita" (id, judul, slug, konten, ringkasan, gambar, kategori, tags, penulis, views, publish, "publishAt", "createdAt", "updatedAt", video) VALUES ('cmoaxpyax00006mxd7wy193xo', 'Pemprov NTT Selenggarakan Lokakarya Cascading 2026: Upaya Perbaiki Perencanaan dan Tingkatkan Nilai SAKIP', 'pemprov-ntt-selenggarakan-lokakarya-cascading-2026-upaya-perbaiki-perencanaan-dan-tingkatkan-nilai-sakip', 'Kupang, 8 April 2026 - Biro Organisasi Sekretariat Daerah Provinsi NTT menyelenggarakan Lokakarya Teknis Implementasi Cascading Lingkup Pemerintah Provinsi NTT. Kegiatan ini dijadwalkan berlangsung selama 3 (tiga) hari pada tanggal 8 - 10 April 2026 di Hotel Aston dengan menghadirkan Narasumber dari Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (KemenPAN RB),  Kementerian Dalam Negeri (Kemendagri), dan Akademisi Universitas Gadjah Mada.  

Kegiatan ini diikuti oleh 151 orang peserta, terdiri dari pimpinan Perangkat Daerah sebanyakn35 orang, perwakilan 42 Perangkat Daerah  sebanyak 84 orang, tim SAKIP Pemerintah Provinsi NTT sebanyak 25 orang, dan panitia kegiatan sebanyak 7 orang.

Dalam arahan awal, Kepala Biro Organisasi Sekretariat Daerah Provinsi NTT, Bapak Adelino Da Cruz Soares, AKS, MPS.Sp menyampaikan bahwa kegiatan ini sangat penting dalam upaya untuk memperkuat tata kelola pemerintah yang efektif, efisien dan berorientasi pada pembangunan, dan hal yang lebih penting adalah kerja kita harus berdampak pada masyarakat.

Hari pertama kegiatan ini diawali dengan penyampaian materi tentang "Hasil Evaluasi SAKIP Provinsi NTT Tahun 2025", disampaikan oleh Narasumber dari KemenPAN RB, Bapak Muhammad Haris Hananto, S.Ak . Penyampaian materi ini bertujuan untuk peningkatan kualitas implementasi SAKIP di Pemprov NTT yang dimulai dari perbaikan kualitas komponen Perencanaan Kinerja sesuai rekomendasi oleh KemenPAN RB dalam laporan hasil evaluasi.

Selanjutnya, fokus beralih pada keserasian antara RPJMN dengan RPJMD Provinsi NTT melalui penyampaian materi kedua  tentang "Arah Kebijakan Pembangunan Nasional", disampaikan oleh Narasumber dari Direktorat Perencanaan, Evaluasi dan Informasi Pembangunan Daerah Dirjen Bina Pembangunan Daerah, Bapak Hanz Budi Setiawan Dandel, S.E., M.AP. Poin penting pada materi ini membahas tentang proses evaluasi dan penyesuaian dokumen perencanaan daerah di Provinsi Nusa Tenggara Timur guna menyelaraskan kebijakan terkini. Para pemangku kepentingan ditekankan untuk melakukan revisi pada Rencana Strategis (Renstra) dan Rencana Kerja (Renja) akibat adanya pemutakhiran nomenklatur kegiatan di tingkat nasional. 

Acara kemudian dilanjutkan dengan pembukaan secara resmi oleh Gubernur Nusa Tenggara Timur, Bapak Emanuel Melkiades Laka Lena dengan harapan melalui kegiatan ini dapat menghasilkan indikator kinerja yang SMART (Specific, Measurable, Achievable, Eelevant, and Time-bound).

Pada siang hari, Prof. Dr. Phil Gabriel Lele, S.IP., M.Si, akademisi Universitas Gadjah Mada, meyampaikan materi ketiga tentang "Peran Pimpinan Perangkat Daerah Dalam Manajemen SAKIP" diikuti dengan sesi diskusi dan pemaparan materi tentang "Arah dan Kebijakan Pembangunan Provinsi NTT Tahun 2025-2029 yang disampaikan oleh Plh. Sekretaris Daerah Provinsi NTT, ibu Dra. Flouri Rita Wuisan, M.M sekaligus sebagai persiapan bagi peserta masuk dalam kegiatan penyusunan Indikator Kinerja Utama (IKU) Kepala Daerah dan IKU Perangkat Daerah yang akan dilaksanakan pada hari kedua kegiatan Lokakarya Teknis Implementasi Cascading Lingkup Pemerintah Provinsi NTT Kamis, 9 April 2026.

Di akhir kegiatan, Kepala Biro Organisasi menyampaikan bahwa setiap pimpinan Perangkat Daerah harus meninggalkan legasi yg baik. Untuk itu dibutuhkan kepemimpinan, kolaborasi dan kepemimpinan transformasi. Maka langkah yang harus dilakukan oleh para pemimpin Perangkat Daerah adalah melakukan tata kembali postur perencanaan kita, agar dapat menjawab sasaran yg telah ditetapkan dan  tidak meninggalkan masalah baru. Kondisi ini menuntut komitmen dan konsistensi dari semua pimpinan Perangkat Daerah. Pada hari kedua kegiatan ini semua peserta wajib membawa dokumen perencanaan untuk dicek dan diselaraskan kembali.', 'Biro Organisasi Sekretariat Daerah Provinsi NTT menyelenggarakan Lokakarya Teknis Implementasi Cascading Lingkup Pemerintah Provinsi NTT', 'https://eewfle4621.ufs.sh/f/56giZDx18deKlnCtU6V5dX6PhFNBqknMViOUeA0s7RQ94DCv', 'Berita', '{}', 'Admin', 23, true, NULL, '2026-04-23 03:41:26.12', '2026-08-22 02:46:04.244', NULL);


ALTER TABLE public."Berita" ENABLE TRIGGER ALL;

--
-- Data for Name: DaftarAplikasi; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."DaftarAplikasi" DISABLE TRIGGER ALL;

INSERT INTO public."DaftarAplikasi" (id, nama, deskripsi, href, kategori, logo, urutan, aktif, "createdAt", "updatedAt") VALUES ('cmpgdpr0k0000d7bxyunf0d4t', 'SIMBAGA', 'Aplikasi Layanan Administrasi dan Konsultasi Kelembagaan', 'https://simbagabiroorganisasi.nttprov.go.id/login', 'Sistem Informasi Kelembagaan', 'https://eewfle4621.ufs.sh/f/56giZDx18deKL45u42agxMu93UjyG5aTC7Rzb0KEZ4iXktvf', 2, true, '2026-05-22 03:47:43.746', '2026-08-18 03:27:42.13');
INSERT INTO public."DaftarAplikasi" (id, nama, deskripsi, href, kategori, logo, urutan, aktif, "createdAt", "updatedAt") VALUES ('cmouvj354000088og9zyto3pa', 'G-SINJAB', 'APLIKASI SINJAB', 'http://nusatenggaratimurprov3.5.sinjab.info/', 'Sistem Informasi Anjab ABK', 'https://eewfle4621.ufs.sh/f/56giZDx18deKNOpGGpWie3jRyBf0pnQtC17Zoxa2SX8wmAVF', 1, true, '2026-05-07 02:35:30.087', '2026-08-18 07:01:28.455');


ALTER TABLE public."DaftarAplikasi" ENABLE TRIGGER ALL;

--
-- Data for Name: DasbordGrafik; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."DasbordGrafik" DISABLE TRIGGER ALL;



ALTER TABLE public."DasbordGrafik" ENABLE TRIGGER ALL;

--
-- Data for Name: DokumenPPID; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."DokumenPPID" DISABLE TRIGGER ALL;

INSERT INTO public."DokumenPPID" (id, judul, deskripsi, file, kategori, tahun, aktif, "createdAt", "updatedAt") VALUES ('cmocuk48l0000i8lxaxz29d5k', 'Safety Briefing pada Kantor Gubernur Provinsi NTT', NULL, '', 'PROSEDUR_BENCANA', NULL, true, '2026-04-24 11:48:27.381', '2026-04-24 11:53:52.556');


ALTER TABLE public."DokumenPPID" ENABLE TRIGGER ALL;

--
-- Data for Name: DokumenSAKIP; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."DokumenSAKIP" DISABLE TRIGGER ALL;



ALTER TABLE public."DokumenSAKIP" ENABLE TRIGGER ALL;

--
-- Data for Name: Galeri; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."Galeri" DISABLE TRIGGER ALL;

INSERT INTO public."Galeri" (id, judul, deskripsi, tipe, url, thumbnail, tags, urutan, aktif, "createdAt", "updatedAt") VALUES ('cmob5rysz0000xbl4yycdr5fj', 'Kaka', 'Bangun NTT jaya', 'FOTO', 'https://eewfle4621.ufs.sh/f/56giZDx18deKIiCw8PUsrbNJWLQSOf0ac4CVEhGq57BADeu1', NULL, '{#ntt}', 1, true, '2026-04-23 07:26:57.01', '2026-04-23 07:26:57.01');


ALTER TABLE public."Galeri" ENABLE TRIGGER ALL;

--
-- Data for Name: InformasiKontak; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."InformasiKontak" DISABLE TRIGGER ALL;

INSERT INTO public."InformasiKontak" (id, nama, nilai, ikon, tipe, urutan, "createdAt", "updatedAt") VALUES ('cmoa7kwih000iihuzxv26agmk', 'Alamat', 'Jl. El Tari No. 1, Kupang, Nusa Tenggara Timur 85111', 'MapPin', 'alamat', 1, '2026-04-22 15:29:40.505', '2026-05-08 00:49:41.73');
INSERT INTO public."InformasiKontak" (id, nama, nilai, ikon, tipe, urutan, "createdAt", "updatedAt") VALUES ('cmoa7kxd8000kihuzozqyvkyq', 'Email', 'biroorganisasi@nttprov.go.id', 'Mail', 'email', 3, '2026-04-22 15:29:41.613', '2026-05-08 00:49:41.739');
INSERT INTO public."InformasiKontak" (id, nama, nilai, ikon, tipe, urutan, "createdAt", "updatedAt") VALUES ('cmoa7kxnb000lihuzqcsksr4h', 'Jam Kerja', 'Sen-Kam: 08.00-16.00 (ist. 12.00-13.00)   |   Jum: 08.00-16.30 (ist. 11.30-13.30) WITA', 'Clock', 'jam_kerja', 4, '2026-04-22 15:29:41.976', '2026-05-08 00:49:42.026');
INSERT INTO public."InformasiKontak" (id, nama, nilai, ikon, tipe, urutan, "createdAt", "updatedAt") VALUES ('cmoa7kx2v000jihuzg3pn7o6w', 'Telepon', '(0380) 831021', 'Phone', 'telepon', 2, '2026-04-22 15:29:41.24', '2026-05-08 00:49:42.055');


ALTER TABLE public."InformasiKontak" ENABLE TRIGGER ALL;

--
-- Data for Name: InformasiSertaMerta; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."InformasiSertaMerta" DISABLE TRIGGER ALL;

INSERT INTO public."InformasiSertaMerta" (id, judul, deskripsi, file, gambar, tipe, "urlSosmed", aktif, urutan, "createdAt", "updatedAt") VALUES ('cmsy11rbf0000ezbgff82ef1j', 'BIRO JAYA', NULL, NULL, 'https://eewfle4621.ufs.sh/f/56giZDx18deKSRWyJNkpCT2Mo7GLKXIZy8B41sYzgvj6DN3l', 'GAMBAR', 'https://www.youtube.com/@biroorganisasisetdaprovins9861', true, 1, '2026-08-18 02:12:07.177', '2026-08-18 02:12:07.177');


ALTER TABLE public."InformasiSertaMerta" ENABLE TRIGGER ALL;

--
-- Data for Name: Kegiatan; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."Kegiatan" DISABLE TRIGGER ALL;



ALTER TABLE public."Kegiatan" ENABLE TRIGGER ALL;

--
-- Data for Name: Kontak; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."Kontak" DISABLE TRIGGER ALL;



ALTER TABLE public."Kontak" ENABLE TRIGGER ALL;

--
-- Data for Name: MaklumatPelayanan; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."MaklumatPelayanan" DISABLE TRIGGER ALL;

INSERT INTO public."MaklumatPelayanan" (id, konten, gambar, aktif, "createdAt", "updatedAt") VALUES ('cmocu95gh0000f2n5xex9x2e5', 'Transformasi Pelayanan Publik Menjadi Lebih Transparan, Efisien, Profesional, Proaktif dan Melayani', 'https://eewfle4621.ufs.sh/f/56giZDx18deKTfmLRZsBm6Dp2JILrZ1S7E5Al0WejvdRokGb', true, '2026-04-24 11:39:55.745', '2026-04-24 11:39:55.745');


ALTER TABLE public."MaklumatPelayanan" ENABLE TRIGGER ALL;

--
-- Data for Name: NilaiSKM; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."NilaiSKM" DISABLE TRIGGER ALL;



ALTER TABLE public."NilaiSKM" ENABLE TRIGGER ALL;

--
-- Data for Name: PakaianDinas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."PakaianDinas" DISABLE TRIGGER ALL;



ALTER TABLE public."PakaianDinas" ENABLE TRIGGER ALL;

--
-- Data for Name: PedomanZonaIntegritas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."PedomanZonaIntegritas" DISABLE TRIGGER ALL;



ALTER TABLE public."PedomanZonaIntegritas" ENABLE TRIGGER ALL;

--
-- Data for Name: Pengaduan; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."Pengaduan" DISABLE TRIGGER ALL;



ALTER TABLE public."Pengaduan" ENABLE TRIGGER ALL;

--
-- Data for Name: PenyederhanaanBirokrasi; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."PenyederhanaanBirokrasi" DISABLE TRIGGER ALL;



ALTER TABLE public."PenyederhanaanBirokrasi" ENABLE TRIGGER ALL;

--
-- Data for Name: Peraturan; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."Peraturan" DISABLE TRIGGER ALL;



ALTER TABLE public."Peraturan" ENABLE TRIGGER ALL;

--
-- Data for Name: PermintaanDataTPPASN; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."PermintaanDataTPPASN" DISABLE TRIGGER ALL;



ALTER TABLE public."PermintaanDataTPPASN" ENABLE TRIGGER ALL;

--
-- Data for Name: PermohonanInformasi; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."PermohonanInformasi" DISABLE TRIGGER ALL;

INSERT INTO public."PermohonanInformasi" (id, "namaPemohon", nik, alamat, telepon, email, pekerjaan, "informasiDiminta", "tujuanPenggunaan", "caraPenyampaian", status, "nomorRegister", keterangan, "createdAt", "updatedAt") VALUES ('cmocn18ji0000flw0s9pd3k95', 'JULIUS DJAMI', '3201010101010005', 'JL.OEBON 03, RT.23/RW.09K,KEL.SIKUMANA,KEC.MAULAFA', '085216182664', 'juliusbungadjami@gmail.com', 'mahasiswa', 'informasi tentang ppid', 'wawasan', 'email', 'SELESAI', 'PPID-20260424-5450', 'semangat', '2026-04-24 08:17:48.503', '2026-04-24 08:19:13.962');
INSERT INTO public."PermohonanInformasi" (id, "namaPemohon", nik, alamat, telepon, email, pekerjaan, "informasiDiminta", "tujuanPenggunaan", "caraPenyampaian", status, "nomorRegister", keterangan, "createdAt", "updatedAt") VALUES ('cmohxcn0e00003azuct36nc0t', 'EDUARD DJAMI', '3201010101010006', 'JL.OEBON 03, RT.23/RW.09K,KEL.SIKUMANA,KEC.MAULAFA', '085216182664', 'juliusbungadjami@gmail.com', 'mahasiswa', 'struktur PPID', 'ingin mengetahui', 'email', 'DIPROSES', 'PPID-20260428-2961', '', '2026-04-28 01:05:28.189', '2026-08-29 02:12:04.087');


ALTER TABLE public."PermohonanInformasi" ENABLE TRIGGER ALL;

--
-- Data for Name: SekapurSirih; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."SekapurSirih" DISABLE TRIGGER ALL;

INSERT INTO public."SekapurSirih" (id, judul, konten, foto, jabatan, nama, "createdAt", "updatedAt") VALUES ('cmob2txpb0000gozgg7p2o59c', 'Sambutan Kepala Biro', 'Salve, Shalom, Assalamu’alaikum, Om Swastyastu, Namo Buddhaya, dan Salam Kebajikan. Selamat datang di website resmi Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur.

Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur didukung oleh tiga bagian yaitu Bagian Kelembagaan dan Analisis Jabatan, Bagian Tatalaksana, serta Bagian Reformasi Birokrasi dan Akuntablitas Kinerja. 

Sebagai wujud transaparansi informasi dalam menuju reformasi birokrasi, Biro Organisasi menyajikan berbagai layanan informasi baik terkait dengan kegiatan sehari-hari maupun layanan lain yang terkait dengan informasi pelayanan publik.', 'https://eewfle4621.ufs.sh/f/56giZDx18deKoLGXTMA1qMj3e7Q8t6izUd4pxNTvrfGXOckI', 'Kepala Biro Organisasi Setda Prov.NTT', 'Adelino Da Cruz Soares, AKS., MPS.SP ', '2026-04-23 06:04:30.045', '2026-06-15 06:47:58.992');


ALTER TABLE public."SekapurSirih" ENABLE TRIGGER ALL;

--
-- Data for Name: SeputarPPID; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."SeputarPPID" DISABLE TRIGGER ALL;



ALTER TABLE public."SeputarPPID" ENABLE TRIGGER ALL;

--
-- Data for Name: SiteSettings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."SiteSettings" DISABLE TRIGGER ALL;

INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmoa7kdti0003ihuzsew0rvz3', 'site_description', 'Website resmi Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur', 'Deskripsi', '2026-04-22 15:29:16.278', '2026-04-22 15:29:16.278');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmoa7kf9p0004ihuzyz71ctok', 'alamat', 'Jl. El Tari No. 1, Kupang, Nusa Tenggara Timur 85111', 'Alamat', '2026-04-22 15:29:18.157', '2026-04-22 15:29:18.157');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmoa7kgmx0005ihuzi4bz7vxp', 'telepon', '(0380) 831021', 'Telepon', '2026-04-22 15:29:19.929', '2026-04-22 15:29:19.929');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmoa7ki1x0006ihuzbrxsuomf', 'email', 'biroorganisasi@nttprov.go.id', 'Email', '2026-04-22 15:29:21.765', '2026-04-22 15:29:21.765');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmoa7kjr70007ihuzue6b9e7n', 'jam_kerja', 'Senin - Jumat: 08.00 - 16.00 WITA', 'Jam Kerja', '2026-04-22 15:29:23.621', '2026-04-22 15:29:23.621');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmoa7kl7s0008ihuzpkmxjwe0', 'instagram', 'https://instagram.com/biroorganisasi_ntt', 'Instagram', '2026-04-22 15:29:25.865', '2026-04-22 15:29:25.865');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmoa7kmlb0009ihuz8izdh8e3', 'whatsapp', 'https://wa.me/62380831021', 'WhatsApp', '2026-04-22 15:29:27.648', '2026-04-22 15:29:27.648');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmoa7ko0h000aihuzhkh5t23d', 'tiktok', 'https://tiktok.com/@biroorganisasi_ntt', 'TikTok', '2026-04-22 15:29:29.489', '2026-04-22 15:29:29.489');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmoa7ka520001ihuze2ltj54v', 'site_name', 'Biro Organisasi Provinsi NTT', 'Nama Situs', '2026-04-22 15:29:11.51', '2026-08-27 12:54:56.653');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmoa7kcdq0002ihuzxz8euybd', 'site_tagline', 'Melayani Dengan Sepenuh Hati', 'Tagline', '2026-04-22 15:29:14.414', '2026-08-27 12:54:57.157');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmos9h9500002kmddkucrlcqt', 'site_email', 'biroorganisasisetdaprovinsintt@gmail.com', 'Email Kontak', '2026-05-05 06:42:40.644', '2026-08-27 12:54:57.833');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmos9h9e60003kmdde1ui7r1e', 'site_phone', '-', 'Nomor Telepon', '2026-05-05 06:42:40.975', '2026-08-27 12:54:58.241');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmos9h9qu0004kmdd8v4uanpd', 'site_address', 'Jalan Raya El Tari Nomor 52  Kupang 85111', 'Alamat', '2026-05-05 06:42:41.431', '2026-08-27 12:54:58.867');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmos9ha030005kmdd5t8ahqkk', 'site_jam_kerja', '08.00 - 16.00', 'Jam Operasional', '2026-05-05 06:42:41.763', '2026-08-27 12:54:59.446');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmos9haaa0006kmddr2j27ft2', 'site_facebook', 'facebook.com/ biroorganisasintt.biroorganisasintt', 'Facebook URL', '2026-05-05 06:42:42.13', '2026-08-27 12:54:59.829');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmos9hais0007kmddomey3a8j', 'site_instagram', 'https://www.instagram.com/ organisasi_nttprov? igsh=MWYwMXpyZXpjeDB1bA', 'Instagram URL', '2026-05-05 06:42:42.436', '2026-08-27 12:55:00.265');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmos9haug0008kmddrtlushhk', 'site_youtube', 'https://www.youtube.com/@biroorganisasisetdaprovins9861', 'YouTube URL', '2026-05-05 06:42:42.857', '2026-08-27 12:55:00.646');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmos9hb390009kmddppeg7xp6', 'hero_tagline', '#AyoBangunNTT', 'Tagline Hero Slider', '2026-05-05 06:42:43.173', '2026-08-27 12:55:01.241');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmtbj3cva0000uqdlvp0rhxj8', 'sosmed_1787835446876', '{"platform":"Youtube","url":"https://www.youtube.com/@biroorganisasisetdaprovins9861","aktif":true}', 'Youtube', '2026-08-27 12:58:15.14', '2026-08-27 12:58:15.14');
INSERT INTO public."SiteSettings" (id, key, value, label, "createdAt", "updatedAt") VALUES ('cmow6lc6p0000h1is6i3fi4uq', 'sosmed_1778200360280', '{"platform":"Instagram","url":"https://www.instagram.com/organisasi_nttprov/","aktif":true}', 'Instagram', '2026-05-08 00:32:57.072', '2026-08-27 12:58:15.165');


ALTER TABLE public."SiteSettings" ENABLE TRIGGER ALL;

--
-- Data for Name: SitusTerkait; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."SitusTerkait" DISABLE TRIGGER ALL;

INSERT INTO public."SitusTerkait" (id, label, href, external, thumbnail, urutan, aktif, "createdAt", "updatedAt", favicon) VALUES ('cmoi2wfcq0000qu3jtj537dh9', 'G-SINJAB', 'http://nusatenggaratimurprov3.5.sinjab.info/', true, '{https://eewfle4621.ufs.sh/f/56giZDx18deKoKN41bA1qMj3e7Q8t6izUd4pxNTvrfGXOckI}', 1, true, '2026-04-28 03:40:49.466', '2026-04-28 03:40:49.466', '');


ALTER TABLE public."SitusTerkait" ENABLE TRIGGER ALL;

--
-- Data for Name: SliderBeranda; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."SliderBeranda" DISABLE TRIGGER ALL;

INSERT INTO public."SliderBeranda" (id, judul, deskripsi, gambar, urutan, aktif, "createdAt", "updatedAt") VALUES ('cmob6ttdg00003a7kwlzcf91e', 'Lokakarya Teknis', ' Implementasi Cascading Lingkup Pemerintah Provinsi NTT Tahun 2026', 'https://eewfle4621.ufs.sh/f/56giZDx18deKNe4IZOlWie3jRyBf0pnQtC17Zoxa2SX8wmAV', 2, true, '2026-04-23 07:56:22.899', '2026-04-23 07:56:22.899');
INSERT INTO public."SliderBeranda" (id, judul, deskripsi, gambar, urutan, aktif, "createdAt", "updatedAt") VALUES ('cmob6y2vu00013a7kylg9uhkv', 'Gubernur NTT Tutup Lokakarya Cascading 2026', 'Birokrasi harus menjadi penentu utama keberhasilan kemajuan daerah melalui tata kelola yang tepat, terukur, dan relevan.', 'https://eewfle4621.ufs.sh/f/56giZDx18deKxoez7gIGj3xVTrHzAgSFwucYyXLNkdleaZMm', 3, true, '2026-04-23 07:59:41.845', '2026-04-23 07:59:41.845');


ALTER TABLE public."SliderBeranda" ENABLE TRIGGER ALL;

--
-- Data for Name: StandarPelayanan; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."StandarPelayanan" DISABLE TRIGGER ALL;

INSERT INTO public."StandarPelayanan" (id, judul, deskripsi, file, urutan, aktif, "createdAt", "updatedAt") VALUES ('cmoaydhxo0002111u9p524gfi', 'MAKLUMAT PELAYANAN', 'MAKLUMAT PELAYANAN BIRO ORGANISASI', 'https://drive.google.com/file/d/1A0OarMIvdSpLGG6jS5iiUqyiM3atHM-v/view?usp=sharing', 1, true, '2026-04-23 03:59:44.622', '2026-04-23 03:59:44.622');


ALTER TABLE public."StandarPelayanan" ENABLE TRIGGER ALL;

--
-- Data for Name: StatistikBeranda; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."StatistikBeranda" DISABLE TRIGGER ALL;

INSERT INTO public."StatistikBeranda" (id, label, nilai, ikon, urutan, "createdAt", "updatedAt") VALUES ('cmoa7kuj5000eihuzp431xvej', 'OPD Provinsi NTT', '42', 'Building2', 1, '2026-04-22 15:29:37.937', '2026-04-22 15:29:37.937');
INSERT INTO public."StatistikBeranda" (id, label, nilai, ikon, urutan, "createdAt", "updatedAt") VALUES ('cmoa7kvnx000fihuzvk3hkw0e', 'Kabupaten/Kota', '22', 'MapPin', 2, '2026-04-22 15:29:39.071', '2026-04-22 15:29:39.071');
INSERT INTO public."StatistikBeranda" (id, label, nilai, ikon, urutan, "createdAt", "updatedAt") VALUES ('cmoa7kvy3000gihuzxjgkd36o', 'Peraturan Diterbitkan', '150+', 'FileText', 3, '2026-04-22 15:29:39.771', '2026-04-22 15:29:39.771');
INSERT INTO public."StatistikBeranda" (id, label, nilai, ikon, urutan, "createdAt", "updatedAt") VALUES ('cmoa7kw8c000hihuzii1o06ka', 'Layanan PPID', '100%', 'Shield', 4, '2026-04-22 15:29:40.141', '2026-04-22 15:29:40.141');


ALTER TABLE public."StatistikBeranda" ENABLE TRIGGER ALL;

--
-- Data for Name: StrukturOrganisasi; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."StrukturOrganisasi" DISABLE TRIGGER ALL;

INSERT INTO public."StrukturOrganisasi" (id, gambar, deskripsi, aktif, "createdAt", "updatedAt", tipe) VALUES ('cmotpvc2u00005v8sckfqnifg', 'https://eewfle4621.ufs.sh/f/56giZDx18deKXvfrUOjesWjpL6be4aBd27VJyOmiMQnhFzqc', 'Struktur organisasi pada Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur sebagai :
1.	Kepala Biro Organisasi
2.	Kepala Bagian Kelembagaan dan Analisis Jabatan
3.	Kepala Bagian Tata Laksana
a. Kepala Sub Bagian Tata Usaha Biro
4.	Kepala Bagian Reformasi Birokrasi dan Akuntabilitas Kinerja
5.	Kelompok Jabatan Fungsional
', true, '2026-05-06 07:09:17.669', '2026-05-22 04:14:39.859', 'BIRO');
INSERT INTO public."StrukturOrganisasi" (id, gambar, deskripsi, aktif, "createdAt", "updatedAt", tipe) VALUES ('cmtdpr5mi0000mf9pw0biat6j', 'https://eewfle4621.ufs.sh/f/56giZDx18deK3cbFei1lCgcNdJ5zHVvMDrQqBhXoxy36OnaK', 'STRUKTUR PPID', true, '2026-08-29 01:40:15.544', '2026-08-29 01:40:15.544', 'BIRO');


ALTER TABLE public."StrukturOrganisasi" ENABLE TRIGGER ALL;

--
-- Data for Name: TugasFungsiPPID; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."TugasFungsiPPID" DISABLE TRIGGER ALL;

INSERT INTO public."TugasFungsiPPID" (id, judul, konten, urutan, "createdAt", "updatedAt") VALUES ('cmos91nra0000a044rv43qd3y', 'AAAAAA', 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB', 1, '2026-05-05 06:30:33.07', '2026-05-05 06:30:33.07');


ALTER TABLE public."TugasFungsiPPID" ENABLE TRIGGER ALL;

--
-- Data for Name: TugasPokokFungsi; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."TugasPokokFungsi" DISABLE TRIGGER ALL;

INSERT INTO public."TugasPokokFungsi" (id, judul, konten, urutan, "createdAt", "updatedAt") VALUES ('cmoaxx8fp0000g05ie096vmga', 'Dasar Hukum', 'Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur dibentuk berdasarkan Peraturan Gubernur Nusa Tenggara Timur Nomor 69 Tahun 2023 Tentang Kedudukan, Susunan Organisasi, Tugas dan Fungsi serta Tata Kerja Sekretariat Daerah Provinsi Nusa Tenggara Timur', 1, '2026-04-23 03:47:05.844', '2026-05-22 04:00:52.699');
INSERT INTO public."TugasPokokFungsi" (id, judul, konten, urutan, "createdAt", "updatedAt") VALUES ('cmos8vepc00007ijm3qa0yp53', 'Tugas Pokok Biro Organisasi', 'Membantu asisten administrasi umum dalam penyiapan perumusan kebijakan daerah, pengoordinasian pelaksanaan tugas Perangkat Daerah, pemantauan dan evaluasi pelaksanaan kebijakan di bidang kelembagaan dan analisis jabatan, tatalaksana serta reformasi birokrasi dan akuntabilitas kinerja
', 2, '2026-05-05 06:25:41.422', '2026-05-22 04:01:08.906');
INSERT INTO public."TugasPokokFungsi" (id, judul, konten, urutan, "createdAt", "updatedAt") VALUES ('cmpge6cz40000jf99itmril41', ' Fungsi Biro Organisasi', 'Penyiapan perumusan kebijakan daerah di bidang kelembagaan dan analisis jabatan, tatalaksana serta reformasi birokrasi dan akuntabilitas kinerja;
Penyiapan pengoordinasian perumusan kebijakan di bidang kelembagaan dan analisis jabatan, tatalaksana serta reformasi birokrasi dan akuntabilitas kinerja;
Penyiapan pengoordinasian pelaksanaan tugas Perangkat Daerah di bidang kelembagaan dan analisis jabatan, tatalaksana serta reformasi birokrasi dan akuntabilitas kinerja;
Penyiapan pemantauan dan evaluasi pelaksanaan kebijakan di bidang kelembagaan dan analisis jabatan, tatalaksana serta reformasi birokrasi dan akuntabilitas kinerja; dan
Pelaksanaan fungsi lain yang diberikan oleh Asisten administrasi umum', 3, '2026-05-22 04:00:38.704', '2026-05-22 04:58:27.827');


ALTER TABLE public."TugasPokokFungsi" ENABLE TRIGGER ALL;

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."User" DISABLE TRIGGER ALL;

INSERT INTO public."User" (id, name, email, password, role, "createdAt", "updatedAt") VALUES ('cmoa7k7wh0000ihuzuvsoc6fc', 'Super Admin', 'admin@biroorganisasi.nttprov.go.id', '$2b$12$ypQHd7NyH1yAPbbJOujkROR7Wh4JFVLZcbi7/btUb6I94Z0IXgUbO', 'SUPERADMIN', '2026-04-22 15:29:08.607', '2026-04-22 15:29:08.607');


ALTER TABLE public."User" ENABLE TRIGGER ALL;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public._prisma_migrations DISABLE TRIGGER ALL;

INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('ae88b29f-bfd2-4608-a9d5-0d88d358bec2', '3fa9d5a0c2b7035dbdeb03c609afb94477521b345503ecff525fb4b81aceaaef', '2026-04-22 12:22:48.281264+00', '20260331031942_init', NULL, NULL, '2026-04-22 12:22:48.072744+00', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('139fb4e4-8d73-4630-b371-e843ec6f18e3', '39f7adb3ec86f063e8b2247aa253ed107d40771462c80888b761d8d983e8c781', '2026-04-23 05:52:21.576408+00', '20260423055105_add_situs_terkait', NULL, NULL, '2026-04-23 05:52:21.414591+00', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('cd3e13ec-6d2e-4fdd-8c3f-914d6910e50f', '0a7eb318e81ca544ec7a2442f87047f6eb794907cd8393e77482a7c9ad482a6a', '2026-04-27 01:47:06.859177+00', '20260427012540_add_informasi_publik', NULL, NULL, '2026-04-27 01:47:06.778453+00', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('ce7551c9-1e09-460f-bbf6-c6e1dcb43899', 'b3988215fc8e3349eacc6b056feed0fb8df0154faecb6d41e1f0def4e89befa0', '2026-04-28 02:20:37.555331+00', '20260428021834_add_seputar_ppid', NULL, NULL, '2026-04-28 02:20:37.431647+00', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('ad547999-0125-4c50-a297-5c2c3b64f7b9', '88bce22082a32df19a733f5778a426b8b159901bc54eca1ed46f2cf475cf32fb', '2026-04-28 02:51:20.860464+00', '20260428023450_add_video_berita', NULL, NULL, '2026-04-28 02:51:20.823887+00', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('6d4fd070-8582-41df-80e9-f9b37d66b738', '6e4f75b85603339c30de693e667ae6e779f911ce1dee55c9b88d478b2f6a4785', '2026-04-28 03:30:32.503624+00', '20260428031516_add_situs_terkait', NULL, NULL, '2026-04-28 03:30:32.470545+00', 1);


ALTER TABLE public._prisma_migrations ENABLE TRIGGER ALL;

--
-- Data for Name: informasi_publik; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.informasi_publik DISABLE TRIGGER ALL;

INSERT INTO public.informasi_publik (id, judul, deskripsi, kategori, tipe, url, "urlDokumen", urutan, aktif, "createdAt", "updatedAt") VALUES ('cmtdqvaa20000v6ctw0tmv2id', 'Jadwal Pelayanan', NULL, 'pelayananan', 'GAMBAR', 'https://utfs.io/f/56giZDx18deKVGr6tnqd8F9KDIZCUeNsfuQ0Op4jLzMaA6qw', NULL, 1, true, '2026-08-29 02:11:27.815', '2026-08-29 02:14:19.058');


ALTER TABLE public.informasi_publik ENABLE TRIGGER ALL;

--
-- PostgreSQL database dump complete
--

\unrestrict nhLNFImzOe8ehya0RcQyyC9dwijdoThIEoNrysUgprHBZPXZaAnLdMYyu1McLVz


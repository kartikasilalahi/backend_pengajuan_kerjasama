-- MySQL dump 10.13  Distrib 5.7.30, for Linux (x86_64)
--
-- Host: localhost    Database: app_kerjasama
-- ------------------------------------------------------
-- Server version	5.7.30-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `akun`
--

DROP TABLE IF EXISTS `akun`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `akun` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `alamat` varchar(70) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(120) DEFAULT NULL,
  `linkperusahaan` varchar(150) DEFAULT NULL,
  `jenisperusahaan` varchar(45) DEFAULT NULL,
  `roleid` int(11) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `new` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `akun`
--

LOCK TABLES `akun` WRITE;
/*!40000 ALTER TABLE `akun` DISABLE KEYS */;
INSERT INTO `akun` VALUES (1,'admin','1','jkt','admin','4f80606f1071557d6db41c106834c5318a293658805ba3f767354bef80579d71',NULL,NULL,1,'verified',NULL),(51,'agit','0823','Tangerang','tikasilalahi.test@gmail.com','1cb2b4378d3a195e549ffe826bf8471acb2075e580b4a62bd72042a3e9ae8c81','https://www.ag-it.com/','Non Pemerintahan',2,'verified',NULL),(52,'pt. pertamina','0821','Jakarta Pusat','nikolas.sihite@gmail.com','1cb2b4378d3a195e549ffe826bf8471acb2075e580b4a62bd72042a3e9ae8c81','www.pertamina.com','Pemerintahan',2,'verified',NULL),(53,'PT. MIZUHO BALIMOR FINANCE','082160046536','Jl. Pangeran Jayakarta No. 137','miasinaga59@gmail.com','076baed03fa06c82961e6fa484db24e0ce90f7d736a1f98286d5f16454edb614','Tidak Ada','Non Pemerintahan',2,'verified',NULL),(54,'custom','085262147254','Tanjung Duren','hastrynapitu@gmail.com','70fe4117ef66e21f4f0091807dd1ed7d5d3d57dea0a7cbeccc14b044874530c0','https://custom.co.id','Non Pemerintahan',2,'verified',NULL);
/*!40000 ALTER TABLE `akun` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bidang_kerjasama`
--

DROP TABLE IF EXISTS `bidang_kerjasama`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bidang_kerjasama` (
  `id_bidang` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_bidang`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bidang_kerjasama`
--

LOCK TABLES `bidang_kerjasama` WRITE;
/*!40000 ALTER TABLE `bidang_kerjasama` DISABLE KEYS */;
INSERT INTO `bidang_kerjasama` VALUES (1,'Pendidikan'),(2,'Penelitian'),(3,'Pengabdian pada Masyarakat'),(4,'Kemahasiswaan'),(5,'Non Akademik'),(6,'Lain-lain');
/*!40000 ALTER TABLE `bidang_kerjasama` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluasi`
--

DROP TABLE IF EXISTS `evaluasi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `evaluasi` (
  `idevaluasi` int(11) NOT NULL AUTO_INCREMENT,
  `id_instansi` int(11) DEFAULT NULL,
  `instansi` varchar(50) DEFAULT NULL,
  `nama_evaluator` varchar(45) DEFAULT NULL,
  `jenis_kerjasama` varchar(50) DEFAULT NULL,
  `bidang_kerjasama` varchar(50) DEFAULT NULL,
  `skop_kerjasama` varchar(60) DEFAULT NULL,
  `lama_kerjasama` varchar(45) DEFAULT NULL,
  `kesepakatan` varchar(45) DEFAULT NULL,
  `tanggapan_umb` varchar(45) DEFAULT NULL COMMENT '\n',
  `penandatanganan` varchar(45) DEFAULT NULL,
  `implementasi_kegiatan` varchar(45) DEFAULT NULL,
  `implementasi_kerjasama` varchar(45) DEFAULT NULL,
  `kepuasan_kerjasama` varchar(45) DEFAULT NULL,
  `kelanjutan_kerjasama` varchar(45) DEFAULT NULL,
  `id_pengajuan` int(11) DEFAULT NULL,
  PRIMARY KEY (`idevaluasi`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluasi`
--

LOCK TABLES `evaluasi` WRITE;
/*!40000 ALTER TABLE `evaluasi` DISABLE KEYS */;
INSERT INTO `evaluasi` VALUES (10,51,'agit','mia','pendidikan','pendidikan','luas','2 bulan','Baik','Sangat Baik','Baik','Sangat Baik','Sangat Baik','Baik','ya',72),(11,52,'pertamina','test','pendidikan','pendidikan','pendidikan','2 bulan','Baik','Sangat Baik','Sangat Baik','Sangat Baik','Baik','Sangat Baik','ya',73),(12,53,'PT. MIZUHO BALIMOR FINANACE','Mia','FINANCE','FINANCE','FINANCE','1 TAHUN','Baik','Baik','Baik','Baik','Baik','Baik','ya',74),(13,52,'h','h','h','h','h','h','Baik','Baik','Baik','Sangat Baik','Baik','Sangat Baik','ya',76);
/*!40000 ALTER TABLE `evaluasi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pengajuan`
--

DROP TABLE IF EXISTS `pengajuan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pengajuan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pengaju` varchar(45) DEFAULT NULL,
  `no_pengaju` varchar(45) DEFAULT NULL,
  `PIC` varchar(45) DEFAULT NULL,
  `no_PIC` varchar(45) DEFAULT NULL,
  `nama_institusi` varchar(45) DEFAULT NULL,
  `alamat_institusi` varchar(65) DEFAULT NULL,
  `idbidang` int(11) DEFAULT NULL,
  `pejabat` varchar(45) DEFAULT NULL,
  `jabatan` varchar(45) DEFAULT NULL,
  `unit` varchar(45) DEFAULT NULL,
  `MOU` varchar(100) DEFAULT NULL,
  `MOA` varchar(100) DEFAULT NULL,
  `IA` varchar(100) DEFAULT NULL,
  `perpanjangan` varchar(100) DEFAULT NULL,
  `penanggungjawab` varchar(45) DEFAULT NULL,
  `bidanglain` varchar(45) DEFAULT NULL,
  `idmitra` int(11) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pengajuan`
--

LOCK TABLES `pengajuan` WRITE;
/*!40000 ALTER TABLE `pengajuan` DISABLE KEYS */;
INSERT INTO `pengajuan` VALUES (72,'mia','0823','lavenia','0821','agit','tangerang',1,'sinaga','dirut','IT','/mitra/dokumen/doc1594979301812.docx','/mitra/dokumen/doc1594979301821.docx','/mitra/dokumen/doc1594979301824.docx','/mitra/dokumen/doc1594979301829.docx','mai','tidak ada',51,'finish'),(73,'hastry','0821','wati','0823','pertamina','Jakarta Pusat',1,'Watik','Dirut','Unit IT','/mitra/dokumen/doc1594982133457.docx','/mitra/dokumen/doc1594982133458.docx','/mitra/dokumen/doc1594982133460.docx','/mitra/dokumen/doc1594982133461.docx','Mia','tidak ada',52,'finish'),(74,'Mia Sinaga','082160046536','Mia','082160046536','PT. MIZUHO BALIMOR FINANCE','Jl. Pangeran Jayakarta No. 137',5,'Noriyuki Kamei','President Director','GAD','/mitra/dokumen/doc1595051584343.docx','/mitra/dokumen/doc1595051584351.docx','/mitra/dokumen/doc1595051584356.docx','/mitra/dokumen/doc1595051584361.docx','Astri Dwiyanti','Finance',53,'finish'),(75,'Hastry','085262147254','hastry','0852562147254','custom.co.id','Tanjung Duren \n',6,'hastry','ceo','ti','/mitra/dokumen/doc1595053192632.docx','/mitra/dokumen/doc1595053192637.docx','/mitra/dokumen/doc1595053192642.docx','/mitra/dokumen/doc1595053192647.docx','tika','percetakan',54,'decline'),(76,'pengaju','0897326674567','pic ','908908876','pt pertamina','jakarta',5,'pejabat','jabatan','uit','/mitra/dokumen/doc1595069193513.docx','/mitra/dokumen/doc1595069193517.docx','/mitra/dokumen/doc1595069193522.docx','/mitra/dokumen/doc1595069193525.docx','penagnggung jawab','perminyakan',52,'finish');
/*!40000 ALTER TABLE `pengajuan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `penilaian`
--

DROP TABLE IF EXISTS `penilaian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `penilaian` (
  `id_penilaian` int(11) NOT NULL AUTO_INCREMENT,
  `id_pengajuan` varchar(45) DEFAULT NULL,
  `nilai_profil` varchar(45) DEFAULT NULL,
  `nilai_kinerja` varchar(45) DEFAULT NULL,
  `nilai_reputasi` varchar(45) DEFAULT NULL,
  `nama_reviewer` varchar(45) DEFAULT NULL,
  `jabatan_reviewer` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_penilaian`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `penilaian`
--

LOCK TABLES `penilaian` WRITE;
/*!40000 ALTER TABLE `penilaian` DISABLE KEYS */;
INSERT INTO `penilaian` VALUES (26,'72','Baik','Baik','Baik','midek','rektor'),(27,'73','Baik','Baik','Baik','x','Admin'),(28,'74','Baik','Baik','Baik','Hastry','Legal'),(29,'75','Sangat Kurang','Kurang','Sangat Kurang','hastry','ceo'),(30,'76','Baik','Baik','Baik','admin','admim');
/*!40000 ALTER TABLE `penilaian` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-07-23 18:28:15

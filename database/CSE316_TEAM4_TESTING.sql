-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: CSE316_TEAM4_DB
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `CSE316_TEAM4_DB`
--

DROP DATABASE IF EXISTS `CSE316_TEAM4_DB`;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `CSE316_TEAM4_DB` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `CSE316_TEAM4_DB`;

--
-- Table structure for table `announcement`
--

DROP TABLE IF EXISTS `announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement` (
  `announcementKey` int NOT NULL,
  `content` varchar(5000) DEFAULT '',
  `title` varchar(500) DEFAULT 'No Announcements Yet',
  PRIMARY KEY (`announcementKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement`
--

LOCK TABLES `announcement` WRITE;
/*!40000 ALTER TABLE `announcement` DISABLE KEYS */;
INSERT INTO `announcement` VALUES (1,'Dear CO;Ders Community,\n\nWe’re thrilled to share some exciting updates! Our team has been hard at work planning new initiatives to further our mission of fostering collaboration and innovation. Here’s a sneak peek at what’s coming:\n\n1. Workshops: Hands-on coding sessions led by experienced professionals.\n2. Hackathon: A weekend of creativity and problem-solving with amazing prizes.\n3. Outreach Programs: Expanding our efforts to mentor and inspire young developers.\n\nStay tuned for more details in the coming weeks! As always, thank you for your continued support and passion for making CO;Ders a vibrant community.\n\nWarm regards,\nCO;Ders Team','Exciting Updates on CO;Ders Initiatives! 🚀');
/*!40000 ALTER TABLE `announcement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `galleryitems`
--

DROP TABLE IF EXISTS `galleryitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `galleryitems` (
  `imageId` int NOT NULL AUTO_INCREMENT,
  `imageUrl` varchar(255) NOT NULL,
  PRIMARY KEY (`imageId`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `galleryitems`
--

LOCK TABLES `galleryitems` WRITE;
/*!40000 ALTER TABLE `galleryitems` DISABLE KEYS */;
INSERT INTO `galleryitems` VALUES (11,'https://res.cloudinary.com/dncizjyjo/image/upload/v1733158888/gallery_images/xzpgg8ozltpjtfh4jtl0.jpg'),(12,'https://res.cloudinary.com/dncizjyjo/image/upload/v1733158898/gallery_images/zgbkilthgi13mfyywjpm.jpg'),(13,'https://res.cloudinary.com/dncizjyjo/image/upload/v1733158906/gallery_images/xeu25gl7ydxfvvcygs0y.jpg'),(14,'https://res.cloudinary.com/dncizjyjo/image/upload/v1733158916/gallery_images/t4olf7oslejayibxkyjy.jpg'),(15,'https://res.cloudinary.com/dncizjyjo/image/upload/v1733158924/gallery_images/siynfggko7jgpkgp4o41.jpg'),(16,'https://res.cloudinary.com/dncizjyjo/image/upload/v1733158932/gallery_images/f0avpohdj6fpew9s5jth.jpg'),(17,'https://res.cloudinary.com/dncizjyjo/image/upload/v1733158940/gallery_images/qocjhakxynfthlv3ml0m.jpg'),(18,'https://res.cloudinary.com/dncizjyjo/image/upload/v1733158947/gallery_images/jictyw7rx86rna6hw9cz.jpg');
/*!40000 ALTER TABLE `galleryitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `memberId` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `position` varchar(255) DEFAULT 'member',
  `phoneNumber` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `profileImageUrl` varchar(255) DEFAULT NULL,
  `isExecutives` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`memberId`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (27,'chief_test','4fcc78a61e5b6ab5588d7a8c9db536bedcce866ae65b78cundefined78996d5e1bf54a','CHIEF_TEST','Chief Executive Manager','010-4351-3516','chief_test@gmail.com','https://res.cloudinary.com/dncizjyjo/image/upload/v1733324092/user_images/user_chief_test.jpg',2),(28,'exec_test','9a9b11ea36d0fe1ec2b81d57f31dd68a68690ac6af7765451180fc1ffc2054','EXEC_TEST','Executive Manager','010-5125-2315','exec_test@gmail.com','https://res.cloudinary.com/dncizjyjo/image/upload/v1733324198/user_images/user_exec_test.jpg',1),(29,'mem_test','19ab02fd4a1163824cca5f9213c7962dbe385891da3d4b3319ded84b75c964b0','MEM_TEST','Member','010-8536-4673','mem_test@gmail.com','https://res.cloudinary.com/dncizjyjo/image/upload/v1733324305/user_images/user_mem_test.jpg',0),(30,'Hyeseong','a14573433454789cffdc2884b9a55c3bb123aebdd792c7undefined57cff8b67109ac','Hyeseong Bak','Executive Manager','010-3322-5413','hyeseong.bak@stonybrook.edu','https://res.cloudinary.com/dncizjyjo/image/upload/v1733324682/user_images/user_Hyeseong.jpg',1),(32,'sooah','a16a7b84c8f24cb8990e1d27a18fd37d6a51e521042c24db6120bac1f8fa9','Sooah Kim','Executive Manager','012-1231-4123','sooah.kim@gmail.com','https://res.cloudinary.com/dncizjyjo/image/upload/v1733324826/user_images/user_sooah.jpg',1),(33,'sanghyun','bf8b3768ab86cf84017e69dba2054fa1c488d8ffa5dc16200f373bb1cd0910','Sanghyun Jun','Executive Manager','010-5123-5123','sanghyun.jun@stonybrook.edu','https://res.cloudinary.com/dncizjyjo/image/upload/v1733324936/user_images/user_sanghyun.jpg',1),(34,'john','undefined967697f8e6a39c9713f0beaf26935cf1ad825b123705442ddf5adb6bce6fa','John Min','Treasurer','010-5162-3612','john.min@gmail.com','https://res.cloudinary.com/dncizjyjo/image/upload/v1733325076/user_images/user_john.jpg',0),(35,'min','c4fc0bc212024c62b759d90ef87af450e05e97832359b9927347486261090b82','Min Jo','Advisor','010-5123-6267','min.jo@gmail.com','https://res.cloudinary.com/dncizjyjo/image/upload/v1733325134/user_images/user_min.jpg',0),(36,'taeyoung','d02598a9f6ec10696d0d74628690e2d44aade958e6674d5ba16fea3999ae5f','Taeyoung Kang','Member','010-5167-4467','taeyoung.kang@gmail.com','https://res.cloudinary.com/dncizjyjo/image/upload/v1733325244/user_images/user_taeyoung.jpg',0);
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-05  0:16:30

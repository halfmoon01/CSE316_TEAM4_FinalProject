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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (1,'user10006','password789','John','Treasurer','010-1234-5678','john@example.com','https://i.pinimg.com/474x/ec/26/63/ec26633253128511e08d5b42e3f92b67.jpg',0),(3,'user10008','password102','Alice','Executive Manager','010-3234-5678','alice@example.com','https://i.pinimg.com/474x/be/c6/cb/bec6cb250a7a383f698c9adc75e62f23.jpg',1),(6,'user10011','password105','Jenny','Treasurer','010-6234-5678','jenny@example.com','https://i.pinimg.com/236x/0a/63/e3/0a63e34cf5ed7ca3877f0503fbf3e99f.jpg',0),(8,'user10013','password107','Chris','Executive Manager','010-8234-5678','chris@example.com','https://i.pinimg.com/474x/af/e1/88/afe1885485a9dfb6a8407169b6ed7217.jpg',1),(10,'user10015','password109','Grace','Executive Manager','010-1234-9876','grace@example.com','https://rgo4.com/files/attach/images/2676751/267/892/004/a7ae55188149cc1eaae4489a2ea36033.jpg',1),(11,'onurivit01','fd66793fa10b582c181af08d152924de4ab2eba24d26c8142a222153154d7014','전상현','Chief Executive Manager','010-9519-1520','onurivit01@gmail.com','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiJRzFaH9bZvfYhEfTK0pUu6TdsngcERstqA&s',2),(23,'user20007','password002','Bob','Executive Manager','010-2234-2234','bob20007@example.com','https://i.pinimg.com/474x/40/6c/71/406c71dddbe19631f597b08563360fc9.jpg',1),(24,'user20008','password003','Charlie','Executive Manager','010-3234-3234','charlie20008@example.com','https://i.pinimg.com/474x/db/ef/ac/dbefacf5ddd80ba757acce099f692ce2.jpg',1);
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

-- Dump completed on 2024-11-30  3:42:45

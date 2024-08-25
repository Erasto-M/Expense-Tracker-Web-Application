-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: smartExpense_db
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.22.04.1

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
-- Table structure for table `budget`
--

DROP TABLE IF EXISTS `budget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `budget` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `amount` decimal(10,0) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `budget_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budget`
--

LOCK TABLES `budget` WRITE;
/*!40000 ALTER TABLE `budget` DISABLE KEYS */;
INSERT INTO `budget` VALUES (1,8,50000);
/*!40000 ALTER TABLE `budget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `expenseName` varchar(100) NOT NULL,
  `amount` decimal(10,0) NOT NULL,
  `category` varchar(100) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,4,'Chapati',50,'food','2024-08-04'),(2,4,'Chapati',50,'food','2024-08-04'),(3,4,'Chapati',50,'food','2024-08-04'),(4,4,'Chapati',50,'food','2024-08-04'),(5,4,'Chapati',50,'food','2024-08-04'),(6,4,'Meat',50,'food','2024-08-04'),(7,4,'Fare',200,'transpot','2024-08-04'),(8,4,'Pilau',100,'food','2024-08-07'),(9,4,'Movie Night',1000,'entertainment','2024-08-07'),(10,4,'Movie Night',1000,'entertainment','2024-08-07'),(11,4,'Electricity',500,'others','2024-08-30'),(12,4,'Ugali',300,'food','2024-08-04'),(13,4,'Bike Riding',300,'entertainment','2024-08-22'),(14,4,'Cooking oil',500,'food','2024-07-31'),(15,5,'Baking Powder',200,'food','2024-08-05'),(16,5,'Fare',400,'transpot','2024-08-08'),(17,6,'Fare',500,'transpot','2024-08-05'),(18,6,'chips',300,'food','2024-08-05'),(37,8,'Boda',400,'transpot','2024-08-11'),(38,8,'Bike riding',600,'entertainment','2024-08-09'),(39,8,'Pilau',400,'food','2024-08-11'),(40,8,'Rent',2000,'rent','2024-08-11'),(41,8,'Panadol',340,'health','2024-08-29'),(42,8,'Rice',100,'food','2024-08-23'),(43,8,'plough',500,'others','2024-08-29'),(44,8,'Chapati',500,'food','2024-08-11'),(45,8,'Ugali',100,'food','2024-08-11'),(46,8,'bike cycle',300,'entertainment','2024-08-11'),(48,8,'Fare',200,'transpot','2024-08-30'),(49,8,'Chapo Mix',50,'food','2024-08-12'),(50,8,'Chapati',400,'food','2024-08-25');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `passWord` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'erastusmunya2022@gmail.com','murasta','$2a$10$SMqfDltn/MqRVxNHP6ixpu7l.IfCzpw6AJLfOYGU1hOwiQWZ06Kr6'),(2,'erastus@gmail.com','murasta12','$2a$10$1prKdTAfRa04/cyOuV4XGO9vztwa0ZkqoJqyrUmlz2rFjLT07PA4G'),(3,'erastusmunya@gmail.com','erastusmunya','$2a$10$QIiqys6wUApCbtiCuydK1ejJauvUtBDsG3A.gBGgeTU4vHaevj4/a'),(4,'erastusmunya22@gmail.com','erastusmura','$2a$10$lWFLQ6w1UY7YMFVme8bAneLsfsggH0booYTZmbY65hvXBVo61D9la'),(5,'sheddy@gmail.com','SheddyMususmbi','$2a$10$05KF10fhcMrsRbylcImCl.ywWmu7igudGvojhHKOBxRSpvIiPl5Bi'),(6,'eddy@gmail.com','eddy','$2a$10$b1J0TUDAmI964iX0ZPSoSeWfJVlbs0W4I/bxh/iS/cMZXn3aHLp3u'),(7,'sheddymusu@gmail.com','SheddyMusumbi','$2a$10$c40LwyL8SEg/q1ogLZoHLeN7e6kcvWdReEsjZm1bzNJzSodJ5/Jg6'),(8,'muras@gmail.com','muras','$2a$10$Z29dZpUZDr2f9hHMJpOjl.aWQpK6o/aLBCFrE8zVXq650SWsqfY9a'),(9,'stevo@gmail.com','stevo','$2a$10$.QOW/Zgw8L0C7Pbi.yiqKeK7S9gHrpJYABXt55J236zIfU/ia.nTS'),(10,'erastusmunya12@gmail.com','muras12','$2a$10$lQYCM50hc7IJGGtNyQK24OhcFJZwDtaMAv6RvBaRDP2MJNPjjePFG');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-25 20:21:47

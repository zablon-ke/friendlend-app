-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: friendlend
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.21-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `loan`
--

DROP TABLE IF EXISTS `loan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loan` (
  `app_ID` varchar(30) NOT NULL,
  `user_ID` int(11) DEFAULT NULL,
  `loanAmount` decimal(8,2) DEFAULT NULL,
  `purpose` varchar(30) NOT NULL,
  `Date_applied` datetime DEFAULT current_timestamp(),
  `date_approved_rejected` datetime DEFAULT NULL,
  `approvalNotes` text DEFAULT NULL,
  `State` varchar(10) NOT NULL DEFAULT 'Pending',
  `type_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`app_ID`),
  KEY `fk_ln_us` (`user_ID`),
  KEY `fk_ln_tp` (`type_ID`),
  CONSTRAINT `fk_ln_tp` FOREIGN KEY (`type_ID`) REFERENCES `loan_type` (`ID`) ON UPDATE CASCADE,
  CONSTRAINT `fk_ln_us` FOREIGN KEY (`user_ID`) REFERENCES `useraccount` (`User_ID`) ON UPDATE CASCADE,
  CONSTRAINT `CONSTRAINT_1` CHECK (`State` in ('Approved','Pending','Rejected'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan`
--

LOCK TABLES `loan` WRITE;
/*!40000 ALTER TABLE `loan` DISABLE KEYS */;
INSERT INTO `loan` VALUES ('4128AEAD3156',2,100000.00,'Business',NULL,NULL,NULL,'pending',2),('710285870291',2,100000.00,'Business','2024-01-14 20:15:21',NULL,NULL,'pending',NULL);
/*!40000 ALTER TABLE `loan` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-05  8:17:46

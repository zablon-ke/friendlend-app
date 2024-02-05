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
-- Table structure for table `contract`
--

DROP TABLE IF EXISTS `contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contract` (
  `contract_ID` varchar(15) NOT NULL,
  `app_ID` varchar(30) DEFAULT NULL,
  `borrower_ID` int(11) DEFAULT NULL,
  `state` varchar(20) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `lender_ID` int(11) DEFAULT NULL,
  `penalty` decimal(5,2) DEFAULT 0.00,
  `interestCharged` decimal(8,2) DEFAULT 0.00,
  `amount` decimal(8,2) DEFAULT NULL,
  `amountPaid` decimal(8,2) DEFAULT 0.00,
  PRIMARY KEY (`contract_ID`),
  KEY `fk_ct_ln` (`app_ID`),
  KEY `fk_ct_ld` (`lender_ID`),
  KEY `fk_ct_br` (`borrower_ID`),
  CONSTRAINT `fk_ct_br` FOREIGN KEY (`borrower_ID`) REFERENCES `useraccount` (`User_ID`) ON UPDATE CASCADE,
  CONSTRAINT `fk_ct_ld` FOREIGN KEY (`lender_ID`) REFERENCES `useraccount` (`User_ID`) ON UPDATE CASCADE,
  CONSTRAINT `fk_ct_ln` FOREIGN KEY (`app_ID`) REFERENCES `loan` (`app_ID`) ON UPDATE CASCADE,
  CONSTRAINT `CONSTRAINT_1` CHECK (`state` in ('Completed','Not Completed'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract`
--

LOCK TABLES `contract` WRITE;
/*!40000 ALTER TABLE `contract` DISABLE KEYS */;
INSERT INTO `contract` VALUES ('0','4128AEAD3156',2,'Not Completed',NULL,NULL,11,0.00,10500.00,100000.00,0.00),('CT11E6AA55959F','4128AEAD3156',2,'Not Completed',NULL,NULL,11,0.00,10500.00,100000.00,0.00),('CT39FE602D379B','4128AEAD3156',2,'Not Completed',NULL,NULL,11,0.00,10500.00,100000.00,0.00),('CT6CC062778B54','4128AEAD3156',2,'Not Completed',NULL,NULL,11,0.00,10500.00,100000.00,0.00),('CT96958967B8E0','4128AEAD3156',2,'Not Completed',NULL,NULL,11,0.00,10500.00,100000.00,0.00),('CT98B8CFA7FEA8','4128AEAD3156',2,'Not Completed',NULL,NULL,11,0.00,10500.00,100000.00,0.00);
/*!40000 ALTER TABLE `contract` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-05  8:17:45

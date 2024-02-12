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
-- Table structure for table `useraccount`
--

DROP TABLE IF EXISTS `useraccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `useraccount` (
  `User_ID` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(20) DEFAULT NULL,
  `passwrd` varchar(16) DEFAULT NULL,
  `Email` varchar(30) DEFAULT NULL,
  `firstName` varchar(15) DEFAULT NULL,
  `middleName` varchar(15) DEFAULT NULL,
  `lastName` varchar(15) NOT NULL,
  `gender` varchar(6) NOT NULL,
  `DOB` date DEFAULT NULL,
  `ID` varchar(8) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `rol` char(10) NOT NULL,
  `token` text DEFAULT NULL,
  `Status` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`User_ID`),
  UNIQUE KEY `userName` (`userName`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `ID` (`ID`),
  UNIQUE KEY `Email_2` (`Email`),
  UNIQUE KEY `userName_2` (`userName`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `ID_2` (`ID`),
  UNIQUE KEY `Email_3` (`Email`),
  UNIQUE KEY `userName_3` (`userName`),
  UNIQUE KEY `phone_2` (`phone`),
  UNIQUE KEY `ID_3` (`ID`),
  UNIQUE KEY `ID_4` (`ID`),
  UNIQUE KEY `ID_5` (`ID`),
  UNIQUE KEY `Email_4` (`Email`),
  UNIQUE KEY `userName_4` (`userName`),
  UNIQUE KEY `phone_3` (`phone`),
  UNIQUE KEY `Email_5` (`Email`),
  UNIQUE KEY `userName_5` (`userName`),
  UNIQUE KEY `phone_4` (`phone`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`rol` in ('Admin','Lender','Borrower','Support')),
  CONSTRAINT `CONSTRAINT_2` CHECK (`gender` in ('Male','Female'))
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `useraccount`
--

LOCK TABLES `useraccount` WRITE;
/*!40000 ALTER TABLE `useraccount` DISABLE KEYS */;
INSERT INTO `useraccount` VALUES (2,'Godfrey25','1234','simiyufrey@gmail.com','Godfrey','Wayne','Wells','Male','1999-07-10','37088396','0746364856','Admin','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE3MDY1OTYyMzIsImV4cCI6MTcwNjY4MjYzMn0.VqqocCR2pRHU4OREdFW8y0d1j49ZeDKOJa4xaR_takw',NULL),(11,'Godfrey252','1234','simiyufrey3@gmail.com','Godfrey','Wayne','Wells','Male','1999-07-10','37088397','0746364857','Admin','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMSwiaWF0IjoxNzA1NDE4OTUwLCJleHAiOjE3MDU1MDUzNTB9.SkwwumO5Jq9NlmaXUYMCY5G6L6MTvvsD0CVRhxhTBIY',NULL),(19,'Johnes','1234','giddysimiyu50@gmail.com','Alex','Wayne','Johnnes','Male','1999-07-10','37088378','0769702562','Admin',NULL,'verified'),(25,'Johnes12','1234','wekesagody2@gmail.com','Alex','Wayne','Johnnes','Male','1999-07-10','37088678','0769702962','Lender',NULL,'verified');
/*!40000 ALTER TABLE `useraccount` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-05  8:17:44

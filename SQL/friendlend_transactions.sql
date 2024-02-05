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
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `trans_ID` varchar(15) NOT NULL,
  `user_ID` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `transaction_type` varchar(15) DEFAULT NULL,
  `Description` varchar(100) DEFAULT NULL,
  `checkout_ID` varchar(30) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`trans_ID`),
  KEY `fk_tr_us` (`user_ID`),
  CONSTRAINT `fk_tr_us` FOREIGN KEY (`user_ID`) REFERENCES `useraccount` (`User_ID`) ON UPDATE CASCADE,
  CONSTRAINT `CONSTRAINT_1` CHECK (`transaction_type` in ('Withdrawal','deposit','credited'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES ('2d3f0b1dab',2,NULL,NULL,NULL,'ws_CO_280120240039102857697025','0'),('2DFE5417F4',2,NULL,NULL,NULL,'ws_CO_300120240959574187697025','0'),('690DC38AE4',2,NULL,NULL,NULL,'ws_CO_280120240048512197697025','0'),('8FFD58938B',2,NULL,NULL,NULL,'ws_CO_280120241816268297697025','0'),('BE75F6A8FB',2,NULL,NULL,NULL,'ws_CO_280120240037470377697025','0'),('D1BDDEAB8A',2,NULL,NULL,NULL,'ws_CO_300120240958315417697025','0'),('EA89DFS8YT',11,20000.00,'Deposit','Deposited 200000 to lender account','','0'),('EADSDFS8YT',11,20000.00,'Deposit','Deposited 200000 to lender account','','0'),('EADSDFSE6S',11,20000.00,'Deposit','Deposited 200000 to lender account','','0'),('EAG9DFS8YT',11,20000.00,'Deposit','Deposited 200000 to lender account','','0');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-05  8:17:43

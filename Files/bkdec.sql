-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bondkonnect
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `activitylogs`
--

DROP TABLE IF EXISTS `activitylogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activitylogs` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `User` int(11) DEFAULT NULL,
  `Role` int(11) DEFAULT NULL,
  `ActivityType` varchar(100) DEFAULT NULL,
  `Action` varchar(100) DEFAULT NULL,
  `SeverityLevel` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `UserAgent` varchar(100) DEFAULT NULL,
  `IpAddress` varchar(100) DEFAULT NULL,
  `RequestMethod` longtext DEFAULT NULL,
  `RequestUrl` longtext DEFAULT NULL,
  `RequestHeaders` longtext DEFAULT NULL,
  `Location` varchar(100) DEFAULT NULL,
  `Compression` varchar(100) DEFAULT NULL,
  `StatusCode` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_ActivityLogs` (`created_by`),
  KEY `ialtered_by_ActivityLogs` (`altered_by`),
  KEY `iUser_ActivityLogs` (`User`),
  KEY `iRole_ActivityLogs` (`Role`),
  CONSTRAINT `FK_ActivityLogs_Role` FOREIGN KEY (`Role`) REFERENCES `roles` (`Id`),
  CONSTRAINT `FK_ActivityLogs_User` FOREIGN KEY (`User`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_ActivityLogs_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_ActivityLogs_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activitylogs`
--

LOCK TABLES `activitylogs` WRITE;
/*!40000 ALTER TABLE `activitylogs` DISABLE KEYS */;
INSERT INTO `activitylogs` VALUES (1,NULL,'2025-12-04 18:26:33',NULL,NULL,1,5,'authentication','registration_success','info','{\"email\":\"mwangieddie1@gmail.com\"}','node','127.0.0.1','POST','http://localhost:8000/api/V1/auth/user-register','{\"host\":[\"localhost:8000\"],\"connection\":[\"keep-alive\"],\"content-type\":[\"application\\/json\"],\"ocp-apim-subscription-key\":[\"a9e34b351a90e8b21d87eff48d279928\"],\"accept\":[\"*\\/*\"],\"accept-language\":[\"*\"],\"sec-fetch-mode\":[\"cors\"],\"user-agent\":[\"node\"],\"accept-encoding\":[\"gzip, deflate\"],\"content-length\":[\"373\"]}',NULL,NULL,'200'),(2,NULL,'2025-12-04 18:28:58',NULL,NULL,1,5,'authentication','password_set_success','info','{\"email\":\"mwangieddie1@gmail.com\"}','node','127.0.0.1','POST','http://localhost:8000/api/V1/auth/set-password?csrf_timestamp=1764862091&csrf_token=407375e53a5c82468717a252f16ed788ffe39b3dd43f5775e33a0503fbe7cc6b&email=mwangieddie1%40gmail.com&is_res=0&password=Freddie10035%40&s=c66e9459008077f5800fd21780ed0f0a09a99297e775aa4554884a2b0889ee8b','{\"host\":[\"localhost:8000\"],\"connection\":[\"keep-alive\"],\"content-type\":[\"application\\/x-www-form-urlencoded\"],\"ocp-apim-subscription-key\":[\"a9e34b351a90e8b21d87eff48d279928\"],\"accept\":[\"*\\/*\"],\"accept-language\":[\"*\"],\"sec-fetch-mode\":[\"cors\"],\"user-agent\":[\"node\"],\"accept-encoding\":[\"gzip, deflate\"],\"content-length\":[\"0\"]}',NULL,NULL,'200'),(6,NULL,'2025-12-04 18:46:19',NULL,NULL,1,5,'authentication','login_successful','info','{\"email\":\"mwangieddie1@gmail.com\"}','node','127.0.0.1','POST','http://localhost:8000/api/V1/auth/verify-otp?email=mwangieddie1%40gmail.com&ip_address=105.161.73.28&otp=861613','{\"host\":[\"localhost:8000\"],\"connection\":[\"keep-alive\"],\"content-type\":[\"application\\/json\"],\"accept\":[\"application\\/json\"],\"ocp-apim-subscription-key\":[\"a9e34b351a90e8b21d87eff48d279928\"],\"accept-language\":[\"*\"],\"sec-fetch-mode\":[\"cors\"],\"user-agent\":[\"node\"],\"accept-encoding\":[\"gzip, deflate\"],\"content-length\":[\"0\"]}',NULL,NULL,'200'),(7,NULL,'2025-12-05 12:49:32',NULL,NULL,2,5,'authentication','intermediary_registration_completed','info','{\"email\":\"e.technologiesy1@gmail.com\"}','node','127.0.0.1','POST','http://localhost:8000/api/V1/auth/complete-intermediary-registration','{\"host\":[\"localhost:8000\"],\"connection\":[\"keep-alive\"],\"content-type\":[\"application\\/json\"],\"ocp-apim-subscription-key\":[\"a9e34b351a90e8b21d87eff48d279928\"],\"accept\":[\"*\\/*\"],\"accept-language\":[\"*\"],\"sec-fetch-mode\":[\"cors\"],\"user-agent\":[\"node\"],\"accept-encoding\":[\"gzip, deflate\"],\"content-length\":[\"372\"]}',NULL,NULL,'200'),(8,NULL,'2025-12-05 12:51:12',NULL,NULL,1,5,'authentication','logout_successful','info','{\"email\":\"mwangieddie1@gmail.com\"}','node','127.0.0.1','POST','http://localhost:8000/api/V1/auth/user-logout','{\"host\":[\"localhost:8000\"],\"connection\":[\"keep-alive\"],\"accept\":[\"application\\/json\"],\"cookie\":[\"k-o-t=ZXlKcGRpSTZJamRHY3k5RFQyUTVVbWR2YjJGeFV6RXZVa1JJTjJjOVBTSXNJblpoYkhWbElqb2lkVUpuVXpscWREaEhibFJvYldkdFptODVlRWwyWlhKM1VFbEljMGhKTmtJNFZXNVpPRTExZG5oUE1GcHVWbGxvZWk5amVDdFNTVXBGUmxWMVZuRm5OVWhEU1dKaVRtNVdOakZaUVhWSUswUkhkMHhwVTJwMlF6SnRWRkUyVGxKVU4xZEtWWEpNT1doQ1kzZEpTek5DT0cxNVZGbE1WR2h1Y1VRM2EwaGlhekJsVjNSRmJqTjBWalUxZEVoRU1YTnNPRFZIV21WbVVHeFNObW8yUWpaaE0yUkxkazExTm1KV1ZVaFJWRUV3WXlzeGFFWXpVMDV0TXpVNVNUSm5VelpXVnpjeldsVm9lWFpTY3pRM1JVRk5iM05IVmpOQlp6MDlJaXdpYldGaklqb2laRGMzTnpjeVpHSm1PVEJqWldRellUQTVZbVkzTTJJNU5tWmtPVFZoWkRjNVpEWTFOV1kwTTJZeU56SmxOVEV4WWprME16YzJOMk14T1dJNE4ySmtNQ0lzSW5SaFp5STZJaUo5fDVlMDEyYThhZTA3OTQ0NGRjZTMwZDRkYmE1MzM4MTBlODYxMzE2Y2E4MDUyMDlhM2E2YzMwYjcyY2Q0YjQ2NmU=\"],\"accept-language\":[\"*\"],\"sec-fetch-mode\":[\"cors\"],\"user-agent\":[\"node\"],\"accept-encoding\":[\"gzip, deflate\"],\"content-length\":[\"0\"]}',NULL,NULL,'200'),(10,NULL,'2025-12-05 13:00:19',NULL,NULL,2,5,'authentication','password_reset_success','info','{\"email\":\"e.technologiesy1@gmail.com\"}','node','127.0.0.1','POST','http://localhost:8000/api/V1/auth/user-reset-password?email=e.technologiesy1%40gmail.com','{\"host\":[\"localhost:8000\"],\"connection\":[\"keep-alive\"],\"content-type\":[\"application\\/json\"],\"ocp-apim-subscription-key\":[\"a9e34b351a90e8b21d87eff48d279928\"],\"accept\":[\"*\\/*\"],\"accept-language\":[\"*\"],\"sec-fetch-mode\":[\"cors\"],\"user-agent\":[\"node\"],\"accept-encoding\":[\"gzip, deflate\"],\"content-length\":[\"0\"]}',NULL,NULL,'200'),(11,NULL,'2025-12-05 13:01:58',NULL,NULL,2,5,'authentication','password_set_success','info','{\"email\":\"e.technologiesy1@gmail.com\"}','node','127.0.0.1','POST','http://localhost:8000/api/V1/auth/set-password?csrf_timestamp=1764928909&csrf_token=3a350d11d1706889eec97c8fd2cd164da20a51e45a105447e492bf1a95d9ac46&email=e.technologiesy1%40gmail.com&is_res=0&password=Freddie10035%40&s=2652ccf74163ac2161206a466d8ad99ebb483cbe9bc53d9cba1bffb1b906e1c6','{\"host\":[\"localhost:8000\"],\"connection\":[\"keep-alive\"],\"content-type\":[\"application\\/x-www-form-urlencoded\"],\"ocp-apim-subscription-key\":[\"a9e34b351a90e8b21d87eff48d279928\"],\"accept\":[\"*\\/*\"],\"accept-language\":[\"*\"],\"sec-fetch-mode\":[\"cors\"],\"user-agent\":[\"node\"],\"accept-encoding\":[\"gzip, deflate\"],\"content-length\":[\"0\"]}',NULL,NULL,'200'),(12,NULL,'2025-12-05 13:03:03',NULL,NULL,2,5,'authentication','login_successful','info','{\"email\":\"e.technologiesy1@gmail.com\"}','node','127.0.0.1','POST','http://localhost:8000/api/V1/auth/verify-otp?email=e.technologiesy1%40gmail.com&ip_address=41.209.3.22&otp=290703','{\"host\":[\"localhost:8000\"],\"connection\":[\"keep-alive\"],\"content-type\":[\"application\\/json\"],\"accept\":[\"application\\/json\"],\"ocp-apim-subscription-key\":[\"a9e34b351a90e8b21d87eff48d279928\"],\"accept-language\":[\"*\"],\"sec-fetch-mode\":[\"cors\"],\"user-agent\":[\"node\"],\"accept-encoding\":[\"gzip, deflate\"],\"content-length\":[\"0\"]}',NULL,NULL,'200'),(13,NULL,'2025-12-05 13:06:28',NULL,NULL,2,5,'authentication','logout_successful','info','{\"email\":\"e.technologiesy1@gmail.com\"}','node','127.0.0.1','POST','http://localhost:8000/api/V1/auth/user-logout','{\"host\":[\"localhost:8000\"],\"connection\":[\"keep-alive\"],\"accept\":[\"application\\/json\"],\"cookie\":[\"k-o-t=ZXlKcGRpSTZJbU14TkhCclkwMVpORTVQTTJjcllVcHRNVmh0WW1jOVBTSXNJblpoYkhWbElqb2llUzlETTJ4RVNreGxXa2N5ZVd4WGNEUXZWMUJUVjNSV2NVcHRVMnRqVlhkM1pEUkNUbFZDVEV4M2JTdFZTbTg0YTFwNVpEVkphQ3RyV0Rsdk9GQm9SMGREY2t4bVRHNXVZM1pXSzFkUk4xRlVNbTVwZEZodGJFVTROVGRsTWtWdVRIZ3JObkp5VDFoU1RtaHdlbWhzT0cxS1JWTnBTbkJaSzBsWVoxZFFkV2hNUVhkSFkwMDBaM0l3WXpoekswaHNVVEpwVDJzNGFEbFdWRWcxYTJGaGNsQnBTbTFsZWtKYWFHb3hMMGRqVkdWa1VuaG5lVlZhVGtselpGZDVPV3RqYlV4dlYzTndWbU40TWxaSVdqaG5aRXRwY1N0b1p6MDlJaXdpYldGaklqb2lZVGhoWlRoallqWTRNRFkxTldZd1lXTTNNekl4T1dFeE5qTTVZVE0yWmpreU1EVTVNR1E0TlRObFlUazVZek16WlRnNVlXTm1Zamc0T0dRM1pEa3dOU0lzSW5SaFp5STZJaUo5fGFjNjI4YjMzZTU2Mjg4ZmU2NTVkMGVlNTU0YTNhNzhjZmYzNThmN2Q5MDMwYzAwNzg0ZTdhZWJiYzZkMDc2ZjY=\"],\"accept-language\":[\"*\"],\"sec-fetch-mode\":[\"cors\"],\"user-agent\":[\"node\"],\"accept-encoding\":[\"gzip, deflate\"],\"content-length\":[\"0\"]}',NULL,NULL,'200'),(14,NULL,'2025-12-05 13:08:26',NULL,NULL,2,5,'authentication','login_successful','info','{\"email\":\"e.technologiesy1@gmail.com\"}','node','127.0.0.1','POST','http://localhost:8000/api/V1/auth/verify-otp?email=e.technologiesy1%40gmail.com&ip_address=41.209.3.22&otp=882084','{\"host\":[\"localhost:8000\"],\"connection\":[\"keep-alive\"],\"content-type\":[\"application\\/json\"],\"accept\":[\"application\\/json\"],\"ocp-apim-subscription-key\":[\"a9e34b351a90e8b21d87eff48d279928\"],\"accept-language\":[\"*\"],\"sec-fetch-mode\":[\"cors\"],\"user-agent\":[\"node\"],\"accept-encoding\":[\"gzip, deflate\"],\"content-length\":[\"0\"]}',NULL,NULL,'200'),(15,NULL,'2025-12-05 13:11:22',NULL,NULL,2,5,'authentication','logout_successful','info','{\"email\":\"e.technologiesy1@gmail.com\"}','node','127.0.0.1','POST','http://localhost:8000/api/V1/auth/user-logout','{\"host\":[\"localhost:8000\"],\"connection\":[\"keep-alive\"],\"accept\":[\"application\\/json\"],\"cookie\":[\"k-o-t=ZXlKcGRpSTZJaXRqTUVoSU0weFhUMWs0VVdkR2RUQTRZelpFU25jOVBTSXNJblpoYkhWbElqb2lRamw2UTJGbVRIaGFjREJ6ZVROUVlUVkdUVlJ2ZEZZNVQzRlVXV2gzY2xCUk1YWTJiV0ZtVGxrMU9XcEZhRFF6ZVVaTVZrSnhkVU5ETkhWSlQwUnRVVUpzT0cxeE1uSTBWMmhTYlVwaFVXaDNXRE53VTFWdVpITk9WalZQTlUwMVJsRm1hbFJXWkc1cE9HVlhVSGMxYlhSdGVrZFRNbEZIY0hGRFdEZG1kVFJoWkRkV1pEQjRMMnQyVlV3eVJIbExaR1F3Y3pGdUwzTTJaVFkwYjI1RlJrRllLMnB2YUZKMmRsWnZORlV6WjBsSk5FcFZXa3hRY21RNFprcGpLM3B6ZWtaS2FFdHBXVzAwZUhKNE1HMXdWR1kxZURCWWR6MDlJaXdpYldGaklqb2lNR0kxTTJNMU9EUXdNbU5qWVRFeE5qUTVaVFpoWldJek5EWmtaams0T0dKaU9EZ3pNMk0wT1RnME5HUmlZemd3TUdOa09EY3pZakF3WlRZeE9XWTBZeUlzSW5SaFp5STZJaUo5fDA2MmQ3NWY5MThkMzhlZDA4MTIzNDQ4OTBlNmU5ZDYyZGNkODAxNjE2YTA5MGQ2MGFkMDcyMDY5OTg3MmNiMTY=\"],\"accept-language\":[\"*\"],\"sec-fetch-mode\":[\"cors\"],\"user-agent\":[\"node\"],\"accept-encoding\":[\"gzip, deflate\"],\"content-length\":[\"0\"]}',NULL,NULL,'200'),(16,NULL,'2025-12-05 13:12:28',NULL,NULL,2,5,'authentication','login_successful','info','{\"email\":\"e.technologiesy1@gmail.com\"}','node','127.0.0.1','POST','http://localhost:8000/api/V1/auth/verify-otp?email=e.technologiesy1%40gmail.com&ip_address=41.209.3.22&otp=433663','{\"host\":[\"localhost:8000\"],\"connection\":[\"keep-alive\"],\"content-type\":[\"application\\/json\"],\"accept\":[\"application\\/json\"],\"ocp-apim-subscription-key\":[\"a9e34b351a90e8b21d87eff48d279928\"],\"accept-language\":[\"*\"],\"sec-fetch-mode\":[\"cors\"],\"user-agent\":[\"node\"],\"accept-encoding\":[\"gzip, deflate\"],\"content-length\":[\"0\"]}',NULL,NULL,'200'),(17,NULL,'2025-12-05 13:15:50',NULL,NULL,2,1,'authentication','logout_successful','info','{\"email\":\"e.technologiesy1@gmail.com\"}','node','127.0.0.1','POST','http://localhost:8000/api/V1/auth/user-logout','{\"host\":[\"localhost:8000\"],\"connection\":[\"keep-alive\"],\"accept\":[\"application\\/json\"],\"cookie\":[\"k-o-t=ZXlKcGRpSTZJalJUTlRSUFJqUmhSMWhNTm5KSk1YaGpPRk5QU0djOVBTSXNJblpoYkhWbElqb2lZVmQwV1ZKSFRXeE9NRXBpTTNwaWJXWmxURmh2WW1KM2J6UlZSa2Q2TVVkblNtMHlNMmxEWldKbVlVczBNRlJrVWs5a1JtdzRiMXB4TTA4clVFVTJjaTl1YVVGVlQydG5kRlk1YjNSemJHMTRaeko2ZDJVMFFUbDJhbXRuSzJWcWVFODBNV0ZOWTNoWWMwRTFVMFJpWVdWdlpucHFUSE5VVkUwd1lrNW9kWGg1VkN0aVZrOVZNMWQwVTJGamRqaE1TbEpXWmxaS2VDOVpVMUY1V0dGbFJDOUVNR0UwUTJWWVJWSnZjVFpsY25SbFZITjNlVEZ0U1M5aVNYQnphRGN5UTI5VldHdEllVk5KTVhaWWMyMXVOblJHZERabWR6MDlJaXdpYldGaklqb2lNakZsTWpBME1ERTJaR0kwT1RkbE5HSTBPREV5T0Rsak0ySmpPR1JqT0RnNU1EUTVPVGd6WlRZeVpUUmpNMlEzWmpneVpXWmhNMlUwTXpNeU1tTTVZaUlzSW5SaFp5STZJaUo5fDcwY2QzZWMwZDI5ZDNkNTAzZTZmMGExMjA0M2ZiNjNiZjQ3YjA3ODA0MGY1NGNiNWI3MmFhODBkZjYwZTgzYjA=\"],\"accept-language\":[\"*\"],\"sec-fetch-mode\":[\"cors\"],\"user-agent\":[\"node\"],\"accept-encoding\":[\"gzip, deflate\"],\"content-length\":[\"0\"]}',NULL,NULL,'200'),(18,NULL,'2025-12-05 13:16:38',NULL,NULL,2,1,'authentication','login_successful','info','{\"email\":\"e.technologiesy1@gmail.com\"}','node','127.0.0.1','POST','http://localhost:8000/api/V1/auth/verify-otp?email=e.technologiesy1%40gmail.com&ip_address=41.209.3.22&otp=271708','{\"host\":[\"localhost:8000\"],\"connection\":[\"keep-alive\"],\"content-type\":[\"application\\/json\"],\"accept\":[\"application\\/json\"],\"ocp-apim-subscription-key\":[\"a9e34b351a90e8b21d87eff48d279928\"],\"accept-language\":[\"*\"],\"sec-fetch-mode\":[\"cors\"],\"user-agent\":[\"node\"],\"accept-encoding\":[\"gzip, deflate\"],\"content-length\":[\"0\"]}',NULL,NULL,'200');
/*!40000 ALTER TABLE `activitylogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `analysis`
--

DROP TABLE IF EXISTS `analysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analysis` (
  `Oid` char(38) NOT NULL,
  `DimensionPropertiesString` longtext DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Criteria` longtext DEFAULT NULL,
  `ObjectTypeName` longtext DEFAULT NULL,
  `ChartSettingsContent` longblob DEFAULT NULL,
  `PivotGridSettingsContent` longblob DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_Analysis` (`GCRecord`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analysis`
--

LOCK TABLES `analysis` WRITE;
/*!40000 ALTER TABLE `analysis` DISABLE KEYS */;
/*!40000 ALTER TABLE `analysis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditdataitempersistent`
--

DROP TABLE IF EXISTS `auditdataitempersistent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditdataitempersistent` (
  `Oid` char(38) NOT NULL,
  `UserName` varchar(100) DEFAULT NULL,
  `ModifiedOn` datetime DEFAULT NULL,
  `OperationType` varchar(100) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `AuditedObject` char(38) DEFAULT NULL,
  `OldObject` char(38) DEFAULT NULL,
  `NewObject` char(38) DEFAULT NULL,
  `OldValue` text DEFAULT NULL,
  `NewValue` text DEFAULT NULL,
  `PropertyName` varchar(100) DEFAULT NULL,
  `UserId` varchar(100) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iUserName_AuditDataItemPersistent` (`UserName`),
  KEY `iModifiedOn_AuditDataItemPersistent` (`ModifiedOn`),
  KEY `iOperationType_AuditDataItemPersistent` (`OperationType`),
  KEY `iGCRecord_AuditDataItemPersistent` (`GCRecord`),
  KEY `iAuditedObject_AuditDataItemPersistent` (`AuditedObject`),
  KEY `iOldObject_AuditDataItemPersistent` (`OldObject`),
  KEY `iNewObject_AuditDataItemPersistent` (`NewObject`),
  CONSTRAINT `FK_AuditDataItemPersistent_AuditedObject` FOREIGN KEY (`AuditedObject`) REFERENCES `auditedobjectweakreference` (`Oid`),
  CONSTRAINT `FK_AuditDataItemPersistent_NewObject` FOREIGN KEY (`NewObject`) REFERENCES `xpweakreference` (`Oid`),
  CONSTRAINT `FK_AuditDataItemPersistent_OldObject` FOREIGN KEY (`OldObject`) REFERENCES `xpweakreference` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditdataitempersistent`
--

LOCK TABLES `auditdataitempersistent` WRITE;
/*!40000 ALTER TABLE `auditdataitempersistent` DISABLE KEYS */;
INSERT INTO `auditdataitempersistent` VALUES ('018a507a-afec-41e4-9937-8b7c838004c6','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanAccessFinancials; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanAccessFinancials','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('02064742-7f6f-453f-baa5-77c4f00fb8b7','Admin','2025-12-05 13:10:28','AddedToCollection','AddedToCollection; ETECH; UserRoles; 4; N/A','9408504c-fae9-408b-9ff1-3a78685689ba','15abc012-b6c2-40aa-a56c-49005e1a8c61',NULL,'4','N/A','UserRoles','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('03fdc4be-c805-46d7-8c4b-63550572cbad','Admin','2025-12-05 13:14:39','ObjectDeleted','ObjectDeleted; 1; N/A; N/A; N/A',NULL,NULL,NULL,'N/A','N/A','','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('05db902f-4543-4c84-ac7f-da9ce7cb731d','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanManageUploads; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanManageUploads','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('0813a43b-8086-4dce-8552-99d950b37cac','Admin','2025-12-05 13:14:39','ObjectDeleted','ObjectDeleted; 1; N/A; N/A; N/A',NULL,NULL,NULL,'N/A','N/A','','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('0b954fed-cafb-401a-b4f4-2f0f16a58145','Admin','2025-12-05 13:14:39','RemovedFromCollection','RemovedFromCollection; Broker; UsersRole; 1; N/A','73e6aede-6705-4bf2-a930-3a8a3a24ab48','526b51d1-9722-4457-84cb-dd92cab5510b',NULL,'1','N/A','UsersRole','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('25f53a04-17a6-4572-8760-55772e1ac172','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanDeleteUserAccount; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanDeleteUserAccount','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('2a29bff5-f09d-4f5d-984b-e198704bc799','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanViewUserAccounts; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanViewUserAccounts','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('2b67de52-b969-4051-8a16-f5349a17223a','Admin','2025-12-05 13:06:10','AddedToCollection','AddedToCollection; ETECH; UserRoles; 3; N/A','9408504c-fae9-408b-9ff1-3a78685689ba','d3546401-8d5b-42a6-a8b9-f0712186af60',NULL,'3','N/A','UserRoles','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('31119f23-7b41-4d7d-9703-94f0b9efec4b','Admin','2025-12-05 13:06:15','RemovedFromCollection','RemovedFromCollection; ETECH; UserRoles; 3; N/A','9408504c-fae9-408b-9ff1-3a78685689ba','36c9b22a-a03d-4e37-a57f-b8739be75cc5',NULL,'3','N/A','UserRoles','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('33913105-6e37-4421-af43-7321e79e50cb','Admin','2025-12-04 18:59:03','InitialValueAssigned','InitialValueAssigned; (Default language); Owner; N/A; Admin','e08ddf1a-6464-42cb-b487-9e67a7ee15b3',NULL,'ff42227b-74a7-4e65-b54b-80055517e5ee','N/A','Admin','Owner','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('379a86c0-ec43-4fcf-a4e8-40d4ccb17c1a','Admin','2025-12-05 13:06:10','AddedToCollection','AddedToCollection; Admin; UsersRole; 3; N/A','95bffe7c-7756-4f12-bcee-52cced2d4f93','ba014393-e650-4635-91c7-dd3c0b435482',NULL,'3','N/A','UsersRole','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('3edf966f-8d89-44b1-876b-37c9ea5d61f2','Admin','2025-12-05 13:10:28','ObjectCreated','ObjectCreated; 0; N/A; N/A; N/A','3f51df32-de3b-42d0-8128-25fee68492ed',NULL,NULL,'N/A','N/A','','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('41162b1d-2734-42cf-bd93-7293ac571b34','Admin','2025-12-05 13:06:10','ObjectCreated','ObjectCreated; 0; N/A; N/A; N/A','fe0a1c41-566f-4508-96bd-639366507656',NULL,NULL,'N/A','N/A','','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('43ea4ddb-4cca-46a5-9567-f6585d4925ed','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanAccessAllTransactions; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanAccessAllTransactions','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('4c95d830-164b-4b6c-bafe-b9ec80f13175','Admin','2025-12-05 13:14:29','ObjectChanged','ObjectChanged; 2; ActiveRole; Broker; Admin','349e3e2b-9d24-4ac3-8050-9425ad7fc1cc','1a726f11-0db6-44dc-9e18-f41cf60ea9cf','bf653bd9-7384-4b54-8909-38f31a39106a','Broker','Admin','ActiveRole','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('50155c8c-79e4-4fc6-bc30-99645b6f2f0f','Admin','2025-12-04 18:43:04','ObjectChanged','ObjectChanged; 1; IsActive; False; True','8f2386b5-0bfe-43ce-b102-d8eebbd049b6',NULL,NULL,'False','True','IsActive','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('51e20e02-ae6a-40bc-af3a-de104d900669','Admin','2025-12-04 18:59:03','CollectionObjectChanged','CollectionObjectChanged; Admin; Aspects; (Default language); N/A','a833ea61-8a30-4bcd-94b6-a5b41fddfc45','331c7283-f1c1-46e7-a8b9-f0e33963f5b6',NULL,'(Default language)','N/A','Aspects','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('51e30ffe-fc87-4f7a-afab-4be6a5945169','Admin','2025-12-04 18:59:03','AddedToCollection','AddedToCollection; Admin; Aspects; (Default language); N/A','a833ea61-8a30-4bcd-94b6-a5b41fddfc45','152b4a83-625b-44c3-a396-f8f6e6092077',NULL,'(Default language)','N/A','Aspects','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('57c6cca5-25a5-42d6-a75e-c549b0ae0844','Admin','2025-12-05 13:14:39','RemovedFromCollection','RemovedFromCollection; ETECH; UserRoles; 1; N/A','9408504c-fae9-408b-9ff1-3a78685689ba','dae0b260-6a95-416f-83e4-dcbc00f6a7fc',NULL,'1','N/A','UserRoles','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('5a01198b-8c26-4b47-89c1-7c7eeca7201b','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanViewInvoices; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanViewInvoices','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('5a7c3560-6c7f-45f7-95bd-ea686ba1c846','Admin','2025-12-04 18:59:02','ObjectCreated','ObjectCreated; Admin; N/A; N/A; N/A','a833ea61-8a30-4bcd-94b6-a5b41fddfc45',NULL,NULL,'N/A','N/A','','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('5d2f79f6-9c97-418c-b0c2-3392a0b547e9','Admin','2025-12-04 18:59:02','ObjectCreated','ObjectCreated; (Default language); N/A; N/A; N/A','e08ddf1a-6464-42cb-b487-9e67a7ee15b3',NULL,NULL,'N/A','N/A','','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('5da4e9ed-f9c8-4634-938f-d79018e1b3b4','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; Role; Broker; Admin','c66a3dda-f8ec-4fd4-8245-059dad12a2d8','ac800ddf-b9c8-4efd-8d0a-0b2f98ad1102','5cbe18bb-0466-48f1-8b18-4078c7833db3','Broker','Admin','Role','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('63bd0646-8c6a-493e-a800-71be0c9ec4a9','Admin','2025-12-05 13:10:28','InitialValueAssigned','InitialValueAssigned; 4; Role; N/A; Admin','3f51df32-de3b-42d0-8128-25fee68492ed',NULL,'7f8f06ba-3003-4b8f-af81-64ad6c9f4a8c','N/A','Admin','Role','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('65e09ed1-db53-44b2-b473-4b411dd29df4','Admin','2025-12-05 13:10:28','AddedToCollection','AddedToCollection; Admin; UsersRole; 4; N/A','95bffe7c-7756-4f12-bcee-52cced2d4f93','18270697-f1e9-4e95-a5c6-eb06562bad70',NULL,'4','N/A','UsersRole','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('6981a118-3390-4f07-8fe1-3f272e9dc970','Admin','2025-12-05 13:13:48','AddedToCollection','AddedToCollection; Admin; Permissions; 1; N/A','95bffe7c-7756-4f12-bcee-52cced2d4f93','5cf8d3cc-8e13-4d10-a5aa-5ee4b9bac263',NULL,'1','N/A','Permissions','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('6c619d4d-c9f4-4ec4-83ff-84ec91fe0f92','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanCreateSubscriptionPackage; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanCreateSubscriptionPackage','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('7f882578-7015-48fd-a5b7-8648b53f8221','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanAccessInvoices; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanAccessInvoices','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('9b6dc872-5cda-41c2-b9ef-a1b22acf7b12','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanCreateUserAccount; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanCreateUserAccount','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('a306bc2b-3c08-4923-8dae-37e542506281','Admin','2025-12-05 13:05:01','ObjectChanged','ObjectChanged; ETECH; UserName; N/A; ETECH','9408504c-fae9-408b-9ff1-3a78685689ba',NULL,NULL,'N/A','ETECH','UserName','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('a8801944-f650-465a-b36e-9a81a8c8dcf1','Admin','2025-12-04 18:59:03','InitialValueAssigned','InitialValueAssigned; (Default language); Xml; N/A; <?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<Application>\r\n  <SchemaModules>\r\n    <SchemaModule Name=\"CloneObjectModule\" Version=\"24.1.6.0\" IsNewNode=\"True\" />\r\n    <SchemaModule Name=\"SchedulerBlazorModule\" Version=\"24.1.6.0\" IsNewNode=\"True\" />\r\n    <SchemaModule Name=\"SchedulerModuleBase\" Version=\"24.1.6.0\" IsNewNode=\"True\" />\r\n    <SchemaModule Name=\"SystemModule\" Version=\"24.1.6.0\" IsNewNode=\"True\" />\r\n  </SchemaModules>\r\n</Application>','e08ddf1a-6464-42cb-b487-9e67a7ee15b3',NULL,NULL,'N/A','<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<Application>\r\n  <SchemaModules>\r\n    <SchemaModule Name=\"CloneObjectModule\" Version=\"24.1.6.0\" IsNewNode=\"True\" />\r\n    <SchemaModule Name=\"SchedulerBlazorModule\" Version=\"24.1.6.0\" IsNewNode=\"True\" />\r\n    <SchemaModule Name=\"SchedulerModuleBase\" Version=\"24.1.6.0\" IsNewNode=\"True\" />\r\n    <SchemaModule Name=\"SystemModule\" Version=\"24.1.6.0\" IsNewNode=\"True\" />\r\n  </SchemaModules>\r\n</Application>','Xml','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('b2846df6-11bb-4a04-b50e-15c095adc317','Admin','2025-12-05 13:13:48','RemovedFromCollection','RemovedFromCollection; Broker; Permissions; 1; N/A','73e6aede-6705-4bf2-a930-3a8a3a24ab48','2bb48315-0231-45ad-b5f9-9881838b1365',NULL,'1','N/A','Permissions','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('b78c5c61-f0af-42a6-90b2-031678cb17a0','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanViewAnalysis; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanViewAnalysis','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('bce22243-c7b4-4967-a5a8-50c20703018d','Admin','2025-12-05 13:10:28','InitialValueAssigned','InitialValueAssigned; 4; Id; N/A; 4','3f51df32-de3b-42d0-8128-25fee68492ed',NULL,NULL,'N/A','4','Id','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('bfded10f-2d32-403a-bbe3-3401b1321719','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanAccessAdmin; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanAccessAdmin','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('c0e033cb-a3d6-4461-956c-82b8bbe44388','Admin','2025-12-05 13:06:15','ObjectChanged','ObjectChanged; 3; User; ETECH; MWAS','fe0a1c41-566f-4508-96bd-639366507656','d8b1f4b3-2a0b-43ee-804f-2804b8cf7874','8f6327b1-0cc5-4aa5-bc67-11f629d7f49b','ETECH','MWAS','User','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('c4b56a6b-abde-4fea-998c-d39407474d47','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanResetPassword; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanResetPassword','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('c79df04f-994e-4ae4-b416-76c41a1deb58','Admin','2025-12-05 13:06:10','InitialValueAssigned','InitialValueAssigned; 3; User; N/A; ETECH','fe0a1c41-566f-4508-96bd-639366507656',NULL,'4c510f35-4d01-4161-8b52-55c26a96f679','N/A','ETECH','User','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('c85d577f-7454-4c0d-9d05-5e13595b54b5','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanManageAccounts; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanManageAccounts','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('d4ee1bc7-42bd-4b49-827e-2f98498514bc','Admin','2025-12-05 13:06:15','AddedToCollection','AddedToCollection; MWAS; UserRoles; 3; N/A','d50d12d0-3407-48c5-81cb-c5642d9b0213','deeb2acf-d5fd-448e-bf12-62e56acd4a58',NULL,'3','N/A','UserRoles','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('d57eb174-22c8-4c3d-8f3f-54b2f1e95b0c','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanAccessAnalysis; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanAccessAnalysis','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('d9e7b672-92a6-4224-9ef9-a6e8ecae4e50','Admin','2025-12-05 13:06:10','InitialValueAssigned','InitialValueAssigned; 3; Role; N/A; Admin','fe0a1c41-566f-4508-96bd-639366507656',NULL,'cb5a0bf5-7ae5-4375-b5c6-c8068f23191a','N/A','Admin','Role','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('db4e9f22-3d67-4e91-94ec-3a05ea4dcba5','Admin','2025-12-04 18:59:02','InitialValueAssigned','InitialValueAssigned; Admin; Version; N/A; 0','a833ea61-8a30-4bcd-94b6-a5b41fddfc45',NULL,NULL,'N/A','0','Version','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('dda7d6b1-6712-49ef-bf50-29eab3f77a9b','Admin','2025-12-05 13:10:28','InitialValueAssigned','InitialValueAssigned; 4; User; N/A; ETECH','3f51df32-de3b-42d0-8128-25fee68492ed',NULL,'dc3c414f-ef6c-4afa-8d88-edb93a56c39f','N/A','ETECH','User','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('e0abd37f-7ade-419c-acf3-ab9cc73f2293','Admin','2025-12-04 18:59:02','InitialValueAssigned','InitialValueAssigned; Admin; UserId; N/A; f3291dc2-b8ce-4114-b796-c8e47c63cf12','a833ea61-8a30-4bcd-94b6-a5b41fddfc45',NULL,NULL,'N/A','f3291dc2-b8ce-4114-b796-c8e47c63cf12','UserId','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('e309411a-b6a5-4195-b5c7-9e57dc65d85a','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanAccessActivityLogs; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanAccessActivityLogs','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('e51a6a9e-0981-433b-a8fe-07339b85528e','Admin','2025-12-05 13:06:10','InitialValueAssigned','InitialValueAssigned; 3; Id; N/A; 3','fe0a1c41-566f-4508-96bd-639366507656',NULL,NULL,'N/A','3','Id','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('e8faf131-c4c5-4829-9f6f-29350d07b713','Admin','2025-12-05 13:05:29','ObjectChanged','ObjectChanged; MWAS; UserName; N/A; MWAS','d50d12d0-3407-48c5-81cb-c5642d9b0213',NULL,NULL,'N/A','MWAS','UserName','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('eff1d5e3-aca2-4156-a617-dc15d239768a','Admin','2025-12-04 18:59:02','InitialValueAssigned','InitialValueAssigned; Admin; ContextId; N/A; Blazor','a833ea61-8a30-4bcd-94b6-a5b41fddfc45',NULL,NULL,'N/A','Blazor','ContextId','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('effa80f3-e232-4243-bd3c-70c5a504db4f','Admin','2025-12-05 13:13:48','ObjectChanged','ObjectChanged; 1; CanViewFinancials; False; True','c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,NULL,'False','True','CanViewFinancials','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL),('fb5c8583-39d4-407a-a4b3-bbec387ca867','Admin','2025-12-04 18:59:02','InitialValueAssigned','InitialValueAssigned; (Default language); Name; N/A; ','e08ddf1a-6464-42cb-b487-9e67a7ee15b3',NULL,NULL,'N/A','','Name','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0,NULL);
/*!40000 ALTER TABLE `auditdataitempersistent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditedobjectweakreference`
--

DROP TABLE IF EXISTS `auditedobjectweakreference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditedobjectweakreference` (
  `Oid` char(38) NOT NULL,
  `GuidId` char(38) DEFAULT NULL,
  `IntId` int(11) DEFAULT NULL,
  `DisplayName` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  CONSTRAINT `FK_AuditedObjectWeakReference_Oid` FOREIGN KEY (`Oid`) REFERENCES `xpweakreference` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditedobjectweakreference`
--

LOCK TABLES `auditedobjectweakreference` WRITE;
/*!40000 ALTER TABLE `auditedobjectweakreference` DISABLE KEYS */;
INSERT INTO `auditedobjectweakreference` VALUES ('349e3e2b-9d24-4ac3-8050-9425ad7fc1cc',NULL,2,'2'),('3f51df32-de3b-42d0-8128-25fee68492ed',NULL,4,'4'),('73e6aede-6705-4bf2-a930-3a8a3a24ab48',NULL,5,'Broker'),('8f2386b5-0bfe-43ce-b102-d8eebbd049b6',NULL,1,'1'),('9408504c-fae9-408b-9ff1-3a78685689ba',NULL,2,'ETECH'),('95bffe7c-7756-4f12-bcee-52cced2d4f93',NULL,1,'Admin'),('a833ea61-8a30-4bcd-94b6-a5b41fddfc45','ec4ad779-d0c1-46a4-b9b2-04d74fb9b24c',NULL,'Admin'),('c66a3dda-f8ec-4fd4-8245-059dad12a2d8',NULL,1,'1'),('d50d12d0-3407-48c5-81cb-c5642d9b0213',NULL,1,'MWAS'),('e08ddf1a-6464-42cb-b487-9e67a7ee15b3','d175f986-a9e3-4460-9f09-7fbce51d82ea',NULL,'(Default language)'),('fe0a1c41-566f-4508-96bd-639366507656',NULL,3,'3');
/*!40000 ALTER TABLE `auditedobjectweakreference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingdetails`
--

DROP TABLE IF EXISTS `billingdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingdetails` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `SubscriptionPlanId` int(11) DEFAULT NULL,
  `Days` int(11) DEFAULT NULL,
  `Currency` int(11) DEFAULT NULL,
  `UnitPrice` double DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_BillingDetails` (`created_by`),
  KEY `ialtered_by_BillingDetails` (`altered_by`),
  KEY `iSubscriptionPlanId_BillingDetails` (`SubscriptionPlanId`),
  KEY `iCurrency_BillingDetails` (`Currency`),
  CONSTRAINT `FK_BillingDetails_Currency` FOREIGN KEY (`Currency`) REFERENCES `currencymaintenance` (`Id`),
  CONSTRAINT `FK_BillingDetails_SubscriptionPlanId` FOREIGN KEY (`SubscriptionPlanId`) REFERENCES `subscriptionplan` (`Id`),
  CONSTRAINT `FK_BillingDetails_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_BillingDetails_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingdetails`
--

LOCK TABLES `billingdetails` WRITE;
/*!40000 ALTER TABLE `billingdetails` DISABLE KEYS */;
INSERT INTO `billingdetails` VALUES (1,NULL,NULL,NULL,NULL,'Daily','1 Day Subscription',1,1,NULL,2),(2,NULL,NULL,NULL,NULL,'Weekly','7 Days Subscription',1,7,NULL,10),(3,NULL,NULL,NULL,NULL,'Monthly','30 Days Subscription',1,30,NULL,40),(4,NULL,NULL,NULL,NULL,'Daily','1 Day Subscription',2,1,NULL,3),(5,NULL,NULL,NULL,NULL,'Weekly','7 Days Subscription',2,7,NULL,15),(6,NULL,NULL,NULL,NULL,'Monthly','30 Days Subscription',2,30,NULL,60),(7,NULL,NULL,NULL,NULL,'Daily','1 Day Subscription',3,1,NULL,5),(8,NULL,NULL,NULL,NULL,'Weekly','7 Days Subscription',3,7,NULL,25),(9,NULL,NULL,NULL,NULL,'Monthly','30 Days Subscription',3,30,NULL,100),(10,NULL,NULL,NULL,NULL,'Daily','1 Day Subscription',4,1,NULL,8),(11,NULL,NULL,NULL,NULL,'Weekly','7 Days Subscription',4,7,NULL,40),(12,NULL,NULL,NULL,NULL,'Monthly','30 Days Subscription',4,30,NULL,160);
/*!40000 ALTER TABLE `billingdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cmalist`
--

DROP TABLE IF EXISTS `cmalist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cmalist` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `LicenseNo` varchar(100) DEFAULT NULL,
  `Website` varchar(100) DEFAULT NULL,
  `IsBroker` bit(1) DEFAULT NULL,
  `IsAuthorizedDealer` bit(1) DEFAULT NULL,
  `IsFundManager` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_CMAList` (`created_by`),
  KEY `ialtered_by_CMAList` (`altered_by`),
  CONSTRAINT `FK_CMAList_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_CMAList_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cmalist`
--

LOCK TABLES `cmalist` WRITE;
/*!40000 ALTER TABLE `cmalist` DISABLE KEYS */;
INSERT INTO `cmalist` VALUES (1,NULL,NULL,NULL,NULL,'EMM Brokers','Brokers LIMITED','100','https://www.gmail.com/',_binary '',_binary '\0',_binary '\0'),(2,NULL,NULL,NULL,NULL,'EMM Dealers','Dealers LIMITED','100','https://www.gmail.com/',_binary '\0',_binary '',_binary '\0'),(3,NULL,NULL,NULL,NULL,'EMM FundManager','FundManager LIMITED','100','https://www.gmail.com/',_binary '\0',_binary '\0',_binary ''),(4,NULL,NULL,NULL,NULL,'AIB-AXYS Africa Limited','','119','https://www.aib-axysafrica.com/',_binary '',_binary '\0',_binary '\0'),(5,NULL,NULL,NULL,NULL,'EGM Securities Limited (Trading as \"FX Pesa\")','','120','https://www.fxpesa.com/',_binary '',_binary '\0',_binary '\0'),(6,NULL,NULL,NULL,NULL,'Faida Investment Bank Limited','','121','https://fib.co.ke/',_binary '',_binary '\0',_binary '\0'),(7,NULL,NULL,NULL,NULL,'Genghis Capital Limited','','122','https://www.genghis-capital.com/',_binary '',_binary '\0',_binary '\0'),(8,NULL,NULL,NULL,NULL,'Kingdom Securities Limited','','123','https://kingdomsecurities.co.ke/',_binary '',_binary '\0',_binary '\0'),(9,NULL,NULL,NULL,NULL,'SCFM Limited (Trading as \"Scope Markets\")','','124','https://www.scopemarkets.co.ke/',_binary '',_binary '\0',_binary '\0'),(10,NULL,NULL,NULL,NULL,'Standard Investment Bank Limited','','125','https://www.sib.co.ke/',_binary '',_binary '\0',_binary '\0'),(11,NULL,NULL,NULL,NULL,'Sterling Capital Limited','','126','https://sterlingib.com/',_binary '',_binary '\0',_binary '\0'),(12,NULL,NULL,NULL,NULL,'NCBA Investment Bank Limited','','127','',_binary '',_binary '\0',_binary '\0'),(13,NULL,NULL,NULL,NULL,'Dyer and Blair Investment Bank Limited','','128','https://www.dyerandblair.com/',_binary '',_binary '\0',_binary '\0'),(14,NULL,NULL,NULL,NULL,'SBG Securities Limited','','129','https://www.sbgsecurities.co.ke/sbgsecurities/securities',_binary '',_binary '\0',_binary '\0'),(15,NULL,NULL,NULL,NULL,'Kestrel Capital (East Africa) Limited','','130','https://www.kestrelcapital.com/',_binary '',_binary '\0',_binary '\0'),(16,NULL,NULL,NULL,NULL,'Standard Chartered (Kenya) Plc','','109','https://www.sc.com/ke/',_binary '\0',_binary '',_binary '\0'),(17,NULL,NULL,NULL,NULL,'SBM Bank (Kenya) Limited','','122','https://www.sbmbank.co.ke/',_binary '\0',_binary '',_binary '\0'),(18,NULL,NULL,NULL,NULL,'Private Wealth Capital Limited','','167','https://privatewealth.co.ke/',_binary '\0',_binary '',_binary '\0'),(19,NULL,NULL,NULL,NULL,'AKN Investment Limited','','211','',_binary '\0',_binary '',_binary '\0');
/*!40000 ALTER TABLE `cmalist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companyinformation`
--

DROP TABLE IF EXISTS `companyinformation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companyinformation` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `CompanyName` varchar(100) DEFAULT NULL,
  `Prefix` varchar(100) DEFAULT NULL,
  `Telephone` varchar(100) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `PhysicalAddress` varchar(100) DEFAULT NULL,
  `Website` varchar(100) DEFAULT NULL,
  `LockDetails` bit(1) DEFAULT NULL,
  `Logo` longblob DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_CompanyInformation` (`created_by`),
  KEY `ialtered_by_CompanyInformation` (`altered_by`),
  CONSTRAINT `FK_CompanyInformation_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_CompanyInformation_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companyinformation`
--

LOCK TABLES `companyinformation` WRITE;
/*!40000 ALTER TABLE `companyinformation` DISABLE KEYS */;
INSERT INTO `companyinformation` VALUES (1,NULL,NULL,NULL,NULL,'BONDKONNECT','BK','123-456-789','info@bondkonnect.com','123 Tech Park, NAIROBI','www.bondkonnect.com',_binary '\0',NULL);
/*!40000 ALTER TABLE `companyinformation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currencymaintenance`
--

DROP TABLE IF EXISTS `currencymaintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currencymaintenance` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `CurrencyName` varchar(100) DEFAULT NULL,
  `Prefix` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_CurrencyMaintenance` (`created_by`),
  KEY `ialtered_by_CurrencyMaintenance` (`altered_by`),
  CONSTRAINT `FK_CurrencyMaintenance_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_CurrencyMaintenance_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currencymaintenance`
--

LOCK TABLES `currencymaintenance` WRITE;
/*!40000 ALTER TABLE `currencymaintenance` DISABLE KEYS */;
/*!40000 ALTER TABLE `currencymaintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dashboarddata`
--

DROP TABLE IF EXISTS `dashboarddata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dashboarddata` (
  `Oid` char(38) NOT NULL,
  `Content` longtext DEFAULT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `SynchronizeTitle` bit(1) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_DashboardData` (`GCRecord`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dashboarddata`
--

LOCK TABLES `dashboarddata` WRITE;
/*!40000 ALTER TABLE `dashboarddata` DISABLE KEYS */;
/*!40000 ALTER TABLE `dashboarddata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emaillogs`
--

DROP TABLE IF EXISTS `emaillogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emaillogs` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Recipient` int(11) DEFAULT NULL,
  `AllRecipientsEmails` longtext DEFAULT NULL,
  `Subject` varchar(100) DEFAULT NULL,
  `Body` longtext DEFAULT NULL,
  `CC` longtext DEFAULT NULL,
  `BCC` longtext DEFAULT NULL,
  `ScheduleDate` datetime DEFAULT NULL,
  `RoleGroupSendingTo` int(11) DEFAULT NULL,
  `IsDraft` bit(1) DEFAULT NULL,
  `IsSent` bit(1) DEFAULT NULL,
  `IsFromSystem` bit(1) DEFAULT NULL,
  `IsBulkEmail` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_EmailLogs` (`created_by`),
  KEY `ialtered_by_EmailLogs` (`altered_by`),
  KEY `iRecipient_EmailLogs` (`Recipient`),
  KEY `iRoleGroupSendingTo_EmailLogs` (`RoleGroupSendingTo`),
  CONSTRAINT `FK_EmailLogs_Recipient` FOREIGN KEY (`Recipient`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_EmailLogs_RoleGroupSendingTo` FOREIGN KEY (`RoleGroupSendingTo`) REFERENCES `roles` (`Id`),
  CONSTRAINT `FK_EmailLogs_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_EmailLogs_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emaillogs`
--

LOCK TABLES `emaillogs` WRITE;
/*!40000 ALTER TABLE `emaillogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `emaillogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emailsettings`
--

DROP TABLE IF EXISTS `emailsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emailsettings` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `EmailNotificationMailHost` varchar(100) DEFAULT NULL,
  `EmailNotificationMailHostPort` varchar(100) DEFAULT NULL,
  `EmailNotificationMailPassword` varchar(100) DEFAULT NULL,
  `EmailNotificationMailUsername` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_EmailSettings` (`created_by`),
  KEY `ialtered_by_EmailSettings` (`altered_by`),
  CONSTRAINT `FK_EmailSettings_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_EmailSettings_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emailsettings`
--

LOCK TABLES `emailsettings` WRITE;
/*!40000 ALTER TABLE `emailsettings` DISABLE KEYS */;
INSERT INTO `emailsettings` VALUES (1,NULL,NULL,NULL,NULL,'mail.finesolconsult.com','465','l30LIalr1pn2','admin@finesolconsult.com');
/*!40000 ALTER TABLE `emailsettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `Oid` char(38) NOT NULL,
  `ResourceIds` longtext DEFAULT NULL,
  `RecurrencePattern` char(38) DEFAULT NULL,
  `Subject` varchar(250) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `StartOn` datetime DEFAULT NULL,
  `EndOn` datetime DEFAULT NULL,
  `AllDay` bit(1) DEFAULT NULL,
  `Location` varchar(100) DEFAULT NULL,
  `Label` int(11) DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `Type` int(11) DEFAULT NULL,
  `RemindIn` double DEFAULT NULL,
  `ReminderInfoXml` varchar(200) DEFAULT NULL,
  `AlarmTime` datetime DEFAULT NULL,
  `IsPostponed` bit(1) DEFAULT NULL,
  `RecurrenceInfoXml` longtext DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iStartOn_Event` (`StartOn`),
  KEY `iEndOn_Event` (`EndOn`),
  KEY `iGCRecord_Event` (`GCRecord`),
  KEY `iRecurrencePattern_Event` (`RecurrencePattern`),
  CONSTRAINT `FK_Event_RecurrencePattern` FOREIGN KEY (`RecurrencePattern`) REFERENCES `event` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq`
--

DROP TABLE IF EXISTS `faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faq` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `IsActive` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_FAQ` (`created_by`),
  KEY `ialtered_by_FAQ` (`altered_by`),
  CONSTRAINT `FK_FAQ_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_FAQ_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faq`
--

LOCK TABLES `faq` WRITE;
/*!40000 ALTER TABLE `faq` DISABLE KEYS */;
/*!40000 ALTER TABLE `faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `filedata`
--

DROP TABLE IF EXISTS `filedata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `filedata` (
  `Oid` char(38) NOT NULL,
  `size` int(11) DEFAULT NULL,
  `FileName` text DEFAULT NULL,
  `Content` longblob DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_FileData` (`GCRecord`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `filedata`
--

LOCK TABLES `filedata` WRITE;
/*!40000 ALTER TABLE `filedata` DISABLE KEYS */;
/*!40000 ALTER TABLE `filedata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `graphtable`
--

DROP TABLE IF EXISTS `graphtable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `graphtable` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Date` datetime DEFAULT NULL,
  `Year` varchar(100) DEFAULT NULL,
  `SpotRate` varchar(100) DEFAULT NULL,
  `NseRate` varchar(100) DEFAULT NULL,
  `UpperBand` varchar(100) DEFAULT NULL,
  `LowerBand` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_GraphTable` (`created_by`),
  KEY `ialtered_by_GraphTable` (`altered_by`),
  CONSTRAINT `FK_GraphTable_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_GraphTable_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `graphtable`
--

LOCK TABLES `graphtable` WRITE;
/*!40000 ALTER TABLE `graphtable` DISABLE KEYS */;
/*!40000 ALTER TABLE `graphtable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hcategory`
--

DROP TABLE IF EXISTS `hcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hcategory` (
  `Oid` char(38) NOT NULL,
  `Parent` char(38) DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_HCategory` (`GCRecord`),
  KEY `iParent_HCategory` (`Parent`),
  CONSTRAINT `FK_HCategory_Parent` FOREIGN KEY (`Parent`) REFERENCES `hcategory` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hcategory`
--

LOCK TABLES `hcategory` WRITE;
/*!40000 ALTER TABLE `hcategory` DISABLE KEYS */;
/*!40000 ALTER TABLE `hcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpidefinition`
--

DROP TABLE IF EXISTS `kpidefinition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kpidefinition` (
  `Oid` char(38) NOT NULL,
  `TargetObjectType` longtext DEFAULT NULL,
  `Changed` datetime DEFAULT NULL,
  `KpiInstance` char(38) DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Active` bit(1) DEFAULT NULL,
  `Criteria` longtext DEFAULT NULL,
  `Expression` longtext DEFAULT NULL,
  `GreenZone` double DEFAULT NULL,
  `RedZone` double DEFAULT NULL,
  `Range` varchar(100) DEFAULT NULL,
  `Compare` bit(1) DEFAULT NULL,
  `RangeToCompare` varchar(100) DEFAULT NULL,
  `MeasurementFrequency` int(11) DEFAULT NULL,
  `MeasurementMode` int(11) DEFAULT NULL,
  `Direction` int(11) DEFAULT NULL,
  `ChangedOn` datetime DEFAULT NULL,
  `SuppressedSeries` varchar(100) DEFAULT NULL,
  `EnableCustomizeRepresentation` bit(1) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_KpiDefinition` (`GCRecord`),
  KEY `iKpiInstance_KpiDefinition` (`KpiInstance`),
  CONSTRAINT `FK_KpiDefinition_KpiInstance` FOREIGN KEY (`KpiInstance`) REFERENCES `kpiinstance` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpidefinition`
--

LOCK TABLES `kpidefinition` WRITE;
/*!40000 ALTER TABLE `kpidefinition` DISABLE KEYS */;
/*!40000 ALTER TABLE `kpidefinition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpihistoryitem`
--

DROP TABLE IF EXISTS `kpihistoryitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kpihistoryitem` (
  `Oid` char(38) NOT NULL,
  `KpiInstance` char(38) DEFAULT NULL,
  `RangeStart` datetime DEFAULT NULL,
  `RangeEnd` datetime DEFAULT NULL,
  `Value` double DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iKpiInstance_KpiHistoryItem` (`KpiInstance`),
  CONSTRAINT `FK_KpiHistoryItem_KpiInstance` FOREIGN KEY (`KpiInstance`) REFERENCES `kpiinstance` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpihistoryitem`
--

LOCK TABLES `kpihistoryitem` WRITE;
/*!40000 ALTER TABLE `kpihistoryitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `kpihistoryitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpiinstance`
--

DROP TABLE IF EXISTS `kpiinstance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kpiinstance` (
  `Oid` char(38) NOT NULL,
  `ForceMeasurementDateTime` datetime DEFAULT NULL,
  `KpiDefinition` char(38) DEFAULT NULL,
  `Settings` longtext DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_KpiInstance` (`GCRecord`),
  KEY `iKpiDefinition_KpiInstance` (`KpiDefinition`),
  CONSTRAINT `FK_KpiInstance_KpiDefinition` FOREIGN KEY (`KpiDefinition`) REFERENCES `kpidefinition` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpiinstance`
--

LOCK TABLES `kpiinstance` WRITE;
/*!40000 ALTER TABLE `kpiinstance` DISABLE KEYS */;
/*!40000 ALTER TABLE `kpiinstance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpiscorecard`
--

DROP TABLE IF EXISTS `kpiscorecard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kpiscorecard` (
  `Oid` char(38) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_KpiScorecard` (`GCRecord`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpiscorecard`
--

LOCK TABLES `kpiscorecard` WRITE;
/*!40000 ALTER TABLE `kpiscorecard` DISABLE KEYS */;
/*!40000 ALTER TABLE `kpiscorecard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpiscorecardscorecards_kpiinstanceindicators`
--

DROP TABLE IF EXISTS `kpiscorecardscorecards_kpiinstanceindicators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kpiscorecardscorecards_kpiinstanceindicators` (
  `Indicators` char(38) DEFAULT NULL,
  `Scorecards` char(38) DEFAULT NULL,
  `OID` char(38) NOT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  PRIMARY KEY (`OID`),
  UNIQUE KEY `iIndicatorsScorecards_KpiScorecardScorecards_KpiInstanc_87CEDA3B` (`Indicators`,`Scorecards`),
  KEY `iIndicators_KpiScorecardScorecards_KpiInstanceIndicators` (`Indicators`),
  KEY `iScorecards_KpiScorecardScorecards_KpiInstanceIndicators` (`Scorecards`),
  CONSTRAINT `FK_KpiScorecardScorecards_KpiInstanceIndicators_Indicators` FOREIGN KEY (`Indicators`) REFERENCES `kpiinstance` (`Oid`),
  CONSTRAINT `FK_KpiScorecardScorecards_KpiInstanceIndicators_Scorecards` FOREIGN KEY (`Scorecards`) REFERENCES `kpiscorecard` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpiscorecardscorecards_kpiinstanceindicators`
--

LOCK TABLES `kpiscorecardscorecards_kpiinstanceindicators` WRITE;
/*!40000 ALTER TABLE `kpiscorecardscorecards_kpiinstanceindicators` DISABLE KEYS */;
/*!40000 ALTER TABLE `kpiscorecardscorecards_kpiinstanceindicators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leaveservice`
--

DROP TABLE IF EXISTS `leaveservice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leaveservice` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Colleague` int(11) DEFAULT NULL,
  `StartDate` datetime DEFAULT NULL,
  `EndDate` datetime DEFAULT NULL,
  `AssignedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_LeaveService` (`created_by`),
  KEY `ialtered_by_LeaveService` (`altered_by`),
  KEY `iColleague_LeaveService` (`Colleague`),
  KEY `iAssignedBy_LeaveService` (`AssignedBy`),
  CONSTRAINT `FK_LeaveService_AssignedBy` FOREIGN KEY (`AssignedBy`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_LeaveService_Colleague` FOREIGN KEY (`Colleague`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_LeaveService_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_LeaveService_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaveservice`
--

LOCK TABLES `leaveservice` WRITE;
/*!40000 ALTER TABLE `leaveservice` DISABLE KEYS */;
/*!40000 ALTER TABLE `leaveservice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leavetrailsoperations`
--

DROP TABLE IF EXISTS `leavetrailsoperations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leavetrailsoperations` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `LeaveServiceId` int(11) DEFAULT NULL,
  `Operation` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_LeaveTrailsOperations` (`created_by`),
  KEY `ialtered_by_LeaveTrailsOperations` (`altered_by`),
  KEY `iLeaveServiceId_LeaveTrailsOperations` (`LeaveServiceId`),
  CONSTRAINT `FK_LeaveTrailsOperations_LeaveServiceId` FOREIGN KEY (`LeaveServiceId`) REFERENCES `leaveservice` (`Id`),
  CONSTRAINT `FK_LeaveTrailsOperations_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_LeaveTrailsOperations_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leavetrailsoperations`
--

LOCK TABLES `leavetrailsoperations` WRITE;
/*!40000 ALTER TABLE `leavetrailsoperations` DISABLE KEYS */;
/*!40000 ALTER TABLE `leavetrailsoperations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `AssignedTo` int(11) DEFAULT NULL,
  `IsRead` bit(1) DEFAULT NULL,
  `IsEdited` bit(1) DEFAULT NULL,
  `IsActive` bit(1) DEFAULT NULL,
  `IsDelete` bit(1) DEFAULT NULL,
  `IsGroupChat` bit(1) DEFAULT NULL,
  `GroupName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_Message` (`created_by`),
  KEY `ialtered_by_Message` (`altered_by`),
  KEY `iAssignedTo_Message` (`AssignedTo`),
  CONSTRAINT `FK_Message_AssignedTo` FOREIGN KEY (`AssignedTo`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_Message_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_Message_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messagereplies`
--

DROP TABLE IF EXISTS `messagereplies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messagereplies` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `MessageId` int(11) DEFAULT NULL,
  `ReplyDescription` longtext DEFAULT NULL,
  `IsRead` bit(1) DEFAULT NULL,
  `IsEdited` bit(1) DEFAULT NULL,
  `IsActive` bit(1) DEFAULT NULL,
  `IsDelete` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_MessageReplies` (`created_by`),
  KEY `ialtered_by_MessageReplies` (`altered_by`),
  KEY `iMessageId_MessageReplies` (`MessageId`),
  CONSTRAINT `FK_MessageReplies_MessageId` FOREIGN KEY (`MessageId`) REFERENCES `message` (`Id`),
  CONSTRAINT `FK_MessageReplies_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_MessageReplies_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messagereplies`
--

LOCK TABLES `messagereplies` WRITE;
/*!40000 ALTER TABLE `messagereplies` DISABLE KEYS */;
/*!40000 ALTER TABLE `messagereplies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modeldifference`
--

DROP TABLE IF EXISTS `modeldifference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modeldifference` (
  `Oid` char(38) NOT NULL,
  `UserId` varchar(100) DEFAULT NULL,
  `ContextId` varchar(100) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_ModelDifference` (`GCRecord`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modeldifference`
--

LOCK TABLES `modeldifference` WRITE;
/*!40000 ALTER TABLE `modeldifference` DISABLE KEYS */;
INSERT INTO `modeldifference` VALUES ('ec4ad779-d0c1-46a4-b9b2-04d74fb9b24c','f3291dc2-b8ce-4114-b796-c8e47c63cf12','Blazor',0,1,NULL);
/*!40000 ALTER TABLE `modeldifference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modeldifferenceaspect`
--

DROP TABLE IF EXISTS `modeldifferenceaspect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modeldifferenceaspect` (
  `Oid` char(38) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Xml` longtext DEFAULT NULL,
  `Owner` char(38) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_ModelDifferenceAspect` (`GCRecord`),
  KEY `iOwner_ModelDifferenceAspect` (`Owner`),
  CONSTRAINT `FK_ModelDifferenceAspect_Owner` FOREIGN KEY (`Owner`) REFERENCES `modeldifference` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modeldifferenceaspect`
--

LOCK TABLES `modeldifferenceaspect` WRITE;
/*!40000 ALTER TABLE `modeldifferenceaspect` DISABLE KEYS */;
INSERT INTO `modeldifferenceaspect` VALUES ('d175f986-a9e3-4460-9f09-7fbce51d82ea','','<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<Application>\r\n  <SchemaModules>\r\n    <SchemaModule Name=\"CloneObjectModule\" Version=\"24.1.6.0\" IsNewNode=\"True\" />\r\n    <SchemaModule Name=\"SchedulerBlazorModule\" Version=\"24.1.6.0\" IsNewNode=\"True\" />\r\n    <SchemaModule Name=\"SchedulerModuleBase\" Version=\"24.1.6.0\" IsNewNode=\"True\" />\r\n    <SchemaModule Name=\"SystemModule\" Version=\"24.1.6.0\" IsNewNode=\"True\" />\r\n  </SchemaModules>\r\n</Application>','ec4ad779-d0c1-46a4-b9b2-04d74fb9b24c',1,NULL);
/*!40000 ALTER TABLE `modeldifferenceaspect` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mpesatransactions`
--

DROP TABLE IF EXISTS `mpesatransactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mpesatransactions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `User` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_MpesaTransactions` (`created_by`),
  KEY `ialtered_by_MpesaTransactions` (`altered_by`),
  KEY `iUser_MpesaTransactions` (`User`),
  CONSTRAINT `FK_MpesaTransactions_User` FOREIGN KEY (`User`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_MpesaTransactions_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_MpesaTransactions_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mpesatransactions`
--

LOCK TABLES `mpesatransactions` WRITE;
/*!40000 ALTER TABLE `mpesatransactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `mpesatransactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificationservices`
--

DROP TABLE IF EXISTS `notificationservices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificationservices` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Recipient` int(11) DEFAULT NULL,
  `Type` int(11) DEFAULT NULL,
  `Message` longtext DEFAULT NULL,
  `Link` varchar(100) DEFAULT NULL,
  `NotificationUrl` longtext DEFAULT NULL,
  `ActionRecipientId` int(11) DEFAULT NULL,
  `IsArchive` bit(1) DEFAULT NULL,
  `IsFavorite` bit(1) DEFAULT NULL,
  `IsRead` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_NotificationServices` (`created_by`),
  KEY `ialtered_by_NotificationServices` (`altered_by`),
  KEY `iRecipient_NotificationServices` (`Recipient`),
  KEY `iType_NotificationServices` (`Type`),
  KEY `iActionRecipientId_NotificationServices` (`ActionRecipientId`),
  CONSTRAINT `FK_NotificationServices_ActionRecipientId` FOREIGN KEY (`ActionRecipientId`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_NotificationServices_Recipient` FOREIGN KEY (`Recipient`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_NotificationServices_Type` FOREIGN KEY (`Type`) REFERENCES `notificationtypes` (`Id`),
  CONSTRAINT `FK_NotificationServices_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_NotificationServices_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificationservices`
--

LOCK TABLES `notificationservices` WRITE;
/*!40000 ALTER TABLE `notificationservices` DISABLE KEYS */;
INSERT INTO `notificationservices` VALUES (1,NULL,'2025-12-05 12:49:25',NULL,NULL,2,3,'Your Account is now Active.',NULL,NULL,NULL,_binary '\0',_binary '\0',_binary '\0'),(2,NULL,'2025-12-05 12:49:26',NULL,NULL,1,3,'Your Intermediary is now Active. Intermediary Emaile.technologiesy1@gmail.com',NULL,NULL,NULL,_binary '\0',_binary '\0',_binary '\0');
/*!40000 ALTER TABLE `notificationservices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificationtypes`
--

DROP TABLE IF EXISTS `notificationtypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificationtypes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `AffectAdmins` bit(1) DEFAULT NULL,
  `AffectsIndividuals` bit(1) DEFAULT NULL,
  `AffectsAgents` bit(1) DEFAULT NULL,
  `AffectsCorporates` bit(1) DEFAULT NULL,
  `AffectsBrokers` bit(1) DEFAULT NULL,
  `AffectsAuthorizedDealers` bit(1) DEFAULT NULL,
  `IsMessageNotification` bit(1) DEFAULT NULL,
  `IsServiceRequestNotification` bit(1) DEFAULT NULL,
  `IsAccountCreationNotification` bit(1) DEFAULT NULL,
  `IsFailureAlertNotification` bit(1) DEFAULT NULL,
  `IsPortalNotification` bit(1) DEFAULT NULL,
  `IsDashboard` bit(1) DEFAULT NULL,
  `IsApproval` bit(1) DEFAULT NULL,
  `IsBids` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_NotificationTypes` (`created_by`),
  KEY `ialtered_by_NotificationTypes` (`altered_by`),
  CONSTRAINT `FK_NotificationTypes_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_NotificationTypes_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificationtypes`
--

LOCK TABLES `notificationtypes` WRITE;
/*!40000 ALTER TABLE `notificationtypes` DISABLE KEYS */;
INSERT INTO `notificationtypes` VALUES (1,NULL,NULL,NULL,NULL,'Message Notifications','Alerts for messages.',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0'),(2,NULL,NULL,NULL,NULL,'Service Request Notifications','Alerts for incoming service requests.',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '\0',_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0'),(3,NULL,NULL,NULL,NULL,'Account Creation Notifications','Confirmation that a sponsor or trustee or relationship manager account has been created.',_binary '',_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0'),(4,NULL,NULL,NULL,NULL,'Failure Alerts Notifications','Notifications regarding issues within the portal requiring admin attention.',_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0'),(5,NULL,NULL,NULL,NULL,'Portal Notifications','Alerts for all portal notifications.',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '',_binary '\0',_binary '\0',_binary '\0'),(6,NULL,NULL,NULL,NULL,'Dashboard Notifications','Alerts for incoming dashboard alerts.',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '',_binary '\0',_binary '\0'),(7,NULL,NULL,NULL,NULL,'Approval Request Notifications','Alerts for incoming approval request notifications.',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0'),(8,NULL,NULL,NULL,NULL,'Bid Status Notifications','Alerts for bid/quotes request notifications.',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0');
/*!40000 ALTER TABLE `notificationtypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obitable`
--

DROP TABLE IF EXISTS `obitable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obitable` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Date` datetime DEFAULT NULL,
  `QuotedYield` varchar(100) DEFAULT NULL,
  `SpotYield` varchar(100) DEFAULT NULL,
  `DirtyPrice` varchar(100) DEFAULT NULL,
  `ObiKIndex` varchar(100) DEFAULT NULL,
  `Coupon` varchar(100) DEFAULT NULL,
  `Duration` varchar(100) DEFAULT NULL,
  `ExpectedReturn` varchar(100) DEFAULT NULL,
  `Dv01` varchar(100) DEFAULT NULL,
  `ExpectedShortfall` varchar(100) DEFAULT NULL,
  `ObiTr` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_ObiTable` (`created_by`),
  KEY `ialtered_by_ObiTable` (`altered_by`),
  CONSTRAINT `FK_ObiTable_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_ObiTable_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obitable`
--

LOCK TABLES `obitable` WRITE;
/*!40000 ALTER TABLE `obitable` DISABLE KEYS */;
/*!40000 ALTER TABLE `obitable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paymentstatus`
--

DROP TABLE IF EXISTS `paymentstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentstatus` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `IsPending` bit(1) DEFAULT NULL,
  `IsProcessing` bit(1) DEFAULT NULL,
  `IsPaid` bit(1) DEFAULT NULL,
  `IsFailed` bit(1) DEFAULT NULL,
  `IsRefunded` bit(1) DEFAULT NULL,
  `IsCancelled` bit(1) DEFAULT NULL,
  `IsPartial` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_PaymentStatus` (`created_by`),
  KEY `ialtered_by_PaymentStatus` (`altered_by`),
  CONSTRAINT `FK_PaymentStatus_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PaymentStatus_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymentstatus`
--

LOCK TABLES `paymentstatus` WRITE;
/*!40000 ALTER TABLE `paymentstatus` DISABLE KEYS */;
/*!40000 ALTER TABLE `paymentstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissionpolicyactionpermissionobject`
--

DROP TABLE IF EXISTS `permissionpolicyactionpermissionobject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissionpolicyactionpermissionobject` (
  `Oid` char(38) NOT NULL,
  `ActionId` varchar(100) DEFAULT NULL,
  `Role` char(38) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_PermissionPolicyActionPermissionObject` (`GCRecord`),
  KEY `iRole_PermissionPolicyActionPermissionObject` (`Role`),
  CONSTRAINT `FK_PermissionPolicyActionPermissionObject_Role` FOREIGN KEY (`Role`) REFERENCES `permissionpolicyrole` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissionpolicyactionpermissionobject`
--

LOCK TABLES `permissionpolicyactionpermissionobject` WRITE;
/*!40000 ALTER TABLE `permissionpolicyactionpermissionobject` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissionpolicyactionpermissionobject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissionpolicymemberpermissionsobject`
--

DROP TABLE IF EXISTS `permissionpolicymemberpermissionsobject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissionpolicymemberpermissionsobject` (
  `Oid` char(38) NOT NULL,
  `Members` longtext DEFAULT NULL,
  `ReadState` int(11) DEFAULT NULL,
  `WriteState` int(11) DEFAULT NULL,
  `Criteria` longtext DEFAULT NULL,
  `TypePermissionObject` char(38) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_PermissionPolicyMemberPermissionsObject` (`GCRecord`),
  KEY `iTypePermissionObject_PermissionPolicyMemberPermissionsObject` (`TypePermissionObject`),
  CONSTRAINT `FK_PermissionPolicyMemberPermissionsObject_TypePermissionObject` FOREIGN KEY (`TypePermissionObject`) REFERENCES `permissionpolicytypepermissionsobject` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissionpolicymemberpermissionsobject`
--

LOCK TABLES `permissionpolicymemberpermissionsobject` WRITE;
/*!40000 ALTER TABLE `permissionpolicymemberpermissionsobject` DISABLE KEYS */;
INSERT INTO `permissionpolicymemberpermissionsobject` VALUES ('2ba96606-2716-4c92-9e32-37ce4c052277','StoredPassword',NULL,1,'[Oid] = CurrentUserId()','c1be7728-15e0-45e9-b887-6cf765d587d3',0,NULL),('b5164ab8-3608-436e-bcf7-965a465d9c54','ChangePasswordOnFirstLogon',NULL,1,'[Oid] = CurrentUserId()','c1be7728-15e0-45e9-b887-6cf765d587d3',0,NULL);
/*!40000 ALTER TABLE `permissionpolicymemberpermissionsobject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissionpolicynavigationpermissionsobject`
--

DROP TABLE IF EXISTS `permissionpolicynavigationpermissionsobject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissionpolicynavigationpermissionsobject` (
  `Oid` char(38) NOT NULL,
  `ItemPath` longtext DEFAULT NULL,
  `NavigateState` int(11) DEFAULT NULL,
  `Role` char(38) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_PermissionPolicyNavigationPermissionsObject` (`GCRecord`),
  KEY `iRole_PermissionPolicyNavigationPermissionsObject` (`Role`),
  CONSTRAINT `FK_PermissionPolicyNavigationPermissionsObject_Role` FOREIGN KEY (`Role`) REFERENCES `permissionpolicyrole` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissionpolicynavigationpermissionsobject`
--

LOCK TABLES `permissionpolicynavigationpermissionsobject` WRITE;
/*!40000 ALTER TABLE `permissionpolicynavigationpermissionsobject` DISABLE KEYS */;
INSERT INTO `permissionpolicynavigationpermissionsobject` VALUES ('356f2e7c-c0c9-49b5-93f3-eebcf83c8686','Application/NavigationItems/Items/Default/Items/MyDetails',1,'19ab40e8-2007-4ce4-b6d8-d0dbd9124f5b',0,NULL);
/*!40000 ALTER TABLE `permissionpolicynavigationpermissionsobject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissionpolicyobjectpermissionsobject`
--

DROP TABLE IF EXISTS `permissionpolicyobjectpermissionsobject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissionpolicyobjectpermissionsobject` (
  `Oid` char(38) NOT NULL,
  `Criteria` longtext DEFAULT NULL,
  `ReadState` int(11) DEFAULT NULL,
  `WriteState` int(11) DEFAULT NULL,
  `DeleteState` int(11) DEFAULT NULL,
  `NavigateState` int(11) DEFAULT NULL,
  `TypePermissionObject` char(38) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_PermissionPolicyObjectPermissionsObject` (`GCRecord`),
  KEY `iTypePermissionObject_PermissionPolicyObjectPermissionsObject` (`TypePermissionObject`),
  CONSTRAINT `FK_PermissionPolicyObjectPermissionsObject_TypePermissionObject` FOREIGN KEY (`TypePermissionObject`) REFERENCES `permissionpolicytypepermissionsobject` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissionpolicyobjectpermissionsobject`
--

LOCK TABLES `permissionpolicyobjectpermissionsobject` WRITE;
/*!40000 ALTER TABLE `permissionpolicyobjectpermissionsobject` DISABLE KEYS */;
INSERT INTO `permissionpolicyobjectpermissionsobject` VALUES ('695d7564-012b-49ae-9ae8-878fac821ad8','Owner.UserId = ToStr(CurrentUserId())',1,1,NULL,NULL,'a81fb48b-0b43-44a9-9e0b-34e65cf1f808',0,NULL),('aa8ac1ac-5582-45d9-8265-99eaf046410e','[Oid] = CurrentUserId()',1,NULL,NULL,NULL,'c1be7728-15e0-45e9-b887-6cf765d587d3',0,NULL),('d3049318-cb43-4f41-a57a-6c55195dbb7e','UserId = ToStr(CurrentUserId())',1,1,NULL,NULL,'900452d0-4cb7-4e1f-b522-c7d195357840',0,NULL),('edc5763d-1088-407a-808f-dac3562c506f','[UserId] = ToStr(CurrentUserId())',1,NULL,NULL,NULL,'8a3ca39a-e6af-49ea-a15c-3fdb46b3a0e0',0,NULL);
/*!40000 ALTER TABLE `permissionpolicyobjectpermissionsobject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissionpolicyrole`
--

DROP TABLE IF EXISTS `permissionpolicyrole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissionpolicyrole` (
  `Oid` char(38) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `IsAdministrative` bit(1) DEFAULT NULL,
  `CanEditModel` bit(1) DEFAULT NULL,
  `PermissionPolicy` int(11) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  `ObjectType` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_PermissionPolicyRole` (`GCRecord`),
  KEY `iObjectType_PermissionPolicyRole` (`ObjectType`),
  CONSTRAINT `FK_PermissionPolicyRole_ObjectType` FOREIGN KEY (`ObjectType`) REFERENCES `xpobjecttype` (`OID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissionpolicyrole`
--

LOCK TABLES `permissionpolicyrole` WRITE;
/*!40000 ALTER TABLE `permissionpolicyrole` DISABLE KEYS */;
INSERT INTO `permissionpolicyrole` VALUES ('19ab40e8-2007-4ce4-b6d8-d0dbd9124f5b','Default',_binary '\0',_binary '\0',0,0,NULL,1),('a0595a01-fcc5-4b4e-a210-e5a1b07662c8','Administrators',_binary '',_binary '\0',0,0,NULL,1);
/*!40000 ALTER TABLE `permissionpolicyrole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissionpolicytypepermissionsobject`
--

DROP TABLE IF EXISTS `permissionpolicytypepermissionsobject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissionpolicytypepermissionsobject` (
  `Oid` char(38) NOT NULL,
  `Role` char(38) DEFAULT NULL,
  `TargetType` longtext DEFAULT NULL,
  `ReadState` int(11) DEFAULT NULL,
  `WriteState` int(11) DEFAULT NULL,
  `CreateState` int(11) DEFAULT NULL,
  `DeleteState` int(11) DEFAULT NULL,
  `NavigateState` int(11) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_PermissionPolicyTypePermissionsObject` (`GCRecord`),
  KEY `iRole_PermissionPolicyTypePermissionsObject` (`Role`),
  CONSTRAINT `FK_PermissionPolicyTypePermissionsObject_Role` FOREIGN KEY (`Role`) REFERENCES `permissionpolicyrole` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissionpolicytypepermissionsobject`
--

LOCK TABLES `permissionpolicytypepermissionsobject` WRITE;
/*!40000 ALTER TABLE `permissionpolicytypepermissionsobject` DISABLE KEYS */;
INSERT INTO `permissionpolicytypepermissionsobject` VALUES ('4f9d6d59-80ec-4e81-8e92-6a975f0ef0b3','19ab40e8-2007-4ce4-b6d8-d0dbd9124f5b','DevExpress.Persistent.BaseImpl.AuditedObjectWeakReference',1,NULL,NULL,NULL,NULL,0,NULL),('6684e053-1ba2-4ba6-ae6a-545f8457fa93','19ab40e8-2007-4ce4-b6d8-d0dbd9124f5b','DevExpress.Persistent.BaseImpl.PermissionPolicy.PermissionPolicyRole',0,NULL,NULL,NULL,NULL,0,NULL),('8a3ca39a-e6af-49ea-a15c-3fdb46b3a0e0','19ab40e8-2007-4ce4-b6d8-d0dbd9124f5b','DevExpress.Persistent.BaseImpl.AuditDataItemPersistent',0,NULL,NULL,NULL,NULL,0,NULL),('900452d0-4cb7-4e1f-b522-c7d195357840','19ab40e8-2007-4ce4-b6d8-d0dbd9124f5b','DevExpress.Persistent.BaseImpl.ModelDifference',NULL,NULL,1,NULL,NULL,0,NULL),('a81fb48b-0b43-44a9-9e0b-34e65cf1f808','19ab40e8-2007-4ce4-b6d8-d0dbd9124f5b','DevExpress.Persistent.BaseImpl.ModelDifferenceAspect',NULL,NULL,1,NULL,NULL,0,NULL),('c1be7728-15e0-45e9-b887-6cf765d587d3','19ab40e8-2007-4ce4-b6d8-d0dbd9124f5b','BondKonnect.Module.BusinessObjects.ApplicationUser',NULL,NULL,NULL,NULL,NULL,0,NULL);
/*!40000 ALTER TABLE `permissionpolicytypepermissionsobject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissionpolicyuser`
--

DROP TABLE IF EXISTS `permissionpolicyuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissionpolicyuser` (
  `Oid` char(38) NOT NULL,
  `StoredPassword` longtext DEFAULT NULL,
  `ChangePasswordOnFirstLogon` bit(1) DEFAULT NULL,
  `UserName` varchar(100) DEFAULT NULL,
  `IsActive` bit(1) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  `ObjectType` int(11) DEFAULT NULL,
  `AccessFailedCount` int(11) DEFAULT NULL,
  `LockoutEnd` datetime DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_PermissionPolicyUser` (`GCRecord`),
  KEY `iObjectType_PermissionPolicyUser` (`ObjectType`),
  CONSTRAINT `FK_PermissionPolicyUser_ObjectType` FOREIGN KEY (`ObjectType`) REFERENCES `xpobjecttype` (`OID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissionpolicyuser`
--

LOCK TABLES `permissionpolicyuser` WRITE;
/*!40000 ALTER TABLE `permissionpolicyuser` DISABLE KEYS */;
INSERT INTO `permissionpolicyuser` VALUES ('55814fa0-aee7-44c0-a1ef-63e4a3be8eb9','',_binary '\0','User',_binary '',0,NULL,6,0,NULL),('5fd31810-b7cc-4e07-b3bf-49cb624b6042','',_binary '\0','DESKTOP-4RBGUHR\\SoftClansUser',_binary '',0,NULL,6,0,NULL),('f3291dc2-b8ce-4114-b796-c8e47c63cf12','',_binary '\0','Admin',_binary '',0,NULL,6,0,NULL);
/*!40000 ALTER TABLE `permissionpolicyuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissionpolicyuserlogininfo`
--

DROP TABLE IF EXISTS `permissionpolicyuserlogininfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissionpolicyuserlogininfo` (
  `Oid` char(38) NOT NULL,
  `LoginProviderName` varchar(100) DEFAULT NULL,
  `ProviderUserKey` varchar(100) DEFAULT NULL,
  `User` char(38) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  UNIQUE KEY `iLoginProviderNameProviderUserKey_PermissionPolicyUserLoginInfo` (`LoginProviderName`,`ProviderUserKey`),
  KEY `iUser_PermissionPolicyUserLoginInfo` (`User`),
  CONSTRAINT `FK_PermissionPolicyUserLoginInfo_User` FOREIGN KEY (`User`) REFERENCES `permissionpolicyuser` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissionpolicyuserlogininfo`
--

LOCK TABLES `permissionpolicyuserlogininfo` WRITE;
/*!40000 ALTER TABLE `permissionpolicyuserlogininfo` DISABLE KEYS */;
INSERT INTO `permissionpolicyuserlogininfo` VALUES ('2fb78820-8dac-40dc-b110-12c2da3daf08','Windows','DESKTOP-4RBGUHR\\SoftClansUser','5fd31810-b7cc-4e07-b3bf-49cb624b6042',0),('4158d27c-14b3-43e7-b89b-6d8344af244a','Password','f3291dc2-b8ce-4114-b796-c8e47c63cf12','f3291dc2-b8ce-4114-b796-c8e47c63cf12',0),('8dab952a-d9d7-4e4f-a740-f3b1e3fda958','Password','55814fa0-aee7-44c0-a1ef-63e4a3be8eb9','55814fa0-aee7-44c0-a1ef-63e4a3be8eb9',0),('ebd9279c-b521-49d5-90e3-ec77293792c5','Password','5fd31810-b7cc-4e07-b3bf-49cb624b6042','5fd31810-b7cc-4e07-b3bf-49cb624b6042',0);
/*!40000 ALTER TABLE `permissionpolicyuserlogininfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissionpolicyuserusers_permissionpolicyroleroles`
--

DROP TABLE IF EXISTS `permissionpolicyuserusers_permissionpolicyroleroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissionpolicyuserusers_permissionpolicyroleroles` (
  `Roles` char(38) DEFAULT NULL,
  `Users` char(38) DEFAULT NULL,
  `OID` char(38) NOT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  PRIMARY KEY (`OID`),
  UNIQUE KEY `iRolesUsers_PermissionPolicyUserUsers_PermissionPolicyRoleRoles` (`Roles`,`Users`),
  KEY `iRoles_PermissionPolicyUserUsers_PermissionPolicyRoleRoles` (`Roles`),
  KEY `iUsers_PermissionPolicyUserUsers_PermissionPolicyRoleRoles` (`Users`),
  CONSTRAINT `FK_PermissionPolicyUserUsers_PermissionPolicyRoleRoles_Roles` FOREIGN KEY (`Roles`) REFERENCES `permissionpolicyrole` (`Oid`),
  CONSTRAINT `FK_PermissionPolicyUserUsers_PermissionPolicyRoleRoles_Users` FOREIGN KEY (`Users`) REFERENCES `permissionpolicyuser` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissionpolicyuserusers_permissionpolicyroleroles`
--

LOCK TABLES `permissionpolicyuserusers_permissionpolicyroleroles` WRITE;
/*!40000 ALTER TABLE `permissionpolicyuserusers_permissionpolicyroleroles` DISABLE KEYS */;
INSERT INTO `permissionpolicyuserusers_permissionpolicyroleroles` VALUES ('a0595a01-fcc5-4b4e-a210-e5a1b07662c8','f3291dc2-b8ce-4114-b796-c8e47c63cf12','1c440960-e800-4d8b-89af-0c083df7346e',0),('a0595a01-fcc5-4b4e-a210-e5a1b07662c8','5fd31810-b7cc-4e07-b3bf-49cb624b6042','51228a67-fab7-451f-8b45-c0cfd41bb5ef',0),('19ab40e8-2007-4ce4-b6d8-d0dbd9124f5b','55814fa0-aee7-44c0-a1ef-63e4a3be8eb9','5536a12e-b76a-44de-8b61-b0106481b0a2',0);
/*!40000 ALTER TABLE `permissionpolicyuserusers_permissionpolicyroleroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portalintermediary`
--

DROP TABLE IF EXISTS `portalintermediary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portalintermediary` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `User` int(11) DEFAULT NULL,
  `IntermediaryId` int(11) DEFAULT NULL,
  `IsActive` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_PortalIntermediary` (`created_by`),
  KEY `ialtered_by_PortalIntermediary` (`altered_by`),
  KEY `iUser_PortalIntermediary` (`User`),
  KEY `iIntermediaryId_PortalIntermediary` (`IntermediaryId`),
  CONSTRAINT `FK_PortalIntermediary_IntermediaryId` FOREIGN KEY (`IntermediaryId`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortalIntermediary_User` FOREIGN KEY (`User`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortalIntermediary_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortalIntermediary_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portalintermediary`
--

LOCK TABLES `portalintermediary` WRITE;
/*!40000 ALTER TABLE `portalintermediary` DISABLE KEYS */;
INSERT INTO `portalintermediary` VALUES (1,NULL,'2025-12-04 18:26:31',NULL,NULL,1,2,_binary '');
/*!40000 ALTER TABLE `portalintermediary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portaluseremailverification`
--

DROP TABLE IF EXISTS `portaluseremailverification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portaluseremailverification` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `IsVerified` bit(1) DEFAULT NULL,
  `Signature` varchar(100) DEFAULT NULL,
  `ExpiresAt` datetime DEFAULT NULL,
  `User` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_PortalUserEmailVerification` (`created_by`),
  KEY `ialtered_by_PortalUserEmailVerification` (`altered_by`),
  KEY `iUser_PortalUserEmailVerification` (`User`),
  CONSTRAINT `FK_PortalUserEmailVerification_User` FOREIGN KEY (`User`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortalUserEmailVerification_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortalUserEmailVerification_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portaluseremailverification`
--

LOCK TABLES `portaluseremailverification` WRITE;
/*!40000 ALTER TABLE `portaluseremailverification` DISABLE KEYS */;
INSERT INTO `portaluseremailverification` VALUES (1,NULL,'2025-12-04 18:26:25',NULL,NULL,_binary '','b7ee0827fafbef0323033c148b00c7e2c630b97721a1fa0e6c71daf6b7d3327f','2025-12-05 18:26:25',2),(2,NULL,'2025-12-04 18:26:32',NULL,NULL,_binary '','c66e9459008077f5800fd21780ed0f0a09a99297e775aa4554884a2b0889ee8b','2025-12-05 18:26:32',1),(3,NULL,'2025-12-05 13:00:14',NULL,NULL,_binary '\0','2652ccf74163ac2161206a466d8ad99ebb483cbe9bc53d9cba1bffb1b906e1c6','2025-12-06 13:00:14',2);
/*!40000 ALTER TABLE `portaluseremailverification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portaluserlogintoken`
--

DROP TABLE IF EXISTS `portaluserlogintoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portaluserlogintoken` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `IpAddress` varchar(100) DEFAULT NULL,
  `Token` longtext DEFAULT NULL,
  `UserAgent` longtext DEFAULT NULL,
  `LastLogOn` datetime DEFAULT NULL,
  `ExpiresAt` datetime DEFAULT NULL,
  `IsActive` bit(1) DEFAULT NULL,
  `User` int(11) DEFAULT NULL,
  `ActiveRole` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_PortalUserLoginToken` (`created_by`),
  KEY `ialtered_by_PortalUserLoginToken` (`altered_by`),
  KEY `iUser_PortalUserLoginToken` (`User`),
  KEY `iActiveRole_PortalUserLoginToken` (`ActiveRole`),
  CONSTRAINT `FK_PortalUserLoginToken_ActiveRole` FOREIGN KEY (`ActiveRole`) REFERENCES `roles` (`Id`),
  CONSTRAINT `FK_PortalUserLoginToken_User` FOREIGN KEY (`User`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortalUserLoginToken_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortalUserLoginToken_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portaluserlogintoken`
--

LOCK TABLES `portaluserlogintoken` WRITE;
/*!40000 ALTER TABLE `portaluserlogintoken` DISABLE KEYS */;
INSERT INTO `portaluserlogintoken` VALUES (1,NULL,NULL,NULL,NULL,'105.161.73.28','ZXlKcGRpSTZJamRHY3k5RFQyUTVVbWR2YjJGeFV6RXZVa1JJTjJjOVBTSXNJblpoYkhWbElqb2lkVUpuVXpscWREaEhibFJvYldkdFptODVlRWwyWlhKM1VFbEljMGhKTmtJNFZXNVpPRTExZG5oUE1GcHVWbGxvZWk5amVDdFNTVXBGUmxWMVZuRm5OVWhEU1dKaVRtNVdOakZaUVhWSUswUkhkMHhwVTJwMlF6SnRWRkUyVGxKVU4xZEtWWEpNT1doQ1kzZEpTek5DT0cxNVZGbE1WR2h1Y1VRM2EwaGlhekJsVjNSRmJqTjBWalUxZEVoRU1YTnNPRFZIV21WbVVHeFNObW8yUWpaaE0yUkxkazExTm1KV1ZVaFJWRUV3WXlzeGFFWXpVMDV0TXpVNVNUSm5VelpXVnpjeldsVm9lWFpTY3pRM1JVRk5iM05IVmpOQlp6MDlJaXdpYldGaklqb2laRGMzTnpjeVpHSm1PVEJqWldRellUQTVZbVkzTTJJNU5tWmtPVFZoWkRjNVpEWTFOV1kwTTJZeU56SmxOVEV4WWprME16YzJOMk14T1dJNE4ySmtNQ0lzSW5SaFp5STZJaUo5fDVlMDEyYThhZTA3OTQ0NGRjZTMwZDRkYmE1MzM4MTBlODYxMzE2Y2E4MDUyMDlhM2E2YzMwYjcyY2Q0YjQ2NmU=','node','2025-12-04 18:46:19','2025-12-05 18:46:19',_binary '\0',1,5),(2,NULL,NULL,NULL,NULL,'41.209.3.22','ZXlKcGRpSTZJbU14TkhCclkwMVpORTVQTTJjcllVcHRNVmh0WW1jOVBTSXNJblpoYkhWbElqb2llUzlETTJ4RVNreGxXa2N5ZVd4WGNEUXZWMUJUVjNSV2NVcHRVMnRqVlhkM1pEUkNUbFZDVEV4M2JTdFZTbTg0YTFwNVpEVkphQ3RyV0Rsdk9GQm9SMGREY2t4bVRHNXVZM1pXSzFkUk4xRlVNbTVwZEZodGJFVTROVGRsTWtWdVRIZ3JObkp5VDFoU1RtaHdlbWhzT0cxS1JWTnBTbkJaSzBsWVoxZFFkV2hNUVhkSFkwMDBaM0l3WXpoekswaHNVVEpwVDJzNGFEbFdWRWcxYTJGaGNsQnBTbTFsZWtKYWFHb3hMMGRqVkdWa1VuaG5lVlZhVGtselpGZDVPV3RqYlV4dlYzTndWbU40TWxaSVdqaG5aRXRwY1N0b1p6MDlJaXdpYldGaklqb2lZVGhoWlRoallqWTRNRFkxTldZd1lXTTNNekl4T1dFeE5qTTVZVE0yWmpreU1EVTVNR1E0TlRObFlUazVZek16WlRnNVlXTm1Zamc0T0dRM1pEa3dOU0lzSW5SaFp5STZJaUo5fGFjNjI4YjMzZTU2Mjg4ZmU2NTVkMGVlNTU0YTNhNzhjZmYzNThmN2Q5MDMwYzAwNzg0ZTdhZWJiYzZkMDc2ZjY=','node','2025-12-05 13:03:03','2025-12-06 13:03:03',_binary '\0',2,1),(3,NULL,NULL,NULL,NULL,'41.209.3.22','ZXlKcGRpSTZJaXRqTUVoSU0weFhUMWs0VVdkR2RUQTRZelpFU25jOVBTSXNJblpoYkhWbElqb2lRamw2UTJGbVRIaGFjREJ6ZVROUVlUVkdUVlJ2ZEZZNVQzRlVXV2gzY2xCUk1YWTJiV0ZtVGxrMU9XcEZhRFF6ZVVaTVZrSnhkVU5ETkhWSlQwUnRVVUpzT0cxeE1uSTBWMmhTYlVwaFVXaDNXRE53VTFWdVpITk9WalZQTlUwMVJsRm1hbFJXWkc1cE9HVlhVSGMxYlhSdGVrZFRNbEZIY0hGRFdEZG1kVFJoWkRkV1pEQjRMMnQyVlV3eVJIbExaR1F3Y3pGdUwzTTJaVFkwYjI1RlJrRllLMnB2YUZKMmRsWnZORlV6WjBsSk5FcFZXa3hRY21RNFprcGpLM3B6ZWtaS2FFdHBXVzAwZUhKNE1HMXdWR1kxZURCWWR6MDlJaXdpYldGaklqb2lNR0kxTTJNMU9EUXdNbU5qWVRFeE5qUTVaVFpoWldJek5EWmtaams0T0dKaU9EZ3pNMk0wT1RnME5HUmlZemd3TUdOa09EY3pZakF3WlRZeE9XWTBZeUlzSW5SaFp5STZJaUo5fDA2MmQ3NWY5MThkMzhlZDA4MTIzNDQ4OTBlNmU5ZDYyZGNkODAxNjE2YTA5MGQ2MGFkMDcyMDY5OTg3MmNiMTY=','node','2025-12-05 13:08:26','2025-12-06 13:08:26',_binary '\0',2,5),(4,NULL,NULL,NULL,NULL,'41.209.3.22','ZXlKcGRpSTZJalJUTlRSUFJqUmhSMWhNTm5KSk1YaGpPRk5QU0djOVBTSXNJblpoYkhWbElqb2lZVmQwV1ZKSFRXeE9NRXBpTTNwaWJXWmxURmh2WW1KM2J6UlZSa2Q2TVVkblNtMHlNMmxEWldKbVlVczBNRlJrVWs5a1JtdzRiMXB4TTA4clVFVTJjaTl1YVVGVlQydG5kRlk1YjNSemJHMTRaeko2ZDJVMFFUbDJhbXRuSzJWcWVFODBNV0ZOWTNoWWMwRTFVMFJpWVdWdlpucHFUSE5VVkUwd1lrNW9kWGg1VkN0aVZrOVZNMWQwVTJGamRqaE1TbEpXWmxaS2VDOVpVMUY1V0dGbFJDOUVNR0UwUTJWWVJWSnZjVFpsY25SbFZITjNlVEZ0U1M5aVNYQnphRGN5UTI5VldHdEllVk5KTVhaWWMyMXVOblJHZERabWR6MDlJaXdpYldGaklqb2lNakZsTWpBME1ERTJaR0kwT1RkbE5HSTBPREV5T0Rsak0ySmpPR1JqT0RnNU1EUTVPVGd6WlRZeVpUUmpNMlEzWmpneVpXWmhNMlUwTXpNeU1tTTVZaUlzSW5SaFp5STZJaUo5fDcwY2QzZWMwZDI5ZDNkNTAzZTZmMGExMjA0M2ZiNjNiZjQ3YjA3ODA0MGY1NGNiNWI3MmFhODBkZjYwZTgzYjA=','node','2025-12-05 13:12:28','2025-12-06 13:12:28',_binary '\0',2,5),(5,NULL,NULL,NULL,NULL,'41.209.3.22','ZXlKcGRpSTZJbEpoZWtveFpUSlJjRzlSVUdsVlFqbGxOM2QzV0ZFOVBTSXNJblpoYkhWbElqb2lXRVZLWjJabGVtMU1iR0p5ZEM5c1JVSkZhVWR6ZHpWak1VeE5lVTVHV1d0alEwZ3pVRFIwUWs1cWIwNU1lV000UVZKTFNsZFFUWHB3YUhWalEyMDBUR1J3ZVV4aFp6VkthRTF2VkZWMlUxWlFZWGRtYW5GbllVWnNjMDlITWt3eGNEWnJkbEl5YnpCRWEwa3dURzE1YW14QlNUQmFlV0l6U1hCUE1ERlJOV0pHZUdOaWVHeFBZbTgxYTJWQmJXMWxjRTlGTUVWV2RFVlZibTF0YXpjNE4xUkhRbWhGYm5kWWQyMVRSRXRPU0dsUFdYVlBSRE5EUzNwc1QwdFRiMnRwUXpaRFZtVjFWalp5UVhoSGJrbDRiVGgxUVhoa1p6MDlJaXdpYldGaklqb2lZMlZtWmpVMU9UTXlNRE0xTWpCbVpqRTBZamMwTVRNMU1XTmhNelZqTUdVMU1tSXlOamcxTkRJME4yTmhOall4WldSak1qVmxZalEyTnpCbE1qQTROeUlzSW5SaFp5STZJaUo5fDdlYjBjNzM2NGQzOTY1NzI3Mjg4YmQxYzIwN2YxNWRlMmM4NDBlYWU5MDEzZTVjNDE0Y2Q0OTg1YWY2YzdmNjc=','node','2025-12-05 13:16:38','2025-12-06 13:16:38',_binary '',2,1);
/*!40000 ALTER TABLE `portaluserlogintoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portaluserlogoninfo`
--

DROP TABLE IF EXISTS `portaluserlogoninfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portaluserlogoninfo` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `AccountId` varchar(100) DEFAULT NULL,
  `UserName` varchar(100) DEFAULT NULL,
  `CompanyName` varchar(100) DEFAULT NULL,
  `FirstName` varchar(100) DEFAULT NULL,
  `OtherNames` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `PhoneNumber` varchar(100) DEFAULT NULL,
  `PostalAddress` varchar(100) DEFAULT NULL,
  `IsActive` bit(1) DEFAULT NULL,
  `CdsNo` varchar(100) DEFAULT NULL,
  `IsLocal` bit(1) DEFAULT NULL,
  `IsForeign` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_PortalUserLogonInfo` (`created_by`),
  KEY `ialtered_by_PortalUserLogonInfo` (`altered_by`),
  CONSTRAINT `FK_PortalUserLogonInfo_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortalUserLogonInfo_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portaluserlogoninfo`
--

LOCK TABLES `portaluserlogoninfo` WRITE;
/*!40000 ALTER TABLE `portaluserlogoninfo` DISABLE KEYS */;
INSERT INTO `portaluserlogoninfo` VALUES (1,NULL,'2025-12-04 18:26:24',NULL,NULL,'BL20257329968829wUcqh875Zj','MWAS','DevT',NULL,NULL,'mwangieddie1@gmail.com','0768284737',NULL,_binary '',NULL,_binary '',_binary '\0'),(2,NULL,'2025-12-04 18:26:24',NULL,'2025-12-05 12:49:25','BL20256486570495BR7J8ULE4o','ETECH','NEW KK',NULL,NULL,'e.technologiesy1@gmail.com','0768284737',NULL,_binary '',NULL,_binary '',_binary '\0');
/*!40000 ALTER TABLE `portaluserlogoninfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portaluserotphistory`
--

DROP TABLE IF EXISTS `portaluserotphistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portaluserotphistory` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Otp` varchar(100) DEFAULT NULL,
  `OtpExpiry` datetime DEFAULT NULL,
  `IsActive` bit(1) DEFAULT NULL,
  `User` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_PortalUserOtpHistory` (`created_by`),
  KEY `ialtered_by_PortalUserOtpHistory` (`altered_by`),
  KEY `iUser_PortalUserOtpHistory` (`User`),
  CONSTRAINT `FK_PortalUserOtpHistory_User` FOREIGN KEY (`User`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortalUserOtpHistory_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortalUserOtpHistory_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portaluserotphistory`
--

LOCK TABLES `portaluserotphistory` WRITE;
/*!40000 ALTER TABLE `portaluserotphistory` DISABLE KEYS */;
INSERT INTO `portaluserotphistory` VALUES (1,NULL,'2025-12-04 18:43:15',NULL,NULL,'861613','2025-12-04 18:48:15',_binary '',1),(2,NULL,'2025-12-05 13:02:13',NULL,NULL,'290703','2025-12-05 13:07:13',_binary '',2),(3,NULL,'2025-12-05 13:04:31',NULL,NULL,'870156','2025-12-05 13:09:31',_binary '',2),(4,NULL,'2025-12-05 13:07:36',NULL,NULL,'882084','2025-12-05 13:12:36',_binary '',2),(5,NULL,'2025-12-05 13:12:03',NULL,NULL,'433663','2025-12-05 13:17:03',_binary '',2),(6,NULL,'2025-12-05 13:16:11',NULL,NULL,'271708','2025-12-05 13:21:11',_binary '',2);
/*!40000 ALTER TABLE `portaluserotphistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portaluserpasswordshistory`
--

DROP TABLE IF EXISTS `portaluserpasswordshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portaluserpasswordshistory` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Password` varchar(100) DEFAULT NULL,
  `IsActive` bit(1) DEFAULT NULL,
  `User` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_PortalUserPasswordsHistory` (`created_by`),
  KEY `ialtered_by_PortalUserPasswordsHistory` (`altered_by`),
  KEY `iUser_PortalUserPasswordsHistory` (`User`),
  CONSTRAINT `FK_PortalUserPasswordsHistory_User` FOREIGN KEY (`User`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortalUserPasswordsHistory_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortalUserPasswordsHistory_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portaluserpasswordshistory`
--

LOCK TABLES `portaluserpasswordshistory` WRITE;
/*!40000 ALTER TABLE `portaluserpasswordshistory` DISABLE KEYS */;
INSERT INTO `portaluserpasswordshistory` VALUES (1,NULL,'2025-12-04 18:28:58',NULL,NULL,'$2y$10$vRO0HKlEHnHdCniH7vsIcu3GAyhNL.JQDh2XHwXnpWfQxke4YLh7O',_binary '',1),(2,NULL,'2025-12-05 13:01:57',NULL,NULL,'$2y$10$rcP25C0UFz/TpvCg7T2jqOjcc2rlK3SNSP7dUVN3abho1Teg.H2GS',_binary '',2);
/*!40000 ALTER TABLE `portaluserpasswordshistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portaluserrolepermissions`
--

DROP TABLE IF EXISTS `portaluserrolepermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portaluserrolepermissions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Role` int(11) DEFAULT NULL,
  `User` int(11) DEFAULT NULL,
  `CanAccessResearchAssistant` bit(1) DEFAULT NULL,
  `CanAccessBondscreens` bit(1) DEFAULT NULL,
  `CanAccessBondStats` bit(1) DEFAULT NULL,
  `CanManagePortfolio` bit(1) DEFAULT NULL,
  `CanManageQuotes` bit(1) DEFAULT NULL,
  `CanManageTransactions` bit(1) DEFAULT NULL,
  `CanAccessMessages` bit(1) DEFAULT NULL,
  `CanUpdateAccountSettings` bit(1) DEFAULT NULL,
  `CanReceiveNotifications` bit(1) DEFAULT NULL,
  `CanManageUploads` bit(1) DEFAULT NULL,
  `CanAccessSubscriptions` bit(1) DEFAULT NULL,
  `CanManageAccounts` bit(1) DEFAULT NULL,
  `CanAccessFAQ` bit(1) DEFAULT NULL,
  `CanAccessHelp` bit(1) DEFAULT NULL,
  `CanAccessActivityLogs` bit(1) DEFAULT NULL,
  `CanAccessAdmin` bit(1) DEFAULT NULL,
  `CanAccessAnalysis` bit(1) DEFAULT NULL,
  `CanAccessInvoices` bit(1) DEFAULT NULL,
  `CanAccessFinancials` bit(1) DEFAULT NULL,
  `CanAccessResearchAssistantTools` bit(1) DEFAULT NULL,
  `CanAccessBondCalc` bit(1) DEFAULT NULL,
  `CanSubmitMessage` bit(1) DEFAULT NULL,
  `CanApproveIntermediary` bit(1) DEFAULT NULL,
  `CanGenerateQuote` bit(1) DEFAULT NULL,
  `CanSubmitBid` bit(1) DEFAULT NULL,
  `CanApproveQuote` bit(1) DEFAULT NULL,
  `CanRejectQuote` bit(1) DEFAULT NULL,
  `CanDelegateQuote` bit(1) DEFAULT NULL,
  `CanCreateUserAccount` bit(1) DEFAULT NULL,
  `CanViewUserAccounts` bit(1) DEFAULT NULL,
  `CanResetPassword` bit(1) DEFAULT NULL,
  `CanDeleteUserAccount` bit(1) DEFAULT NULL,
  `CanCreateSubscriptionPackage` bit(1) DEFAULT NULL,
  `CanPurchaseSubscription` bit(1) DEFAULT NULL,
  `CanViewYieldGraphs` bit(1) DEFAULT NULL,
  `CanAccessDurationScreen` bit(1) DEFAULT NULL,
  `CanAccessReturnScreen` bit(1) DEFAULT NULL,
  `CanAccessBarbellScreen` bit(1) DEFAULT NULL,
  `CanViewBondStats` bit(1) DEFAULT NULL,
  `CanAccessRiskMetrics` bit(1) DEFAULT NULL,
  `CanAccessPortfolioNotepad` bit(1) DEFAULT NULL,
  `CanAccessProfitAndLoss` bit(1) DEFAULT NULL,
  `CanAccessPortfolioScorecard` bit(1) DEFAULT NULL,
  `CanAccessRiskProfile` bit(1) DEFAULT NULL,
  `CanAccessStressTesting` bit(1) DEFAULT NULL,
  `CanViewFaceValue` bit(1) DEFAULT NULL,
  `CanAccessMyTransactions` bit(1) DEFAULT NULL,
  `CanAccessAllTransactions` bit(1) DEFAULT NULL,
  `CanViewInvoices` bit(1) DEFAULT NULL,
  `CanViewAnalysis` bit(1) DEFAULT NULL,
  `CanViewFinancials` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_PortalUserRolePermissions` (`created_by`),
  KEY `ialtered_by_PortalUserRolePermissions` (`altered_by`),
  KEY `iRole_PortalUserRolePermissions` (`Role`),
  KEY `iUser_PortalUserRolePermissions` (`User`),
  CONSTRAINT `FK_PortalUserRolePermissions_Role` FOREIGN KEY (`Role`) REFERENCES `roles` (`Id`),
  CONSTRAINT `FK_PortalUserRolePermissions_User` FOREIGN KEY (`User`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortalUserRolePermissions_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortalUserRolePermissions_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portaluserrolepermissions`
--

LOCK TABLES `portaluserrolepermissions` WRITE;
/*!40000 ALTER TABLE `portaluserrolepermissions` DISABLE KEYS */;
INSERT INTO `portaluserrolepermissions` VALUES (1,NULL,'2025-12-04 18:26:31',NULL,NULL,1,2,_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary ''),(2,NULL,'2025-12-04 18:26:33',NULL,NULL,5,1,_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '\0',_binary '',_binary '\0',_binary '',_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0');
/*!40000 ALTER TABLE `portaluserrolepermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio`
--

DROP TABLE IF EXISTS `portfolio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `ValueDate` datetime DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_Portfolio` (`created_by`),
  KEY `ialtered_by_Portfolio` (`altered_by`),
  KEY `iUserId_Portfolio` (`UserId`),
  CONSTRAINT `FK_Portfolio_UserId` FOREIGN KEY (`UserId`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_Portfolio_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_Portfolio_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio`
--

LOCK TABLES `portfolio` WRITE;
/*!40000 ALTER TABLE `portfolio` DISABLE KEYS */;
/*!40000 ALTER TABLE `portfolio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfoliodata`
--

DROP TABLE IF EXISTS `portfoliodata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfoliodata` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `PortfolioId` int(11) DEFAULT NULL,
  `BondId` int(11) DEFAULT NULL,
  `User` int(11) DEFAULT NULL,
  `Type` varchar(100) DEFAULT NULL,
  `BuyingDate` datetime DEFAULT NULL,
  `SellingDate` datetime DEFAULT NULL,
  `BuyingPrice` decimal(28,8) DEFAULT NULL,
  `SellingPrice` decimal(28,8) DEFAULT NULL,
  `BuyingWAP` decimal(28,8) DEFAULT NULL,
  `SellingWAP` decimal(28,8) DEFAULT NULL,
  `FaceValueBuys` int(11) DEFAULT NULL,
  `FaceValueSales` int(11) DEFAULT NULL,
  `FaceValueBAL` int(11) DEFAULT NULL,
  `ClosingPrice` decimal(28,8) DEFAULT NULL,
  `CouponNET` decimal(28,8) DEFAULT NULL,
  `NextCpnDays` int(11) DEFAULT NULL,
  `RealizedPNL` decimal(28,8) DEFAULT NULL,
  `UnrealizedPNL` decimal(28,8) DEFAULT NULL,
  `OneYrTotalReturn` decimal(28,8) DEFAULT NULL,
  `DirtyPrice` decimal(28,8) DEFAULT NULL,
  `PortfolioValue` int(11) DEFAULT NULL,
  `SpotYTM` decimal(28,8) DEFAULT NULL,
  `Coupon` decimal(28,8) DEFAULT NULL,
  `Duration` decimal(28,8) DEFAULT NULL,
  `MDuration` decimal(28,8) DEFAULT NULL,
  `Dv01` decimal(28,8) DEFAULT NULL,
  `ExpectedShortfall` decimal(28,8) DEFAULT NULL,
  `IsActive` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_PortfolioData` (`created_by`),
  KEY `ialtered_by_PortfolioData` (`altered_by`),
  KEY `iPortfolioId_PortfolioData` (`PortfolioId`),
  KEY `iBondId_PortfolioData` (`BondId`),
  KEY `iUser_PortfolioData` (`User`),
  CONSTRAINT `FK_PortfolioData_BondId` FOREIGN KEY (`BondId`) REFERENCES `statstable` (`Id`),
  CONSTRAINT `FK_PortfolioData_PortfolioId` FOREIGN KEY (`PortfolioId`) REFERENCES `portfolio` (`Id`),
  CONSTRAINT `FK_PortfolioData_User` FOREIGN KEY (`User`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortfolioData_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PortfolioData_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfoliodata`
--

LOCK TABLES `portfoliodata` WRITE;
/*!40000 ALTER TABLE `portfoliodata` DISABLE KEYS */;
/*!40000 ALTER TABLE `portfoliodata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `primarymarkettable`
--

DROP TABLE IF EXISTS `primarymarkettable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `primarymarkettable` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `BondIssueNo` varchar(100) DEFAULT NULL,
  `IssueDate` datetime DEFAULT NULL,
  `MaturityDate` datetime DEFAULT NULL,
  `FirstCallDate` datetime DEFAULT NULL,
  `SecondCallDate` datetime DEFAULT NULL,
  `ParCall1Percent` varchar(100) DEFAULT NULL,
  `ParCall2Percent` varchar(100) DEFAULT NULL,
  `PricingMethod` varchar(100) DEFAULT NULL,
  `DtmOrWal` decimal(28,8) DEFAULT NULL,
  `DayCount` int(11) DEFAULT NULL,
  `FirstCouponDate` datetime DEFAULT NULL,
  `SecondCouponDate` datetime DEFAULT NULL,
  `SpotRate` varchar(100) DEFAULT NULL,
  `ParYield` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_PrimaryMarketTable` (`created_by`),
  KEY `ialtered_by_PrimaryMarketTable` (`altered_by`),
  CONSTRAINT `FK_PrimaryMarketTable_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_PrimaryMarketTable_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `primarymarkettable`
--

LOCK TABLES `primarymarkettable` WRITE;
/*!40000 ALTER TABLE `primarymarkettable` DISABLE KEYS */;
/*!40000 ALTER TABLE `primarymarkettable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotebook`
--

DROP TABLE IF EXISTS `quotebook`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotebook` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `PlacementNo` varchar(100) DEFAULT NULL,
  `AssignedBy` int(11) DEFAULT NULL,
  `ViewingParty` int(11) DEFAULT NULL,
  `BondIssueNo` int(11) DEFAULT NULL,
  `SettlementDate` datetime DEFAULT NULL,
  `BidPrice` decimal(28,8) DEFAULT NULL,
  `BidYield` decimal(28,8) DEFAULT NULL,
  `BidAmount` decimal(28,8) DEFAULT NULL,
  `IndicativeLower` decimal(28,8) DEFAULT NULL,
  `IndicativeHigher` decimal(28,8) DEFAULT NULL,
  `OfferYield` decimal(28,8) DEFAULT NULL,
  `OfferAmount` decimal(28,8) DEFAULT NULL,
  `OfferPrice` decimal(28,8) DEFAULT NULL,
  `Consideration` decimal(28,8) DEFAULT NULL,
  `CommissionNSE` decimal(28,8) DEFAULT NULL,
  `OtherLevies` decimal(28,8) DEFAULT NULL,
  `TotalPayable` decimal(28,8) DEFAULT NULL,
  `TotalReceivable` decimal(28,8) DEFAULT NULL,
  `IsAccepted` bit(1) DEFAULT NULL,
  `ExitDate` datetime DEFAULT NULL,
  `IsBid` bit(1) DEFAULT NULL,
  `IsOffer` bit(1) DEFAULT NULL,
  `IsActive` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_QuoteBook` (`created_by`),
  KEY `ialtered_by_QuoteBook` (`altered_by`),
  KEY `iAssignedBy_QuoteBook` (`AssignedBy`),
  KEY `iViewingParty_QuoteBook` (`ViewingParty`),
  KEY `iBondIssueNo_QuoteBook` (`BondIssueNo`),
  CONSTRAINT `FK_QuoteBook_AssignedBy` FOREIGN KEY (`AssignedBy`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_QuoteBook_BondIssueNo` FOREIGN KEY (`BondIssueNo`) REFERENCES `statstable` (`Id`),
  CONSTRAINT `FK_QuoteBook_ViewingParty` FOREIGN KEY (`ViewingParty`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_QuoteBook_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_QuoteBook_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotebook`
--

LOCK TABLES `quotebook` WRITE;
/*!40000 ALTER TABLE `quotebook` DISABLE KEYS */;
/*!40000 ALTER TABLE `quotebook` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotetransactions`
--

DROP TABLE IF EXISTS `quotetransactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotetransactions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `QuoteId` int(11) DEFAULT NULL,
  `InitiatedBy` int(11) DEFAULT NULL,
  `TransactionNo` varchar(100) DEFAULT NULL,
  `IndicativeLower` decimal(28,8) DEFAULT NULL,
  `IndicativeHigher` decimal(28,8) DEFAULT NULL,
  `BidAmount` decimal(28,8) DEFAULT NULL,
  `OfferAmount` decimal(28,8) DEFAULT NULL,
  `BidYield` decimal(28,8) DEFAULT NULL,
  `BidPrice` decimal(28,8) DEFAULT NULL,
  `OfferYield` decimal(28,8) DEFAULT NULL,
  `OfferPrice` decimal(28,8) DEFAULT NULL,
  `IsAccepted` bit(1) DEFAULT NULL,
  `IsPending` bit(1) DEFAULT NULL,
  `IsRejected` bit(1) DEFAULT NULL,
  `IsDelegated` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_QuoteTransactions` (`created_by`),
  KEY `ialtered_by_QuoteTransactions` (`altered_by`),
  KEY `iQuoteId_QuoteTransactions` (`QuoteId`),
  KEY `iInitiatedBy_QuoteTransactions` (`InitiatedBy`),
  CONSTRAINT `FK_QuoteTransactions_InitiatedBy` FOREIGN KEY (`InitiatedBy`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_QuoteTransactions_QuoteId` FOREIGN KEY (`QuoteId`) REFERENCES `quotebook` (`Id`),
  CONSTRAINT `FK_QuoteTransactions_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_QuoteTransactions_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotetransactions`
--

LOCK TABLES `quotetransactions` WRITE;
/*!40000 ALTER TABLE `quotetransactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `quotetransactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reportdatav2`
--

DROP TABLE IF EXISTS `reportdatav2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reportdatav2` (
  `Oid` char(38) NOT NULL,
  `ObjectTypeName` text DEFAULT NULL,
  `Content` longblob DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `ParametersObjectTypeName` text DEFAULT NULL,
  `IsInplaceReport` bit(1) DEFAULT NULL,
  `PredefinedReportType` text DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_ReportDataV2` (`GCRecord`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reportdatav2`
--

LOCK TABLES `reportdatav2` WRITE;
/*!40000 ALTER TABLE `reportdatav2` DISABLE KEYS */;
/*!40000 ALTER TABLE `reportdatav2` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource`
--

DROP TABLE IF EXISTS `resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resource` (
  `Oid` char(38) NOT NULL,
  `Caption` varchar(100) DEFAULT NULL,
  `Color` int(11) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_Resource` (`GCRecord`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource`
--

LOCK TABLES `resource` WRITE;
/*!40000 ALTER TABLE `resource` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resourceresources_eventevents`
--

DROP TABLE IF EXISTS `resourceresources_eventevents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resourceresources_eventevents` (
  `Events` char(38) DEFAULT NULL,
  `Resources` char(38) DEFAULT NULL,
  `OID` char(38) NOT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  PRIMARY KEY (`OID`),
  UNIQUE KEY `iEventsResources_ResourceResources_EventEvents` (`Events`,`Resources`),
  KEY `iEvents_ResourceResources_EventEvents` (`Events`),
  KEY `iResources_ResourceResources_EventEvents` (`Resources`),
  CONSTRAINT `FK_ResourceResources_EventEvents_Events` FOREIGN KEY (`Events`) REFERENCES `event` (`Oid`),
  CONSTRAINT `FK_ResourceResources_EventEvents_Resources` FOREIGN KEY (`Resources`) REFERENCES `resource` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resourceresources_eventevents`
--

LOCK TABLES `resourceresources_eventevents` WRITE;
/*!40000 ALTER TABLE `resourceresources_eventevents` DISABLE KEYS */;
/*!40000 ALTER TABLE `resourceresources_eventevents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `RoleName` varchar(100) DEFAULT NULL,
  `RoleDescription` longtext DEFAULT NULL,
  `IsAdmin` bit(1) DEFAULT NULL,
  `IsIndividual` bit(1) DEFAULT NULL,
  `IsAgent` bit(1) DEFAULT NULL,
  `IsCorporate` bit(1) DEFAULT NULL,
  `IsBroker` bit(1) DEFAULT NULL,
  `IsAuthorizedDealer` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_Roles` (`created_by`),
  KEY `ialtered_by_Roles` (`altered_by`),
  CONSTRAINT `FK_Roles_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_Roles_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,NULL,NULL,NULL,NULL,'Admin','Has full access to the system',_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0'),(2,NULL,NULL,NULL,NULL,'Individual','Person who just wants to use the system',_binary '\0',_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0'),(3,NULL,NULL,NULL,NULL,'Agent','Authorized personell by Corporates',_binary '\0',_binary '\0',_binary '',_binary '\0',_binary '\0',_binary '\0'),(4,NULL,NULL,NULL,NULL,'Corporate','Institution that has access to system',_binary '\0',_binary '\0',_binary '\0',_binary '',_binary '\0',_binary '\0'),(5,NULL,NULL,NULL,NULL,'Broker','Authorized personell by Corporates',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '',_binary '\0'),(6,NULL,NULL,NULL,NULL,'Authorized Dealer','Authorized personell that can act as broker or corporate',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicerequestreplies`
--

DROP TABLE IF EXISTS `servicerequestreplies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicerequestreplies` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `ServiceRequestId` int(11) DEFAULT NULL,
  `ReplyDescription` longtext DEFAULT NULL,
  `ReplyStatus` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_ServiceRequestReplies` (`created_by`),
  KEY `ialtered_by_ServiceRequestReplies` (`altered_by`),
  KEY `iServiceRequestId_ServiceRequestReplies` (`ServiceRequestId`),
  KEY `iReplyStatus_ServiceRequestReplies` (`ReplyStatus`),
  CONSTRAINT `FK_ServiceRequestReplies_ReplyStatus` FOREIGN KEY (`ReplyStatus`) REFERENCES `servicerequeststatuses` (`Id`),
  CONSTRAINT `FK_ServiceRequestReplies_ServiceRequestId` FOREIGN KEY (`ServiceRequestId`) REFERENCES `servicerequests` (`Id`),
  CONSTRAINT `FK_ServiceRequestReplies_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_ServiceRequestReplies_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicerequestreplies`
--

LOCK TABLES `servicerequestreplies` WRITE;
/*!40000 ALTER TABLE `servicerequestreplies` DISABLE KEYS */;
/*!40000 ALTER TABLE `servicerequestreplies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicerequests`
--

DROP TABLE IF EXISTS `servicerequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicerequests` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `ServiceRequestType` int(11) DEFAULT NULL,
  `RequestCategory` int(11) DEFAULT NULL,
  `RequestSubject` varchar(100) DEFAULT NULL,
  `RequestDescription` longtext DEFAULT NULL,
  `RequestStatuses` int(11) DEFAULT NULL,
  `AssignedTo` int(11) DEFAULT NULL,
  `DueDate` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_ServiceRequests` (`created_by`),
  KEY `ialtered_by_ServiceRequests` (`altered_by`),
  KEY `iServiceRequestType_ServiceRequests` (`ServiceRequestType`),
  KEY `iRequestCategory_ServiceRequests` (`RequestCategory`),
  KEY `iRequestStatuses_ServiceRequests` (`RequestStatuses`),
  KEY `iAssignedTo_ServiceRequests` (`AssignedTo`),
  CONSTRAINT `FK_ServiceRequests_AssignedTo` FOREIGN KEY (`AssignedTo`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_ServiceRequests_RequestCategory` FOREIGN KEY (`RequestCategory`) REFERENCES `servicerequesttypescategories` (`Id`),
  CONSTRAINT `FK_ServiceRequests_RequestStatuses` FOREIGN KEY (`RequestStatuses`) REFERENCES `servicerequeststatuses` (`Id`),
  CONSTRAINT `FK_ServiceRequests_ServiceRequestType` FOREIGN KEY (`ServiceRequestType`) REFERENCES `servicerequesttypes` (`Id`),
  CONSTRAINT `FK_ServiceRequests_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_ServiceRequests_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicerequests`
--

LOCK TABLES `servicerequests` WRITE;
/*!40000 ALTER TABLE `servicerequests` DISABLE KEYS */;
/*!40000 ALTER TABLE `servicerequests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicerequeststatuses`
--

DROP TABLE IF EXISTS `servicerequeststatuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicerequeststatuses` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Status` varchar(100) DEFAULT NULL,
  `Description` varchar(100) DEFAULT NULL,
  `IsOpen` bit(1) DEFAULT NULL,
  `IsClosed` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_ServiceRequestStatuses` (`created_by`),
  KEY `ialtered_by_ServiceRequestStatuses` (`altered_by`),
  CONSTRAINT `FK_ServiceRequestStatuses_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_ServiceRequestStatuses_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicerequeststatuses`
--

LOCK TABLES `servicerequeststatuses` WRITE;
/*!40000 ALTER TABLE `servicerequeststatuses` DISABLE KEYS */;
/*!40000 ALTER TABLE `servicerequeststatuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicerequesttypes`
--

DROP TABLE IF EXISTS `servicerequesttypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicerequesttypes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_ServiceRequestTypes` (`created_by`),
  KEY `ialtered_by_ServiceRequestTypes` (`altered_by`),
  CONSTRAINT `FK_ServiceRequestTypes_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_ServiceRequestTypes_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicerequesttypes`
--

LOCK TABLES `servicerequesttypes` WRITE;
/*!40000 ALTER TABLE `servicerequesttypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `servicerequesttypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicerequesttypescategories`
--

DROP TABLE IF EXISTS `servicerequesttypescategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicerequesttypescategories` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Description` varchar(100) DEFAULT NULL,
  `RequestType` int(11) DEFAULT NULL,
  `Hours` int(11) DEFAULT NULL,
  `TATDays` int(11) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `NewDepartment` varchar(100) DEFAULT NULL,
  `DueDate` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_ServiceRequestTypesCategories` (`created_by`),
  KEY `ialtered_by_ServiceRequestTypesCategories` (`altered_by`),
  KEY `iRequestType_ServiceRequestTypesCategories` (`RequestType`),
  CONSTRAINT `FK_ServiceRequestTypesCategories_RequestType` FOREIGN KEY (`RequestType`) REFERENCES `servicerequesttypes` (`Id`),
  CONSTRAINT `FK_ServiceRequestTypesCategories_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_ServiceRequestTypesCategories_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicerequesttypescategories`
--

LOCK TABLES `servicerequesttypescategories` WRITE;
/*!40000 ALTER TABLE `servicerequesttypescategories` DISABLE KEYS */;
/*!40000 ALTER TABLE `servicerequesttypescategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smslogs`
--

DROP TABLE IF EXISTS `smslogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `smslogs` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Recipient` int(11) DEFAULT NULL,
  `AllRecipientsPhoneNo` longtext DEFAULT NULL,
  `Body` longtext DEFAULT NULL,
  `RoleGroupSendingTo` int(11) DEFAULT NULL,
  `IsDraft` bit(1) DEFAULT NULL,
  `IsSent` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_SMSLogs` (`created_by`),
  KEY `ialtered_by_SMSLogs` (`altered_by`),
  KEY `iRecipient_SMSLogs` (`Recipient`),
  KEY `iRoleGroupSendingTo_SMSLogs` (`RoleGroupSendingTo`),
  CONSTRAINT `FK_SMSLogs_Recipient` FOREIGN KEY (`Recipient`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_SMSLogs_RoleGroupSendingTo` FOREIGN KEY (`RoleGroupSendingTo`) REFERENCES `roles` (`Id`),
  CONSTRAINT `FK_SMSLogs_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_SMSLogs_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smslogs`
--

LOCK TABLES `smslogs` WRITE;
/*!40000 ALTER TABLE `smslogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `smslogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statstable`
--

DROP TABLE IF EXISTS `statstable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statstable` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Otr` varchar(100) DEFAULT NULL,
  `Filter1` int(11) DEFAULT NULL,
  `Filter2` int(11) DEFAULT NULL,
  `Id_` int(11) DEFAULT NULL,
  `BondIssueNo` varchar(100) DEFAULT NULL,
  `IssueDate` datetime DEFAULT NULL,
  `MaturityDate` datetime DEFAULT NULL,
  `ValueDate` datetime DEFAULT NULL,
  `QuotedYield` varchar(100) DEFAULT NULL,
  `SpotYield` decimal(28,8) DEFAULT NULL,
  `DirtyPrice` decimal(28,8) DEFAULT NULL,
  `Coupon` decimal(28,8) DEFAULT NULL,
  `NextCpnDays` int(11) DEFAULT NULL,
  `DtmYrs` decimal(28,8) DEFAULT NULL,
  `Dtc` decimal(28,8) DEFAULT NULL,
  `Duration` decimal(28,8) DEFAULT NULL,
  `MDuration` decimal(28,8) DEFAULT NULL,
  `Convexity` decimal(28,8) DEFAULT NULL,
  `ExpectedReturn` decimal(28,8) DEFAULT NULL,
  `ExpectedShortfall` decimal(28,8) DEFAULT NULL,
  `Dv01` decimal(28,8) DEFAULT NULL,
  `Last91Days` int(11) DEFAULT NULL,
  `Last364Days` int(11) DEFAULT NULL,
  `LqdRank` varchar(100) DEFAULT NULL,
  `Spread` decimal(28,8) DEFAULT NULL,
  `CreditRiskPremium` decimal(28,8) DEFAULT NULL,
  `MdRank` int(11) DEFAULT NULL,
  `ErRank` int(11) DEFAULT NULL,
  `Basis` int(11) DEFAULT NULL,
  `DayCount` int(11) DEFAULT NULL,
  `FirstCallDate` datetime DEFAULT NULL,
  `SecondCallDate` datetime DEFAULT NULL,
  `ParCall1` decimal(28,8) DEFAULT NULL,
  `ParCall2` decimal(28,8) DEFAULT NULL,
  `BtwCalls` decimal(28,8) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_StatsTable` (`created_by`),
  KEY `ialtered_by_StatsTable` (`altered_by`),
  CONSTRAINT `FK_StatsTable_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_StatsTable_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statstable`
--

LOCK TABLES `statstable` WRITE;
/*!40000 ALTER TABLE `statstable` DISABLE KEYS */;
/*!40000 ALTER TABLE `statstable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptionfeatures`
--

DROP TABLE IF EXISTS `subscriptionfeatures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptionfeatures` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `CategoryId` int(11) DEFAULT NULL,
  `SubscriptionPlanId` int(11) DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `Level` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_SubscriptionFeatures` (`created_by`),
  KEY `ialtered_by_SubscriptionFeatures` (`altered_by`),
  KEY `iCategoryId_SubscriptionFeatures` (`CategoryId`),
  KEY `iSubscriptionPlanId_SubscriptionFeatures` (`SubscriptionPlanId`),
  CONSTRAINT `FK_SubscriptionFeatures_CategoryId` FOREIGN KEY (`CategoryId`) REFERENCES `subscriptionfeaturescategories` (`Id`),
  CONSTRAINT `FK_SubscriptionFeatures_SubscriptionPlanId` FOREIGN KEY (`SubscriptionPlanId`) REFERENCES `subscriptionplan` (`Id`),
  CONSTRAINT `FK_SubscriptionFeatures_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_SubscriptionFeatures_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptionfeatures`
--

LOCK TABLES `subscriptionfeatures` WRITE;
/*!40000 ALTER TABLE `subscriptionfeatures` DISABLE KEYS */;
INSERT INTO `subscriptionfeatures` VALUES (1,NULL,NULL,NULL,NULL,1,1,'List MY transactions','View individual subscriber bids/offers',2),(2,NULL,NULL,NULL,NULL,2,1,'Bond Calculator','Perform calculations per Bond selected',1),(3,NULL,NULL,NULL,NULL,2,1,'Dashboard Graphs','Spot Yield Curve & Bond Market Performance Vs Economic Indicators',2),(4,NULL,NULL,NULL,NULL,2,1,'BondScreens - Total Return','Total Return Screen',3),(5,NULL,NULL,NULL,NULL,1,2,'List MY transactions','View individual subscriber bids/offers',1),(6,NULL,NULL,NULL,NULL,1,2,'List ALL transactions','View all subscriber bids/offers',2),(7,NULL,NULL,NULL,NULL,2,2,'Bond Calculator','Perform calculations per Bond selected',1),(8,NULL,NULL,NULL,NULL,2,2,'Dashboard Graphs','Spot Yield Curve & Bond Market Performance Vs Economic Indicators',2),(9,NULL,NULL,NULL,NULL,2,2,'BondScreens - Total Return','Total Return Screen',3),(10,NULL,NULL,NULL,NULL,1,3,'List MY transactions','View individual subscriber bids/offers',1),(11,NULL,NULL,NULL,NULL,1,3,'List ALL transactions','View all subscriber bids/offers',2),(12,NULL,NULL,NULL,NULL,2,3,'Bond Calculator','Perform calculations per Bond selected',1),(13,NULL,NULL,NULL,NULL,2,3,'Dashboard Graphs','Spot Yield Curve & Bond Market Performance Vs Economic Indicators',2),(14,NULL,NULL,NULL,NULL,2,3,'BondScreens - Total Return','Total Return Screen',3),(15,NULL,NULL,NULL,NULL,2,3,'BondScreens - Duration','Duration Screens',4),(16,NULL,NULL,NULL,NULL,2,3,'Barbell vs Bullet Indicators','Bond risk comparison indicators',5),(17,NULL,NULL,NULL,NULL,2,3,'Risk Metrics','Bond risk analytics',6),(18,NULL,NULL,NULL,NULL,3,3,'Portfolio Notepad','Manage portfolio notes',1),(19,NULL,NULL,NULL,NULL,3,3,'Profit & Loss (P&L)','View and analyze P&L statements',2),(20,NULL,NULL,NULL,NULL,3,3,'Portfolio Scorecard','Portfolio performance insights',3),(21,NULL,NULL,NULL,NULL,1,4,'List MY transactions','View individual subscriber bids/offers',1),(22,NULL,NULL,NULL,NULL,1,4,'List ALL transactions','View all subscriber bids/offers',2),(23,NULL,NULL,NULL,NULL,2,4,'Bond Calculator','Perform calculations per Bond selected',1),(24,NULL,NULL,NULL,NULL,2,4,'Dashboard Graphs','Spot Yield Curve & Bond Market Performance Vs Economic Indicators',2),(25,NULL,NULL,NULL,NULL,2,4,'BondScreens - Total Return','Total Return Screen',3),(26,NULL,NULL,NULL,NULL,2,4,'BondScreens - Duration','Duration Screens',4),(27,NULL,NULL,NULL,NULL,2,4,'Barbell vs Bullet Indicators','Bond risk comparison indicators',5),(28,NULL,NULL,NULL,NULL,2,4,'Risk Metrics','Bond risk analytics',6),(29,NULL,NULL,NULL,NULL,3,4,'Portfolio Notepad','Manage portfolio notes',1),(30,NULL,NULL,NULL,NULL,3,4,'Profit & Loss (P&L)','View and analyze P&L statements',2),(31,NULL,NULL,NULL,NULL,3,4,'Portfolio Scorecard','Portfolio performance insights',3),(32,NULL,NULL,NULL,NULL,3,4,'Portfolio Risk Profile','Analyze portfolio risk profile',4),(33,NULL,NULL,NULL,NULL,3,4,'Portfolio Stress Testing','Test portfolio performance under stress',5),(34,NULL,NULL,NULL,NULL,3,4,'Portfolio Face Value Graph','Graphical representation of portfolio face value',6);
/*!40000 ALTER TABLE `subscriptionfeatures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptionfeaturescategories`
--

DROP TABLE IF EXISTS `subscriptionfeaturescategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptionfeaturescategories` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `Level` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_SubscriptionFeaturesCategories` (`created_by`),
  KEY `ialtered_by_SubscriptionFeaturesCategories` (`altered_by`),
  CONSTRAINT `FK_SubscriptionFeaturesCategories_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_SubscriptionFeaturesCategories_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptionfeaturescategories`
--

LOCK TABLES `subscriptionfeaturescategories` WRITE;
/*!40000 ALTER TABLE `subscriptionfeaturescategories` DISABLE KEYS */;
INSERT INTO `subscriptionfeaturescategories` VALUES (1,NULL,NULL,NULL,NULL,'QUOTE BOOK','Bond transaction listings and calculations',1),(2,NULL,NULL,NULL,NULL,'BONDMETRICS','Bond analytics and metrics',2),(3,NULL,NULL,NULL,NULL,'PORTFOLIO ASSISTANT','Portfolio management and risk analysis',3);
/*!40000 ALTER TABLE `subscriptionfeaturescategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptionplan`
--

DROP TABLE IF EXISTS `subscriptionplan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptionplan` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `Level` int(11) DEFAULT NULL,
  `IsActive` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_SubscriptionPlan` (`created_by`),
  KEY `ialtered_by_SubscriptionPlan` (`altered_by`),
  CONSTRAINT `FK_SubscriptionPlan_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_SubscriptionPlan_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptionplan`
--

LOCK TABLES `subscriptionplan` WRITE;
/*!40000 ALTER TABLE `subscriptionplan` DISABLE KEYS */;
INSERT INTO `subscriptionplan` VALUES (1,NULL,NULL,NULL,NULL,'Quote Book (Basic)','Basic access to Quote Book',1,_binary ''),(2,NULL,NULL,NULL,NULL,'Quote Book (Viewer)','Viewer access to Quote Book',2,_binary ''),(3,NULL,NULL,NULL,NULL,'Bondmetrics','Access to Bondmetrics',3,_binary ''),(4,NULL,NULL,NULL,NULL,'Bondmetrics Plus','Full access to Bondmetrics Plus',4,_binary '');
/*!40000 ALTER TABLE `subscriptionplan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `User` int(11) DEFAULT NULL,
  `PlanId` int(11) DEFAULT NULL,
  `DueDate` datetime DEFAULT NULL,
  `AmountPaid` double DEFAULT NULL,
  `Discount` double DEFAULT NULL,
  `SubscriptionStatus` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_Subscriptions` (`created_by`),
  KEY `ialtered_by_Subscriptions` (`altered_by`),
  KEY `iUser_Subscriptions` (`User`),
  KEY `iPlanId_Subscriptions` (`PlanId`),
  KEY `iSubscriptionStatus_Subscriptions` (`SubscriptionStatus`),
  CONSTRAINT `FK_Subscriptions_PlanId` FOREIGN KEY (`PlanId`) REFERENCES `subscriptionplan` (`Id`),
  CONSTRAINT `FK_Subscriptions_SubscriptionStatus` FOREIGN KEY (`SubscriptionStatus`) REFERENCES `subscriptionstatus` (`Id`),
  CONSTRAINT `FK_Subscriptions_User` FOREIGN KEY (`User`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_Subscriptions_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_Subscriptions_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptionstatus`
--

DROP TABLE IF EXISTS `subscriptionstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptionstatus` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `IsActive` bit(1) DEFAULT NULL,
  `IsCancelled` bit(1) DEFAULT NULL,
  `IsExpired` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_SubscriptionStatus` (`created_by`),
  KEY `ialtered_by_SubscriptionStatus` (`altered_by`),
  CONSTRAINT `FK_SubscriptionStatus_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_SubscriptionStatus_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptionstatus`
--

LOCK TABLES `subscriptionstatus` WRITE;
/*!40000 ALTER TABLE `subscriptionstatus` DISABLE KEYS */;
INSERT INTO `subscriptionstatus` VALUES (1,NULL,NULL,NULL,NULL,'ACTIVE','Subsctiption is Active and paid for',_binary '',_binary '\0',_binary '\0'),(2,NULL,NULL,NULL,NULL,'CANCELLED','Subsctiption is rejected',_binary '\0',_binary '',_binary '\0'),(3,NULL,NULL,NULL,NULL,'EXPIRED','Subsctiption due date is already present',_binary '\0',_binary '\0',_binary '');
/*!40000 ALTER TABLE `subscriptionstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `systemrefdocuments`
--

DROP TABLE IF EXISTS `systemrefdocuments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `systemrefdocuments` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `ServiceRequestId` int(11) DEFAULT NULL,
  `MessageId` int(11) DEFAULT NULL,
  `EmailId` int(11) DEFAULT NULL,
  `MessageReplyId` int(11) DEFAULT NULL,
  `ServiceRequestReplyId` int(11) DEFAULT NULL,
  `DocumentName` varchar(100) DEFAULT NULL,
  `DocumentId` varchar(100) DEFAULT NULL,
  `PageId` varchar(100) DEFAULT NULL,
  `LocationUrl` longtext DEFAULT NULL,
  `Extension` varchar(100) DEFAULT NULL,
  `IsMessageAttachment` bit(1) DEFAULT NULL,
  `IsServiceRequestAttachment` bit(1) DEFAULT NULL,
  `IsEmailAttachment` bit(1) DEFAULT NULL,
  `IsInvoice` bit(1) DEFAULT NULL,
  `IsForAdmin` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_SystemRefDocuments` (`created_by`),
  KEY `ialtered_by_SystemRefDocuments` (`altered_by`),
  KEY `iServiceRequestId_SystemRefDocuments` (`ServiceRequestId`),
  KEY `iMessageId_SystemRefDocuments` (`MessageId`),
  KEY `iEmailId_SystemRefDocuments` (`EmailId`),
  KEY `iMessageReplyId_SystemRefDocuments` (`MessageReplyId`),
  KEY `iServiceRequestReplyId_SystemRefDocuments` (`ServiceRequestReplyId`),
  CONSTRAINT `FK_SystemRefDocuments_EmailId` FOREIGN KEY (`EmailId`) REFERENCES `emaillogs` (`Id`),
  CONSTRAINT `FK_SystemRefDocuments_MessageId` FOREIGN KEY (`MessageId`) REFERENCES `message` (`Id`),
  CONSTRAINT `FK_SystemRefDocuments_MessageReplyId` FOREIGN KEY (`MessageReplyId`) REFERENCES `messagereplies` (`Id`),
  CONSTRAINT `FK_SystemRefDocuments_ServiceRequestId` FOREIGN KEY (`ServiceRequestId`) REFERENCES `servicerequests` (`Id`),
  CONSTRAINT `FK_SystemRefDocuments_ServiceRequestReplyId` FOREIGN KEY (`ServiceRequestReplyId`) REFERENCES `servicerequestreplies` (`Id`),
  CONSTRAINT `FK_SystemRefDocuments_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_SystemRefDocuments_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `systemrefdocuments`
--

LOCK TABLES `systemrefdocuments` WRITE;
/*!40000 ALTER TABLE `systemrefdocuments` DISABLE KEYS */;
/*!40000 ALTER TABLE `systemrefdocuments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tableparams`
--

DROP TABLE IF EXISTS `tableparams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tableparams` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `PercentUnderTenYrs` int(11) DEFAULT NULL,
  `PercentOverTenYrs` int(11) DEFAULT NULL,
  `IfbFiveYrs` int(11) DEFAULT NULL,
  `DailyBasis` int(11) DEFAULT NULL,
  `ValueDate` datetime DEFAULT NULL,
  `CbrRate` double DEFAULT NULL,
  `RateProjection` varchar(100) DEFAULT NULL,
  `YtmFloor` double DEFAULT NULL,
  `YtmTr` double DEFAULT NULL,
  `YtmAlpha` double DEFAULT NULL,
  `YtmBeta1` double DEFAULT NULL,
  `YtmBeta2` double DEFAULT NULL,
  `YtmBeta3` double DEFAULT NULL,
  `YtmGamma1` decimal(28,8) DEFAULT NULL,
  `YtmGamma2` decimal(28,8) DEFAULT NULL,
  `Level` double DEFAULT NULL,
  `Slope` double DEFAULT NULL,
  `Curvature` double DEFAULT NULL,
  `Inflation` double DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_TableParams` (`created_by`),
  KEY `ialtered_by_TableParams` (`altered_by`),
  CONSTRAINT `FK_TableParams_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_TableParams_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tableparams`
--

LOCK TABLES `tableparams` WRITE;
/*!40000 ALTER TABLE `tableparams` DISABLE KEYS */;
INSERT INTO `tableparams` VALUES (1,NULL,NULL,NULL,NULL,15,10,0,364,'2021-04-01 00:00:00',0.07,'6.75% - 7.25%',0.0025,0.09041735226591,0.148377114232386,-0.194819589923158,0.0131572641047655,-0.146224093617646,1.00000000,2.00000000,0.118458491912915,0.0251914227580125,-0.00111445548160927,0.059);
/*!40000 ALTER TABLE `tableparams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userroles`
--

DROP TABLE IF EXISTS `userroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userroles` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `User` int(11) DEFAULT NULL,
  `Role` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_UserRoles` (`created_by`),
  KEY `ialtered_by_UserRoles` (`altered_by`),
  KEY `iUser_UserRoles` (`User`),
  KEY `iRole_UserRoles` (`Role`),
  CONSTRAINT `FK_UserRoles_Role` FOREIGN KEY (`Role`) REFERENCES `roles` (`Id`),
  CONSTRAINT `FK_UserRoles_User` FOREIGN KEY (`User`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_UserRoles_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_UserRoles_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userroles`
--

LOCK TABLES `userroles` WRITE;
/*!40000 ALTER TABLE `userroles` DISABLE KEYS */;
INSERT INTO `userroles` VALUES (2,NULL,'2025-12-04 18:26:32',NULL,NULL,1,5),(3,NULL,NULL,NULL,NULL,1,1),(4,NULL,NULL,NULL,NULL,2,1);
/*!40000 ALTER TABLE `userroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `xpobjecttype`
--

DROP TABLE IF EXISTS `xpobjecttype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `xpobjecttype` (
  `OID` int(11) NOT NULL AUTO_INCREMENT,
  `TypeName` varchar(254) DEFAULT NULL,
  `AssemblyName` varchar(254) DEFAULT NULL,
  PRIMARY KEY (`OID`),
  UNIQUE KEY `iTypeName_XPObjectType` (`TypeName`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xpobjecttype`
--

LOCK TABLES `xpobjecttype` WRITE;
/*!40000 ALTER TABLE `xpobjecttype` DISABLE KEYS */;
INSERT INTO `xpobjecttype` VALUES (1,'DevExpress.Persistent.BaseImpl.PermissionPolicy.PermissionPolicyRole','DevExpress.Persistent.BaseImpl.Xpo.v24.1'),(2,'DevExpress.Persistent.BaseImpl.PermissionPolicy.PermissionPolicyTypePermissionObject','DevExpress.Persistent.BaseImpl.Xpo.v24.1'),(3,'DevExpress.Persistent.BaseImpl.PermissionPolicy.PermissionPolicyObjectPermissionsObject','DevExpress.Persistent.BaseImpl.Xpo.v24.1'),(4,'DevExpress.Persistent.BaseImpl.PermissionPolicy.PermissionPolicyNavigationPermissionObject','DevExpress.Persistent.BaseImpl.Xpo.v24.1'),(5,'DevExpress.Persistent.BaseImpl.PermissionPolicy.PermissionPolicyMemberPermissionsObject','DevExpress.Persistent.BaseImpl.Xpo.v24.1'),(6,'BondKonnect.Module.BusinessObjects.ApplicationUser','BondKonnect.Module'),(7,'PermissionPolicyUserUsers_PermissionPolicyRoleRoles',''),(8,'BondKonnect.Module.BusinessObjects.ApplicationUserLoginInfo','BondKonnect.Module'),(9,'BondKonnect.Module.BusinessObjects.Authentication.PortalUserPasswordsHistory','BondKonnect.Module'),(10,'DevExpress.Persistent.BaseImpl.AuditDataItemPersistent','DevExpress.Persistent.BaseImpl.Xpo.v24.1'),(11,'DevExpress.Persistent.BaseImpl.AuditedObjectWeakReference','DevExpress.Persistent.BaseImpl.Xpo.v24.1'),(12,'DevExpress.Persistent.BaseImpl.ModelDifference','DevExpress.Persistent.BaseImpl.Xpo.v24.1'),(13,'DevExpress.Persistent.BaseImpl.ModelDifferenceAspect','DevExpress.Persistent.BaseImpl.Xpo.v24.1'),(14,'DevExpress.Xpo.XPWeakReference','DevExpress.Xpo.v24.1'),(15,'BondKonnect.Module.BusinessObjects.Authentication.PortalUserLogonInfo','BondKonnect.Module'),(16,'BondKonnect.Module.BusinessObjects.Authentication.UserRoles','BondKonnect.Module'),(17,'BondKonnect.Module.BusinessObjects.Authentication.Roles','BondKonnect.Module'),(18,'BondKonnect.Module.BusinessObjects.Authentication.PortalUserRolePermissions','BondKonnect.Module'),(19,'BondKonnect.Module.BusinessObjects.Authentication.PortalUserLoginToken','BondKonnect.Module');
/*!40000 ALTER TABLE `xpobjecttype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `xpostate`
--

DROP TABLE IF EXISTS `xpostate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `xpostate` (
  `Oid` char(38) NOT NULL,
  `Caption` varchar(100) DEFAULT NULL,
  `StateMachine` char(38) DEFAULT NULL,
  `MarkerValue` longtext DEFAULT NULL,
  `TargetObjectCriteria` longtext DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_XpoState` (`GCRecord`),
  KEY `iStateMachine_XpoState` (`StateMachine`),
  CONSTRAINT `FK_XpoState_StateMachine` FOREIGN KEY (`StateMachine`) REFERENCES `xpostatemachine` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xpostate`
--

LOCK TABLES `xpostate` WRITE;
/*!40000 ALTER TABLE `xpostate` DISABLE KEYS */;
/*!40000 ALTER TABLE `xpostate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `xpostateappearance`
--

DROP TABLE IF EXISTS `xpostateappearance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `xpostateappearance` (
  `Oid` char(38) NOT NULL,
  `State` char(38) DEFAULT NULL,
  `AppearanceItemType` varchar(100) DEFAULT NULL,
  `Context` varchar(100) DEFAULT NULL,
  `Criteria` longtext DEFAULT NULL,
  `Method` varchar(100) DEFAULT NULL,
  `TargetItems` varchar(100) DEFAULT NULL,
  `Priority` int(11) DEFAULT NULL,
  `FontColor` int(11) DEFAULT NULL,
  `BackColor` int(11) DEFAULT NULL,
  `FontStyle` int(11) DEFAULT NULL,
  `Enabled` bit(1) DEFAULT NULL,
  `Visibility` int(11) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_XpoStateAppearance` (`GCRecord`),
  KEY `iState_XpoStateAppearance` (`State`),
  CONSTRAINT `FK_XpoStateAppearance_State` FOREIGN KEY (`State`) REFERENCES `xpostate` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xpostateappearance`
--

LOCK TABLES `xpostateappearance` WRITE;
/*!40000 ALTER TABLE `xpostateappearance` DISABLE KEYS */;
/*!40000 ALTER TABLE `xpostateappearance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `xpostatemachine`
--

DROP TABLE IF EXISTS `xpostatemachine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `xpostatemachine` (
  `Oid` char(38) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Active` bit(1) DEFAULT NULL,
  `TargetObjectType` longtext DEFAULT NULL,
  `StatePropertyName` varchar(100) DEFAULT NULL,
  `StartState` char(38) DEFAULT NULL,
  `ExpandActionsInDetailView` bit(1) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_XpoStateMachine` (`GCRecord`),
  KEY `iStartState_XpoStateMachine` (`StartState`),
  CONSTRAINT `FK_XpoStateMachine_StartState` FOREIGN KEY (`StartState`) REFERENCES `xpostate` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xpostatemachine`
--

LOCK TABLES `xpostatemachine` WRITE;
/*!40000 ALTER TABLE `xpostatemachine` DISABLE KEYS */;
/*!40000 ALTER TABLE `xpostatemachine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `xpotransition`
--

DROP TABLE IF EXISTS `xpotransition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `xpotransition` (
  `Oid` char(38) NOT NULL,
  `Caption` varchar(100) DEFAULT NULL,
  `SourceState` char(38) DEFAULT NULL,
  `TargetState` char(38) DEFAULT NULL,
  `Index` int(11) DEFAULT NULL,
  `SaveAndCloseView` bit(1) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_XpoTransition` (`GCRecord`),
  KEY `iSourceState_XpoTransition` (`SourceState`),
  KEY `iTargetState_XpoTransition` (`TargetState`),
  CONSTRAINT `FK_XpoTransition_SourceState` FOREIGN KEY (`SourceState`) REFERENCES `xpostate` (`Oid`),
  CONSTRAINT `FK_XpoTransition_TargetState` FOREIGN KEY (`TargetState`) REFERENCES `xpostate` (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xpotransition`
--

LOCK TABLES `xpotransition` WRITE;
/*!40000 ALTER TABLE `xpotransition` DISABLE KEYS */;
/*!40000 ALTER TABLE `xpotransition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `xpweakreference`
--

DROP TABLE IF EXISTS `xpweakreference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `xpweakreference` (
  `Oid` char(38) NOT NULL,
  `TargetType` int(11) DEFAULT NULL,
  `TargetKey` varchar(100) DEFAULT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  `GCRecord` int(11) DEFAULT NULL,
  `ObjectType` int(11) DEFAULT NULL,
  PRIMARY KEY (`Oid`),
  KEY `iGCRecord_XPWeakReference` (`GCRecord`),
  KEY `iTargetType_XPWeakReference` (`TargetType`),
  KEY `iObjectType_XPWeakReference` (`ObjectType`),
  CONSTRAINT `FK_XPWeakReference_ObjectType` FOREIGN KEY (`ObjectType`) REFERENCES `xpobjecttype` (`OID`),
  CONSTRAINT `FK_XPWeakReference_TargetType` FOREIGN KEY (`TargetType`) REFERENCES `xpobjecttype` (`OID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xpweakreference`
--

LOCK TABLES `xpweakreference` WRITE;
/*!40000 ALTER TABLE `xpweakreference` DISABLE KEYS */;
INSERT INTO `xpweakreference` VALUES ('152b4a83-625b-44c3-a396-f8f6e6092077',13,'[Guid]\'d175f986-a9e3-4460-9f09-7fbce51d82ea\'',0,NULL,14),('15abc012-b6c2-40aa-a56c-49005e1a8c61',16,'[Int32]\'4\'',0,NULL,14),('18270697-f1e9-4e95-a5c6-eb06562bad70',16,'[Int32]\'4\'',0,NULL,14),('1a726f11-0db6-44dc-9e18-f41cf60ea9cf',17,'[Int32]\'5\'',0,NULL,14),('2bb48315-0231-45ad-b5f9-9881838b1365',18,'[Int32]\'1\'',0,NULL,14),('331c7283-f1c1-46e7-a8b9-f0e33963f5b6',13,'[Guid]\'d175f986-a9e3-4460-9f09-7fbce51d82ea\'',0,NULL,14),('349e3e2b-9d24-4ac3-8050-9425ad7fc1cc',19,'[Int32]\'2\'',0,NULL,11),('36c9b22a-a03d-4e37-a57f-b8739be75cc5',16,'[Int32]\'3\'',0,NULL,14),('3f51df32-de3b-42d0-8128-25fee68492ed',16,'[Int32]\'4\'',0,NULL,11),('4c510f35-4d01-4161-8b52-55c26a96f679',15,'[Int32]\'2\'',0,NULL,14),('526b51d1-9722-4457-84cb-dd92cab5510b',NULL,NULL,0,NULL,14),('5cbe18bb-0466-48f1-8b18-4078c7833db3',17,'[Int32]\'1\'',0,NULL,14),('5cf8d3cc-8e13-4d10-a5aa-5ee4b9bac263',18,'[Int32]\'1\'',0,NULL,14),('73e6aede-6705-4bf2-a930-3a8a3a24ab48',17,'[Int32]\'5\'',0,NULL,11),('7f8f06ba-3003-4b8f-af81-64ad6c9f4a8c',17,'[Int32]\'1\'',0,NULL,14),('8f2386b5-0bfe-43ce-b102-d8eebbd049b6',9,'[Int32]\'1\'',0,NULL,11),('8f6327b1-0cc5-4aa5-bc67-11f629d7f49b',15,'[Int32]\'1\'',0,NULL,14),('9408504c-fae9-408b-9ff1-3a78685689ba',15,'[Int32]\'2\'',0,NULL,11),('95bffe7c-7756-4f12-bcee-52cced2d4f93',17,'[Int32]\'1\'',0,NULL,11),('a833ea61-8a30-4bcd-94b6-a5b41fddfc45',12,'[Guid]\'ec4ad779-d0c1-46a4-b9b2-04d74fb9b24c\'',0,NULL,11),('ac800ddf-b9c8-4efd-8d0a-0b2f98ad1102',17,'[Int32]\'5\'',0,NULL,14),('ba014393-e650-4635-91c7-dd3c0b435482',16,'[Int32]\'3\'',0,NULL,14),('bf653bd9-7384-4b54-8909-38f31a39106a',17,'[Int32]\'1\'',0,NULL,14),('c66a3dda-f8ec-4fd4-8245-059dad12a2d8',18,'[Int32]\'1\'',0,NULL,11),('cb5a0bf5-7ae5-4375-b5c6-c8068f23191a',17,'[Int32]\'1\'',0,NULL,14),('d3546401-8d5b-42a6-a8b9-f0712186af60',16,'[Int32]\'3\'',0,NULL,14),('d50d12d0-3407-48c5-81cb-c5642d9b0213',15,'[Int32]\'1\'',0,NULL,11),('d8b1f4b3-2a0b-43ee-804f-2804b8cf7874',15,'[Int32]\'2\'',0,NULL,14),('dae0b260-6a95-416f-83e4-dcbc00f6a7fc',NULL,NULL,0,NULL,14),('dc3c414f-ef6c-4afa-8d88-edb93a56c39f',15,'[Int32]\'2\'',0,NULL,14),('deeb2acf-d5fd-448e-bf12-62e56acd4a58',16,'[Int32]\'3\'',0,NULL,14),('e08ddf1a-6464-42cb-b487-9e67a7ee15b3',13,'[Guid]\'d175f986-a9e3-4460-9f09-7fbce51d82ea\'',0,NULL,11),('fe0a1c41-566f-4508-96bd-639366507656',16,'[Int32]\'3\'',0,NULL,11),('ff42227b-74a7-4e65-b54b-80055517e5ee',12,'[Guid]\'ec4ad779-d0c1-46a4-b9b2-04d74fb9b24c\'',0,NULL,14);
/*!40000 ALTER TABLE `xpweakreference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ytmtable`
--

DROP TABLE IF EXISTS `ytmtable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ytmtable` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `altered_by` int(11) DEFAULT NULL,
  `dola` datetime DEFAULT NULL,
  `Date` datetime DEFAULT NULL,
  `TaylorRule` varchar(100) DEFAULT NULL,
  `Ceiling` varchar(100) DEFAULT NULL,
  `Floor` varchar(100) DEFAULT NULL,
  `Lamda1` varchar(100) DEFAULT NULL,
  `Lamda2` varchar(100) DEFAULT NULL,
  `Alpha` varchar(100) DEFAULT NULL,
  `Beta1` varchar(100) DEFAULT NULL,
  `Beta2` varchar(100) DEFAULT NULL,
  `Beta3` varchar(100) DEFAULT NULL,
  `Cbr` varchar(100) DEFAULT NULL,
  `RateProjection` varchar(100) DEFAULT NULL,
  `Inflation` varchar(100) DEFAULT NULL,
  `Level` varchar(100) DEFAULT NULL,
  `Slope` varchar(100) DEFAULT NULL,
  `Carvature` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `icreated_by_YtmTable` (`created_by`),
  KEY `ialtered_by_YtmTable` (`altered_by`),
  CONSTRAINT `FK_YtmTable_altered_by` FOREIGN KEY (`altered_by`) REFERENCES `portaluserlogoninfo` (`Id`),
  CONSTRAINT `FK_YtmTable_created_by` FOREIGN KEY (`created_by`) REFERENCES `portaluserlogoninfo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ytmtable`
--

LOCK TABLES `ytmtable` WRITE;
/*!40000 ALTER TABLE `ytmtable` DISABLE KEYS */;
/*!40000 ALTER TABLE `ytmtable` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-05 13:34:50
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bondkonnect_api
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_01_10_131832_create_personal_access_tokens_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
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

-- Dump completed on 2025-12-05 13:34:51

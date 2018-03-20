/*
Navicat SQL Server Data Transfer

Source Server         : SQL Server
Source Server Version : 105000
Source Host           : localhost:1433
Source Database       : NotaCheck_DB
Source Schema         : dbo

Target Server Type    : SQL Server
Target Server Version : 105000
File Encoding         : 65001

Date: 2018-03-20 22:51:36
*/


-- ----------------------------
-- Table structure for print_sample_cartlist
-- ----------------------------
DROP TABLE [dbo].[print_sample_cartlist]
GO
CREATE TABLE [dbo].[print_sample_cartlist] (
[id] int NOT NULL IDENTITY(1,1) ,
[cart_number] varchar(20) NULL ,
[gz_no] varchar(10) NULL ,
[code_no] varchar(10) NULL ,
[proc_name] varchar(10) NULL ,
[class_name] varchar(10) NULL ,
[machine_name] varchar(255) NULL ,
[captain_name] varchar(255) NULL ,
[print_date] datetime2(7) NULL ,
[week_name] varchar(255) NULL ,
[prod_name] varchar(255) NULL ,
[week_num] int NULL ,
[rec_time] datetime2(7) NULL ,
[status] int NULL DEFAULT ((0)) 
)


GO
DBCC CHECKIDENT(N'[dbo].[print_sample_cartlist]', RESEED, 196)
GO

-- ----------------------------
-- Indexes structure for table print_sample_cartlist
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table print_sample_cartlist
-- ----------------------------
ALTER TABLE [dbo].[print_sample_cartlist] ADD PRIMARY KEY ([id])
GO

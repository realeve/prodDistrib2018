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

Date: 2018-03-20 22:51:43
*/


-- ----------------------------
-- Table structure for print_sample_machine
-- ----------------------------
DROP TABLE [dbo].[print_sample_machine]
GO
CREATE TABLE [dbo].[print_sample_machine] (
[id] int NOT NULL IDENTITY(1,1) ,
[machine_name] varchar(255) NULL ,
[check_num] int NULL ,
[week_num] int NULL ,
[sample_num] int NULL DEFAULT ((0)) ,
[rec_time] datetime2(7) NULL 
)


GO
DBCC CHECKIDENT(N'[dbo].[print_sample_machine]', RESEED, 90)
GO

-- ----------------------------
-- Indexes structure for table print_sample_machine
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table print_sample_machine
-- ----------------------------
ALTER TABLE [dbo].[print_sample_machine] ADD PRIMARY KEY ([id])
GO

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

Date: 2018-04-11 09:00:22
*/


-- ----------------------------
-- Table structure for print_newproc_plan
-- ----------------------------
DROP TABLE [dbo].[print_newproc_plan]
GO
CREATE TABLE [dbo].[print_newproc_plan] (
[id] int NOT NULL IDENTITY(1,1) ,
[date_type] int NULL ,
[machine_name] varchar(255) NULL ,
[proc_name] varchar(255) NULL ,
[prod_id] int NULL ,
[reason] varchar(255) NULL ,
[num1] int NULL ,
[num2] int NULL ,
[proc_stream1] int NULL ,
[proc_stream2] int NULL ,
[rec_date1] datetime2(7) NULL ,
[rec_date2] datetime2(7) NULL ,
[rec_time] datetime2(7) NULL ,
[complete_num] int NULL DEFAULT ((0)) ,
[complete_status] int NULL DEFAULT ((0)) ,
[alpha_num] varchar(10) NULL 
)


GO
DBCC CHECKIDENT(N'[dbo].[print_newproc_plan]', RESEED, 7)
GO

-- ----------------------------
-- Indexes structure for table print_newproc_plan
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table print_newproc_plan
-- ----------------------------
ALTER TABLE [dbo].[print_newproc_plan] ADD PRIMARY KEY ([id])
GO

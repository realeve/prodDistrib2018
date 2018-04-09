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

Date: 2018-04-09 16:57:53
*/


-- ----------------------------
-- Table structure for print_machinecheck_weak
-- ----------------------------
DROP TABLE [dbo].[print_machinecheck_weak]
GO
CREATE TABLE [dbo].[print_machinecheck_weak] (
[id] int NOT NULL IDENTITY(1,1) ,
[prod_id] int NULL ,
[code_num] varchar(255) NULL ,
[cart_number] varchar(255) NULL ,
[proc_name] varchar(255) NULL ,
[machine_name] varchar(255) NULL ,
[captain_name] varchar(255) NULL ,
[fake_type] varchar(255) NULL ,
[paper_num] int NULL ,
[level_type] int NULL ,
[img_url] varchar(255) NULL ,
[remark] varchar(255) NULL ,
[rec_time] datetime2(7) NULL 
)


GO

-- ----------------------------
-- Indexes structure for table print_machinecheck_weak
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table print_machinecheck_weak
-- ----------------------------
ALTER TABLE [dbo].[print_machinecheck_weak] ADD PRIMARY KEY ([id])
GO

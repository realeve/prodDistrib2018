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

Date: 2018-04-10 10:54:57
*/


-- ----------------------------
-- Table structure for print_machinecheck_multiweak
-- ----------------------------
DROP TABLE [dbo].[print_machinecheck_multiweak]
GO
CREATE TABLE [dbo].[print_machinecheck_multiweak] (
[id] int NOT NULL IDENTITY(1,1) ,
[cart_number] varchar(255) NULL ,
[prod_id] int NULL ,
[proc_name] varchar(255) NULL ,
[machine_name] varchar(255) NULL ,
[captain_name] varchar(255) NULL ,
[fake_type] varchar(255) NULL ,
[kilo_num] varchar(255) NULL ,
[pos_info] varchar(255) NULL ,
[remark] varchar(255) NULL ,
[rec_time] datetime2(7) NULL 
)


GO

-- ----------------------------
-- Indexes structure for table print_machinecheck_multiweak
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table print_machinecheck_multiweak
-- ----------------------------
ALTER TABLE [dbo].[print_machinecheck_multiweak] ADD PRIMARY KEY ([id])
GO

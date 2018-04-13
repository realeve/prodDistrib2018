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

Date: 2018-04-13 08:37:31
*/


-- ----------------------------
-- Table structure for print_wms_proclist
-- ----------------------------
DROP TABLE [dbo].[print_wms_proclist]
GO
CREATE TABLE [dbo].[print_wms_proclist] (
[id] int NOT NULL IDENTITY(1,1) ,
[cart_number] varchar(1) NULL ,
[gz_num] varchar(1) NULL ,
[proc_plan] varchar(255) NULL ,
[proc_real] varchar(255) NULL ,
[rec_time] datetime2(7) NULL ,
[check_type] varchar(255) NULL 
)


GO

-- ----------------------------
-- Records of print_wms_proclist
-- ----------------------------
SET IDENTITY_INSERT [dbo].[print_wms_proclist] ON
GO
SET IDENTITY_INSERT [dbo].[print_wms_proclist] OFF
GO

-- ----------------------------
-- Indexes structure for table print_wms_proclist
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table print_wms_proclist
-- ----------------------------
ALTER TABLE [dbo].[print_wms_proclist] ADD PRIMARY KEY ([id])
GO

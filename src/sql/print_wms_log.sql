/*
Navicat SQL Server Data Transfer

Source Server         : 10.9.5.133 质量数据库
Source Server Version : 105000
Source Host           : 10.9.5.133:1433
Source Database       : NotaCheck_DB
Source Schema         : dbo

Target Server Type    : SQL Server
Target Server Version : 105000
File Encoding         : 65001

Date: 2018-04-12 11:43:24
*/


-- ----------------------------
-- Table structure for print_wms_log
-- ----------------------------
DROP TABLE [dbo].[print_wms_log]
GO
CREATE TABLE [dbo].[print_wms_log] (
[id] int NOT NULL IDENTITY(1,1) ,
[remark] nvarchar(MAX) NULL ,
[rec_time] datetime2(7) NULL ,
[return_info] nvarchar(MAX) NULL 
)


GO

-- ----------------------------
-- Records of print_wms_log
-- ----------------------------
SET IDENTITY_INSERT [dbo].[print_wms_log] ON
GO
SET IDENTITY_INSERT [dbo].[print_wms_log] OFF
GO

-- ----------------------------
-- Indexes structure for table print_wms_log
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table print_wms_log
-- ----------------------------
ALTER TABLE [dbo].[print_wms_log] ADD PRIMARY KEY ([id])
GO

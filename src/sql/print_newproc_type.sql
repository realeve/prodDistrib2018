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

Date: 2018-04-09 19:28:43
*/


-- ----------------------------
-- Table structure for print_newproc_type
-- ----------------------------
DROP TABLE [dbo].[print_newproc_type]
GO
CREATE TABLE [dbo].[print_newproc_type] (
[id] int NOT NULL IDENTITY(1,1) ,
[proc_stream_id] int NULL ,
[proc_stream_name] varchar(255) NULL 
)


GO
DBCC CHECKIDENT(N'[dbo].[print_newproc_type]', RESEED, 3)
GO

-- ----------------------------
-- Records of print_newproc_type
-- ----------------------------
SET IDENTITY_INSERT [dbo].[print_newproc_type] ON
GO
INSERT INTO [dbo].[print_newproc_type] ([id], [proc_stream_id], [proc_stream_name]) VALUES (N'1', N'0', N'8位清分机全检')
GO
GO
INSERT INTO [dbo].[print_newproc_type] ([id], [proc_stream_id], [proc_stream_name]) VALUES (N'2', N'1', N'人工拉号')
GO
GO
INSERT INTO [dbo].[print_newproc_type] ([id], [proc_stream_id], [proc_stream_name]) VALUES (N'3', N'2', N'系统自动分配')
GO
GO
SET IDENTITY_INSERT [dbo].[print_newproc_type] OFF
GO

-- ----------------------------
-- Indexes structure for table print_newproc_type
-- ----------------------------
CREATE UNIQUE INDEX [proc_stream_id] ON [dbo].[print_newproc_type]
([proc_stream_id] ASC) 
WITH (IGNORE_DUP_KEY = ON)
GO

-- ----------------------------
-- Primary Key structure for table print_newproc_type
-- ----------------------------
ALTER TABLE [dbo].[print_newproc_type] ADD PRIMARY KEY ([id])
GO

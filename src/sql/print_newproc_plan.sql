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

Date: 2018-04-09 19:28:35
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
[complete_status] int NULL DEFAULT ((0)) 
)


GO
DBCC CHECKIDENT(N'[dbo].[print_newproc_plan]', RESEED, 3)
GO

-- ----------------------------
-- Records of print_newproc_plan
-- ----------------------------
SET IDENTITY_INSERT [dbo].[print_newproc_plan] ON
GO
INSERT INTO [dbo].[print_newproc_plan] ([id], [date_type], [machine_name], [proc_name], [prod_id], [reason], [num1], [num2], [proc_stream1], [proc_stream2], [rec_date1], [rec_date2], [rec_time], [complete_num], [complete_status]) VALUES (N'1', N'0', N'M81D-2号机', N'新设备', N'4', N'tes', N'24', N'76', N'0', N'2', N'2018-03-31 00:00:00.0000000', null, N'2018-03-31 15:50:34.0000000', N'0', N'0')
GO
GO
INSERT INTO [dbo].[print_newproc_plan] ([id], [date_type], [machine_name], [proc_name], [prod_id], [reason], [num1], [num2], [proc_stream1], [proc_stream2], [rec_date1], [rec_date2], [rec_time], [complete_num], [complete_status]) VALUES (N'2', N'1', N'多功能-3号机', N'新设备', N'4', N'时间范围测试', null, null, N'0', null, N'2018-03-31 00:00:00.0000000', N'2018-04-15 00:00:00.0000000', N'2018-03-31 16:20:48.0000000', N'0', N'0')
GO
GO
INSERT INTO [dbo].[print_newproc_plan] ([id], [date_type], [machine_name], [proc_name], [prod_id], [reason], [num1], [num2], [proc_stream1], [proc_stream2], [rec_date1], [rec_date2], [rec_time], [complete_num], [complete_status]) VALUES (N'3', N'0', N'M81D-2号机', N'新设备', N'4', N'tes', N'24', N'112', N'0', N'2', N'2018-04-03 00:00:00.0000000', null, N'2018-04-03 14:19:07.0000000', N'0', N'0')
GO
GO
SET IDENTITY_INSERT [dbo].[print_newproc_plan] OFF
GO

-- ----------------------------
-- Indexes structure for table print_newproc_plan
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table print_newproc_plan
-- ----------------------------
ALTER TABLE [dbo].[print_newproc_plan] ADD PRIMARY KEY ([id])
GO

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

Date: 2018-04-13 23:02:48
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
[rec_time] datetime2(7) NULL ,
[fake_num] int NULL ,
[complete_status] int NULL ,
[last_proc] varchar(255) NULL ,
[last_machine] varchar(255) NULL ,
[last_rec_time] datetime2(7) NULL 
)


GO
DBCC CHECKIDENT(N'[dbo].[print_machinecheck_multiweak]', RESEED, 3)
GO
IF ((SELECT COUNT(*) from fn_listextendedproperty('MS_Description', 
'SCHEMA', N'dbo', 
'TABLE', N'print_machinecheck_multiweak', 
'COLUMN', N'complete_status')) > 0) 
EXEC sp_updateextendedproperty @name = N'MS_Description', @value = N'完成状态 '
, @level0type = 'SCHEMA', @level0name = N'dbo'
, @level1type = 'TABLE', @level1name = N'print_machinecheck_multiweak'
, @level2type = 'COLUMN', @level2name = N'complete_status'
ELSE
EXEC sp_addextendedproperty @name = N'MS_Description', @value = N'完成状态 '
, @level0type = 'SCHEMA', @level0name = N'dbo'
, @level1type = 'TABLE', @level1name = N'print_machinecheck_multiweak'
, @level2type = 'COLUMN', @level2name = N'complete_status'
GO
IF ((SELECT COUNT(*) from fn_listextendedproperty('MS_Description', 
'SCHEMA', N'dbo', 
'TABLE', N'print_machinecheck_multiweak', 
'COLUMN', N'last_proc')) > 0) 
EXEC sp_updateextendedproperty @name = N'MS_Description', @value = N'最近印刷工序'
, @level0type = 'SCHEMA', @level0name = N'dbo'
, @level1type = 'TABLE', @level1name = N'print_machinecheck_multiweak'
, @level2type = 'COLUMN', @level2name = N'last_proc'
ELSE
EXEC sp_addextendedproperty @name = N'MS_Description', @value = N'最近印刷工序'
, @level0type = 'SCHEMA', @level0name = N'dbo'
, @level1type = 'TABLE', @level1name = N'print_machinecheck_multiweak'
, @level2type = 'COLUMN', @level2name = N'last_proc'
GO

-- ----------------------------
-- Records of print_machinecheck_multiweak
-- ----------------------------
SET IDENTITY_INSERT [dbo].[print_machinecheck_multiweak] ON
GO
INSERT INTO [dbo].[print_machinecheck_multiweak] ([id], [cart_number], [prod_id], [proc_name], [machine_name], [captain_name], [fake_type], [kilo_num], [pos_info], [remark], [rec_time], [fake_num], [complete_status], [last_proc], [last_machine], [last_rec_time]) VALUES (N'1', N'1820A234', N'2', N'胶印', N'8色水胶印机1号', N'王崇润', N'缺印(底纹线条、防复印)', N'1,2,3,4,6', N'3,28,33,35,38', N'testasdfasdf', N'2018-04-10 10:55:31.0000000', null, null, null, null, null)
GO
GO
INSERT INTO [dbo].[print_machinecheck_multiweak] ([id], [cart_number], [prod_id], [proc_name], [machine_name], [captain_name], [fake_type], [kilo_num], [pos_info], [remark], [rec_time], [fake_num], [complete_status], [last_proc], [last_machine], [last_rec_time]) VALUES (N'2', N'1880A321', N'8', N'凹一印', N'W10-1号', N'杨平', N'团花串色', N'1', N'4,6', N'atest', N'2018-04-12 08:37:33.0000000', null, null, null, null, null)
GO
GO
INSERT INTO [dbo].[print_machinecheck_multiweak] ([id], [cart_number], [prod_id], [proc_name], [machine_name], [captain_name], [fake_type], [kilo_num], [pos_info], [remark], [rec_time], [fake_num], [complete_status], [last_proc], [last_machine], [last_rec_time]) VALUES (N'3', N'1820A233', N'2', N'凹印', N'W92-2号', N'赵杰元', N'脏污(返脏、液脏)', N'1', N'4', N'asdfasfd', N'2018-04-12 08:46:05.0000000', N'2222', null, null, null, null)
GO
GO
SET IDENTITY_INSERT [dbo].[print_machinecheck_multiweak] OFF
GO

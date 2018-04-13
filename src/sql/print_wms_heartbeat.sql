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

Date: 2018-04-13 11:34:13
*/


-- ----------------------------
-- Table structure for print_wms_heartbeat
-- ----------------------------
DROP TABLE [dbo].[print_wms_heartbeat]
GO
CREATE TABLE [dbo].[print_wms_heartbeat] (
[id] int NULL ,
[rec_time] datetime2(7) NULL ,
[task_name] varchar(255) NULL 
)


GO

-- ----------------------------
-- Records of print_wms_heartbeat
-- ----------------------------

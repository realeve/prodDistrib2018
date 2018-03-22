/*
Navicat MySQL Data Transfer

Source Server         : MYSQL
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : api_quality

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2018-03-21 10:35:02
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sys_api
-- ----------------------------
DROP TABLE IF EXISTS `sys_api`;
CREATE TABLE `sys_api` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `db_id` int(10) unsigned zerofill DEFAULT '0000000001' COMMENT '数据库id',
  `uid` int(11) DEFAULT NULL COMMENT '接口所属用户id',
  `api_name` varchar(255) DEFAULT NULL COMMENT '接口名字',
  `nonce` varchar(255) DEFAULT NULL COMMENT '唯一字符串',
  `sqlstr` text COMMENT '查询sql',
  `param` varchar(255) DEFAULT NULL COMMENT '参数',
  `remark` text,
  `rec_time` datetime DEFAULT NULL COMMENT '插入时间',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_api
-- ----------------------------
INSERT INTO `sys_api` VALUES ('1', '0000000001', '49', ' 接口列表', 'e61799e7ab', 'SELECT a.id, b.db_name 数据库, a.api_name 接口名称, a.nonce, a.sqlstr 查询语句, ( CASE WHEN isnull(a.param) THEN \'\' ELSE a.param END ) 查询参数, a.rec_time 建立时间, a.update_time 最近更新, a.db_id,a.remark FROM sys_api a INNER JOIN sys_database b on a.db_id = b.id WHERE a.id >3 order by a.id desc', '', ' ', '2017-07-30 03:07:37', '2018-02-26 01:46:10');
INSERT INTO `sys_api` VALUES ('2', '0000000001', '49', '数据库列表', '6119bacd08', 'SELECT a.id,a.db_name text FROM sys_database AS a', '', ' ', '2017-11-24 00:49:19', '2018-02-26 01:03:49');
INSERT INTO `sys_api` VALUES ('3', '0000000001', '49', '数据库列表', 'e4e497e849', 'select id,db_name 数据库名,db_key 配置项键值 from sys_database', '', ' ', '2017-11-24 16:02:10', '2018-02-26 01:03:50');
INSERT INTO `sys_api` VALUES ('18', '0000000001', '49', '更新密码', '63bc967cec', 'update sys_user set psw =? where id =? and psw=MD5(concat(\'wMqSakbLdy9t8LLD\',?))', 'new,uid,old', ' ', '2017-12-18 02:10:47', '2018-02-26 01:03:53');
INSERT INTO `sys_api` VALUES ('19', '0000000001', '49', '用户登录', '209a76b78d', 'select id from sys_user where id =? and psw=MD5(concat(\'wMqSakbLdy9t8LLD\',?))', 'uid,psw', ' ', '2017-12-18 02:50:11', '2018-02-26 01:03:53');
INSERT INTO `sys_api` VALUES ('20', '0000000003', '49', 'orcl测试', 'cfa450c2d0', 'select * from \"tbl_user\" a where a.\"id\"=3', '', ' ', '2018-01-28 17:50:48', '2018-02-26 01:03:54');
INSERT INTO `sys_api` VALUES ('21', '0000000004', '49', 'mssql测试', 'e0db8c647f', 'select * from tblApi a where a.id=1', '', ' ', '2018-01-30 00:11:04', '2018-03-19 22:53:40');
INSERT INTO `sys_api` VALUES ('52', '0000000002', '49', '插入抽样车号列表', 'ecf47927ee', 'insert into dbo.print_sample_cartlist(cart_number,gz_no,code_no,proc_name,class_name,machine_name,captain_name,print_date,week_name,prod_name,week_num,rec_time) values ?', 'values', '@desc:批量插入数据时，约定使用二维数组values参数，格式为[[cart_number,gz_no,code_no,proc_name,class_name,machine_name,captain_name,print_date,week_name,prod_name,week_num,rec_time,status ]]，数组的每一项表示一条数据', '2018-03-19 22:49:24', '2018-03-20 15:48:14');
INSERT INTO `sys_api` VALUES ('53', '0000000002', '49', '插入机台列表', '2bfaf3357e', 'insert into dbo.print_sample_machine(machine_name,check_num,week_num,rec_time ) values ?', 'values', '@desc:批量插入数据时，约定使用二维数组values参数，格式为[[machine_name,check_num,week_num,sample_num,rec_time ]]，数组的每一项表示一条数据', '2018-03-19 23:44:48', '2018-03-20 08:31:43');
INSERT INTO `sys_api` VALUES ('54', '0000000002', '49', '已领取车号数', '40614909a0', 'select count(distinct cart_number) nums from print_sample_cartlist a where week_num=?', 'week_num', '', '2018-03-20 17:04:31', '2018-03-20 17:04:31');
INSERT INTO `sys_api` VALUES ('55', '0000000002', '49', '本周待检车号列表', '38989f6661', 'SELECT a.cart_number 车号,a.gz_no+a.code_no 冠字,a.machine_name 机台,convert(varchar,a.print_date,120) 印刷时间,a.week_name 星期,a.prod_name 品种,a.week_num 周数,a.status 领取状态 FROM print_sample_cartlist a where convert(varchar,rec_time,112) between ? and ? and proc_name=\'印码\' order by a.status', 'tstart,tend', '', '2018-03-20 17:43:04', '2018-03-20 21:32:05');
INSERT INTO `sys_api` VALUES ('56', '0000000002', '49', '人工抽检领活', 'fe353b42f0', 'update print_sample_cartlist set status = 1 where cart_number=?', 'cart_number', '', '2018-03-20 20:58:57', '2018-03-20 21:00:31');
INSERT INTO `sys_api` VALUES ('57', '0000000002', '49', '人工抽检更新设备抽检数', '3bbab164ad', 'update print_sample_machine set sample_num=sample_num+1 where machine_name in (SELECT machine_name FROM print_sample_cartlist where cart_number=?) and week_num in (SELECT week_num FROM print_sample_cartlist where cart_number=?)', 'cart1,cart2', '', '2018-03-20 21:20:46', '2018-03-20 21:20:46');
INSERT INTO `sys_api` VALUES ('58', '0000000002', '49', '各机台产品抽检情况', '0695d9575b', 'select a.machine_name 设备,a.check_num 预计抽检,a.week_num 周数,a.sample_num 实际抽检 from dbo.print_sample_machine as a where convert(varchar,a.rec_time,112) between ? and ? order by 4,1', 'tstart,tend', '', '2018-03-20 21:54:42', '2018-03-20 22:08:19');

-- ----------------------------
-- Table structure for sys_database
-- ----------------------------
DROP TABLE IF EXISTS `sys_database`;
CREATE TABLE `sys_database` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `db_name` varchar(255) DEFAULT NULL,
  `db_key` varchar(255) DEFAULT NULL,
  `db_type` varchar(255) DEFAULT NULL,
  `db_host` varchar(255) DEFAULT NULL,
  `db_username` varchar(255) DEFAULT NULL,
  `db_password` varchar(255) DEFAULT NULL,
  `db_port` varchar(255) DEFAULT NULL,
  `db_database` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_database
-- ----------------------------
INSERT INTO `sys_database` VALUES ('1', '接口管理', 'db1', 'mysql', '127.0.0.1', 'root', 'root', '3306', 'api_quality');
INSERT INTO `sys_database` VALUES ('2', '质量管理数据库', 'db2', 'mssql', '127.0.0.1', 'sa', '123', '1433', 'notacheck_db');
INSERT INTO `sys_database` VALUES ('3', '机台作业系统', 'db4', 'orcl', '127.0.0.1', 'orcl', 'orcl', '1521', 'ORCL');
INSERT INTO `sys_database` VALUES ('4', 'mssql测试', 'db3', 'mssql', '127.0.0.1', 'sa', '123', '1433', 'api');

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `psw` varchar(255) NOT NULL,
  `rec_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES ('49', 'develop', '管理员', '11c292b26e7ca9b11ab892ef8627ea63', '2018-03-12 13:11:59', '2018-03-12 13:11:59');
DROP TRIGGER IF EXISTS `api_nonce`;
DELIMITER ;;
CREATE TRIGGER `api_nonce` BEFORE INSERT ON `sys_api` FOR EACH ROW set new.nonce = substring(MD5(RAND()*100),1,10)
;
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `api_rectime`;
DELIMITER ;;
CREATE TRIGGER `api_rectime` BEFORE INSERT ON `sys_api` FOR EACH ROW SET new.rec_time = CURRENT_TIMESTAMP,new.update_time = CURRENT_TIMESTAMP
;
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `api_update`;
DELIMITER ;;
CREATE TRIGGER `api_update` BEFORE UPDATE ON `sys_api` FOR EACH ROW SET new.update_time = CURRENT_TIMESTAMP
;
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `insert`;
DELIMITER ;;
CREATE TRIGGER `insert` BEFORE INSERT ON `sys_user` FOR EACH ROW SET new.psw = MD5(concat('wMqSakbLdy9t8LLD',new.psw)),new.rec_time = CURRENT_TIMESTAMP
;
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `update`;
DELIMITER ;;
CREATE TRIGGER `update` BEFORE UPDATE ON `sys_user` FOR EACH ROW if new.psw<>old.psw then
   SET new.psw = MD5(concat('wMqSakbLdy9t8LLD',new.psw)),new.update_time = CURRENT_TIMESTAMP;
else
  SET new.update_time = CURRENT_TIMESTAMP;
end if
;;
DELIMITER ;

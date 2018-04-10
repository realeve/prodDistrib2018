/*
Navicat MySQL Data Transfer

Source Server         : MYSQL
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : api_quality

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2018-04-10 13:34:04
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
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_api
-- ----------------------------
INSERT INTO `sys_api` VALUES ('1', '0000000001', '49', ' 接口列表', 'e61799e7ab', 'SELECT a.id, b.db_name 数据库, a.api_name 接口名称, a.nonce, a.sqlstr 查询语句, ( CASE WHEN isnull(a.param) THEN \'\' ELSE a.param END ) 查询参数, a.rec_time 建立时间, a.update_time 最近更新, a.db_id,a.remark FROM sys_api a INNER JOIN sys_database b on a.db_id = b.id WHERE a.id >3 order by a.id desc', '', ' ', '2017-07-30 03:07:37', '2018-02-26 01:46:10');
INSERT INTO `sys_api` VALUES ('2', '0000000001', '49', '数据库列表', '6119bacd08', 'SELECT a.id,a.db_name text FROM sys_database AS a', '', ' ', '2017-11-24 00:49:19', '2018-02-26 01:03:49');
INSERT INTO `sys_api` VALUES ('3', '0000000001', '49', '数据库列表', 'e4e497e849', 'select id,db_name 数据库名,db_key 配置项键值 from sys_database', '', ' ', '2017-11-24 16:02:10', '2018-02-26 01:03:50');
INSERT INTO `sys_api` VALUES ('18', '0000000001', '49', '更新密码', '63bc967cec', 'update sys_user set psw =? where id =? and psw=MD5(concat(\'wMqSakbLdy9t8LLD\',?))', 'new,uid,old', ' ', '2017-12-18 02:10:47', '2018-02-26 01:03:53');
INSERT INTO `sys_api` VALUES ('19', '0000000001', '49', '用户登录', '209a76b78d', 'select id from sys_user where id =? and psw=MD5(concat(\'wMqSakbLdy9t8LLD\',?))', 'uid,psw', ' ', '2017-12-18 02:50:11', '2018-02-26 01:03:53');
INSERT INTO `sys_api` VALUES ('20', '0000000003', '49', '全幅面orcl测试', 'cfa450c2d0', 'select * from DIC_MACHINES t', '', ' ', '2018-01-28 17:50:48', '2018-03-22 09:45:28');
INSERT INTO `sys_api` VALUES ('21', '0000000004', '49', 'mssql测试', 'e0db8c647f', 'select * from tblApi a where a.id=1', '', ' ', '2018-01-30 00:11:04', '2018-03-19 22:53:40');
INSERT INTO `sys_api` VALUES ('52', '0000000002', '49', '插入抽样车号列表', 'ecf47927ee', 'insert into dbo.print_sample_cartlist(cart_number,gz_no,code_no,proc_name,class_name,machine_name,captain_name,print_date,week_name,prod_name,week_num,rec_time) values ?', 'values', '@desc:批量插入数据时，约定使用二维数组values参数，格式为[[cart_number,gz_no,code_no,proc_name,class_name,machine_name,captain_name,print_date,week_name,prod_name,week_num,rec_time,status ]]，数组的每一项表示一条数据', '2018-03-19 22:49:24', '2018-03-20 15:48:14');
INSERT INTO `sys_api` VALUES ('53', '0000000002', '49', '插入机台列表', '2bfaf3357e', 'insert into dbo.print_sample_machine(machine_name,check_num,week_num,rec_time ) values ?', 'values', '@desc:批量插入数据时，约定使用二维数组values参数，格式为[[machine_name,check_num,week_num,sample_num,rec_time ]]，数组的每一项表示一条数据', '2018-03-19 23:44:48', '2018-03-20 08:31:43');
INSERT INTO `sys_api` VALUES ('54', '0000000002', '49', '已领取车号数', '40614909a0', 'select count(distinct cart_number) nums from print_sample_cartlist a where week_num=?', 'week_num', '', '2018-03-20 17:04:31', '2018-03-20 17:04:31');
INSERT INTO `sys_api` VALUES ('55', '0000000002', '49', '本周待检车号列表', '38989f6661', 'SELECT distinct a.cart_number 车号,a.gz_no+a.code_no 冠字,a.machine_name 机台,(case when a.week_name=\'星期一\' then \'是\' else \'否\' end) 周一,a.prod_name 品种,a.week_num 周数,a.status 领取状态 FROM print_sample_cartlist a where convert(varchar,rec_time,112) between ? and ? and proc_name=\'印码\' order by a.status,4 desc', 'tstart,tend', '', '2018-03-20 17:43:04', '2018-03-22 15:29:43');
INSERT INTO `sys_api` VALUES ('56', '0000000002', '49', '人工抽检领活', 'fe353b42f0', 'update print_sample_cartlist set status = 1 where cart_number=?', 'cart_number', '', '2018-03-20 20:58:57', '2018-03-20 21:00:31');
INSERT INTO `sys_api` VALUES ('57', '0000000002', '49', '人工抽检更新设备抽检数', '3bbab164ad', 'update print_sample_machine set sample_num=sample_num+1 where machine_name in (SELECT machine_name FROM print_sample_cartlist where cart_number=?) and week_num in (SELECT week_num FROM print_sample_cartlist where cart_number=?)', 'cart1,cart2', '', '2018-03-20 21:20:46', '2018-03-20 21:20:46');
INSERT INTO `sys_api` VALUES ('58', '0000000002', '49', '各机台产品抽检情况', '0695d9575b', 'select a.machine_name 设备,a.check_num 预计抽检,a.week_num 周数,a.sample_num 实际抽检 from dbo.print_sample_machine as a where convert(varchar,a.rec_time,112) between ? and ? order by 4,1', 'tstart,tend', '', '2018-03-20 21:54:42', '2018-03-20 22:08:19');
INSERT INTO `sys_api` VALUES ('59', '0000000002', '49', 'SQL Server Test', '08707bf34a', 'SELECT 生产日期 AS 日期,品种,round(AVG(好品率),2) AS 好品率 FROM [dbo].[view_print_hecha] WHERE 生产日期 = ( SELECT max(producedate) FROM MaHouData ) GROUP BY 品种,生产日期 UNION ALL SELECT 生产日期 / 100 AS 日期,品种,round(AVG(好品率),2) AS 好品率 FROM [dbo].[view_print_hecha] WHERE 生产日期 / 100 = ( SELECT TOP 1 producedate / 100 FROM MaHouData WHERE ProduceDate < ( SELECT MAX (ProduceDate) FROM mahoudata ) ORDER BY ProduceDate DESC ) GROUP BY 品种,生产日期 / 100', '', '', '2018-03-21 18:50:04', '2018-03-21 18:50:04');
INSERT INTO `sys_api` VALUES ('60', '0000000005', '49', '小张核查 orcl 测试', '1a04d10590', 'select * from DIC_MACHINES t', '', '', '2018-03-22 09:33:27', '2018-03-22 09:33:27');
INSERT INTO `sys_api` VALUES ('61', '0000000006', '49', '在线清数 ORCL测试', 'ebe9477879', 'select * from DIC_MACHINES t', '', '', '2018-03-22 09:41:08', '2018-03-22 09:41:08');
INSERT INTO `sys_api` VALUES ('62', '0000000007', '49', '码后核查orcl测试', '462b972c27', 'select * from DIC_MACHINES t', '', '', '2018-03-22 09:45:48', '2018-03-22 09:45:48');
INSERT INTO `sys_api` VALUES ('63', '0000000008', '49', 'czuser orcl测试', 'aac86106cc', 'select * from TBLUSER t', '', '', '2018-03-22 10:19:11', '2018-03-22 10:19:11');
INSERT INTO `sys_api` VALUES ('64', '0000000009', '49', '装箱系统 ORCL数据测试', 'e34c9caba0', 'select * from QA_JFZX_OPERATOR t', '', '', '2018-03-22 10:23:42', '2018-03-22 10:24:05');
INSERT INTO `sys_api` VALUES ('65', '0000000010', '49', '装箱系统历史数据 orcl测试', 'f93c8377bb', 'select * from QA_JFZX_OPERATOR t', '', '', '2018-03-22 10:27:04', '2018-03-22 10:27:04');
INSERT INTO `sys_api` VALUES ('66', '0000000011', '49', '数据共享平台 orcl测试', '2ca6a0498c', 'select * from DIM_540_EQP_SD_TYPE t', '', '', '2018-03-22 10:34:49', '2018-03-22 10:34:49');
INSERT INTO `sys_api` VALUES ('67', '0000000013', '49', '库管系统 ORCL测试', '2bd989214c', 'select * from tbperson where intpersonid < 10', '', '', '2018-03-22 11:02:14', '2018-03-22 13:31:46');
INSERT INTO `sys_api` VALUES ('68', '0000000014', '49', '机台作业 orcl测试', '33e8972df1', 'select * from VIEW_CARTFINDER t where t.车号=\'1240A267\'', '', '', '2018-03-22 11:05:25', '2018-03-22 14:50:10');
INSERT INTO `sys_api` VALUES ('69', '0000000014', '49', '产品抽检车号原始记录', '9e2d18889f', 'SELECT a.车号,a.冠号,a.字号,a.工序,a.班次,a.机台,a.机长,to_char(a.开始时间,\'YYYY-MM-DD\') 生产日期,to_char(a.开始时间,\'hh24:mm:ss\') 开始时间,to_char(a.开始时间,\'day\') 星期,(case when to_char(a.开始时间,\'day\')=\'星期一\' then 1 when to_char(a.开始时间,\'day\')=\'星期二\' then 2 when to_char(a.开始时间,\'day\')=\'星期三\' then 3 when to_char(a.开始时间,\'day\')=\'星期四\' then 4 when to_char(a.开始时间,\'day\')=\'星期五\' then 5 when to_char(a.开始时间,\'day\')=\'星期六\' then 6 else 7 end) dayIdx,a.品种 FROM CDYC_USER.VIEW_CARTFINDER a where substr(a.工序,0,1) in (\'胶\',\'凹\',\'印\',\'丝\') and a.车号 in (SELECT a.车号 FROM CDYC_USER.VIEW_CARTFINDER a where to_char(a.开始时间,\'YYYYMMDD\') between ? and ? and a.工艺=\'码后核查\' and a.工序=\'印码\' ) and(a.工序<>\'印码\' or (a.工序=\'印码\' and to_char(a.开始时间,\'YYYYMMDD\') between ? and ? ) ) order by 4,6,11,9', 'tstart,tend,tstart2,tend2', '', '2018-03-22 14:31:23', '2018-03-22 14:50:02');
INSERT INTO `sys_api` VALUES ('70', '0000000002', '49', '印码机台列表', '6410480d19', 'SELECT rtrim(MachineName) name FROM MachineData where MachineTypeID between 1 and 6 order by MachineID', '', '', '2018-03-29 20:25:54', '2018-03-29 20:26:35');
INSERT INTO `sys_api` VALUES ('71', '0000000002', '49', '印钞品种列表', '0fff65bc40', 'select ProductID value,ProductName name from ProductData a where a.ProductID<>7 order by 1', '', '', '2018-03-29 20:46:06', '2018-03-29 20:46:06');
INSERT INTO `sys_api` VALUES ('72', '0000000002', '49', '异常产品原因列表', '2b853fe9ed', 'select DISTINCT proc_name from Print_Abnormal_Prod', '', '', '2018-03-29 21:04:02', '2018-03-29 21:04:02');
INSERT INTO `sys_api` VALUES ('73', '0000000002', '49', '异常产品车号列表', '2dcf6571e6', 'SELECT * FROM view_print_abnormal_prod a where a.记录日期 between ? and ?', 'tstart,tend', '', '2018-03-29 22:25:18', '2018-03-31 16:54:02');
INSERT INTO `sys_api` VALUES ('74', '0000000002', '49', '按开始时间插入四新计划', '05807b4c13', 'insert into dbo.print_newproc_plan(date_type,machine_name,proc_name,prod_id,reason,num1,num2,proc_stream1,proc_stream2,rec_date1,rec_time ) values (?,?,?,?,?,?,?,?,?,?,?)', 'date_type,machine_name,proc_name,prod_id,reason,num1,num2,proc_stream1,proc_stream2,rec_date1,rec_time', '', '2018-03-31 15:39:16', '2018-03-31 15:46:10');
INSERT INTO `sys_api` VALUES ('75', '0000000002', '49', '四新计划列表', '6ac934ad66', 'SELECT * FROM view_print_newproc_plan where convert(varchar,[记录时间],120) between ? and ? order by id desc', 'tstart,tend', '', '2018-03-31 16:14:57', '2018-03-31 16:28:12');
INSERT INTO `sys_api` VALUES ('76', '0000000002', '49', '按时间范围插入四新计划', '1335f12ee9', 'insert into dbo.print_newproc_plan(date_type,machine_name,proc_name,prod_id,reason,proc_stream1,rec_date1,rec_date2,rec_time ) values (?,?,?,?,?,?,?,?,?)', 'date_type,machine_name,proc_name,prod_id,reason,proc_stream1,rec_date1,rec_date2,rec_time', '', '2018-03-31 16:19:22', '2018-03-31 16:19:22');
INSERT INTO `sys_api` VALUES ('77', '0000000002', '49', '添加异常品', 'd9072e2900', 'insert into print_abnormal_prod(prod_id,cart_number,rec_date,machine_name,proc_name,reason,proc_stream ) values (?,?,?,?,?,?,?)', 'prod_id,cart_number,rec_date,machine_name,proc_name,reason,proc_stream', '', '2018-03-31 16:44:54', '2018-03-31 16:44:54');
INSERT INTO `sys_api` VALUES ('78', '0000000002', '49', '未完成的全检任务计划列表', 'b36aab89f7', 'SELECT a.id,a.date_type,a.machine_name,a.proc_name,b.ProductName,a.reason,isnull(a.num1,0) num1,isnull(a.num2,0) num2,a.proc_stream1,a.proc_stream2,CONVERT (VARCHAR,a.rec_date1,112) rec_date1,CONVERT (VARCHAR,a.rec_date2,112) rec_date2,a.complete_num,a.complete_status FROM dbo.print_newproc_plan AS a INNER JOIN ProductData b on a.prod_id = b.ProductID WHERE a.complete_status = 0', '', '', '2018-04-01 17:26:42', '2018-04-01 23:00:10');
INSERT INTO `sys_api` VALUES ('79', '0000000014', '49', '冠字查车号', '797066c5d6', 'SELECT 车号 cartNumber,冠号 carNumber,字号 gzNumber,工艺 techTypeName,工序 procName,班次 workClassName,机台 machineName,机长 captainName,班组 teamName,班长 monitorName,产量 printNum,to_char(开始时间,\\\'YYYY-MM-DD hh:mm:ss\\\') startDate,品种 productName FROM CDYC_USER.VIEW_CARTFINDER A WHERE 品种 = ? AND ( ( 冠号 = ? AND 字号 BETWEEN ? AND ? ) OR ( 冠号 = ? AND 字号 BETWEEN ? AND ? ) ) ORDER BY 开始时间', 'prod,alpha,start,end,alpha2,start2,end2', '', '2018-04-09 11:53:13', '2018-04-09 11:53:13');
INSERT INTO `sys_api` VALUES ('80', '0000000002', '49', '添加机检弱项信息', 'c2f98ddf63', 'insert into print_machinecheck_weak(prod_id,code_num,cart_number,proc_name,machine_name,captain_name,fake_type,paper_num,level_type,img_url,remark,rec_time ) values (?,?,?,?,?,?,?,?,?,?,?,?)', 'prod_id,code_num,cart_number,proc_name,machine_name,captain_name,fake_type,paper_num,level_type,img_url,remark,rec_time', '', '2018-04-09 16:57:02', '2018-04-09 16:57:02');
INSERT INTO `sys_api` VALUES ('81', '0000000002', '49', '机检弱项记废列表', 'a22afbf675', 'SELECT a.[品种],a.[号码信息],a.[车号],a.[工序],a.[设备],a.[机长],a.[类型],a.[张数],a.[记废等级],a.[缺陷图像],a.[备注],a.[登记时间] FROM view_print_machinecheck_weak a where 登记日期 between ? and ?', 'tstart,tend', '', '2018-04-09 18:00:54', '2018-04-09 18:00:54');
INSERT INTO `sys_api` VALUES ('82', '0000000014', '49', '车号信息查询', '32635d468b', 'SELECT 车号 cartNumber,冠号 carNumber,字号 gzNumber,工艺 techTypeName,工序 procName,班次 workClassName,机台 machineName,机长 captainName,班组 teamName,班长 monitorName,产量 printNum,to_char(开始时间,\\\'YYYY-MM-DD hh:mm:ss\\\') startDate,品种 productName FROM CDYC_USER.VIEW_CARTFINDER A WHERE 车号 = ? ORDER BY 开始时间', 'cart', '', '2018-04-10 10:30:01', '2018-04-10 10:30:01');
INSERT INTO `sys_api` VALUES ('83', '0000000002', '49', '机台连续废信息通知', '3475990fbf', 'insert into print_machinecheck_multiweak(cart_number,prod_id,proc_name,machine_name,captain_name,fake_type,kilo_num,pos_info,remark,rec_time ) values (?,?,?,?,?,?,?,?,?,?)', 'cart_number,prod_id,proc_name,machine_name,captain_name,fake_type,kilo_num,pos_info,remark,rec_time', '', '2018-04-10 10:50:11', '2018-04-10 10:51:55');
INSERT INTO `sys_api` VALUES ('84', '0000000002', '49', '机台是否通知作废信息', '4c10668fdd', 'select a.cart_number,a.machine_name,a.captain_name,a.fake_type,a.kilo_num,a.pos_info,a.remark,convert(varchar,a.rec_time,112) rec_time from print_machinecheck_multiweak a where a.cart_number=?', 'cart_number', '', '2018-04-10 13:11:51', '2018-04-10 13:11:51');
DROP TRIGGER IF EXISTS `api_nonce`;
DELIMITER ;;
CREATE TRIGGER `api_nonce` BEFORE INSERT ON `sys_api` FOR EACH ROW set new.nonce = substring(MD5(RAND()*100),1,10)
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `api_rectime`;
DELIMITER ;;
CREATE TRIGGER `api_rectime` BEFORE INSERT ON `sys_api` FOR EACH ROW SET new.rec_time = CURRENT_TIMESTAMP,new.update_time = CURRENT_TIMESTAMP
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `api_update`;
DELIMITER ;;
CREATE TRIGGER `api_update` BEFORE UPDATE ON `sys_api` FOR EACH ROW SET new.update_time = CURRENT_TIMESTAMP
;;
DELIMITER ;

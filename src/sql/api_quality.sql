/*
Navicat MySQL Data Transfer

Source Server         : MYSQL
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : api_quality

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2018-05-08 17:23:30
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
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8;

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
INSERT INTO `sys_api` VALUES ('69', '0000000014', '49', '产品抽检车号原始记录', '9e2d18889f', 'SELECT a.车号,a.冠号,a.字号,a.工序,a.班次,a.机台,a.机长,to_char(a.开始时间,\'YYYY-MM-DD\') 生产日期,to_char(a.开始时间,\'hh24:mi:ss\') 开始时间,to_char(a.开始时间,\'day\') 星期,(case when to_char(a.开始时间,\'day\')=\'星期一\' then 1 when to_char(a.开始时间,\'day\')=\'星期二\' then 2 when to_char(a.开始时间,\'day\')=\'星期三\' then 3 when to_char(a.开始时间,\'day\')=\'星期四\' then 4 when to_char(a.开始时间,\'day\')=\'星期五\' then 5 when to_char(a.开始时间,\'day\')=\'星期六\' then 6 else 7 end) dayIdx,a.品种 FROM CDYC_USER.VIEW_CARTFINDER a where substr(a.工序,0,1) in (\'胶\',\'凹\',\'印\',\'丝\') and a.车号 in (SELECT a.车号 FROM CDYC_USER.VIEW_CARTFINDER a where to_char(a.开始时间,\'YYYYMMDD\') between ? and ? and a.工艺=\'码后核查\' and a.工序=\'印码\' ) and(a.工序<>\'印码\' or (a.工序=\'印码\' and to_char(a.开始时间,\'YYYYMMDD\') between ? and ? ) ) order by 4,6,11,9', 'tstart,tend,tstart2,tend2', '', '2018-03-22 14:31:23', '2018-04-16 17:22:23');
INSERT INTO `sys_api` VALUES ('70', '0000000002', '49', '印码机台列表', '6410480d19', 'SELECT rtrim(MachineName) name FROM MachineData where MachineTypeID between 1 and 6 order by MachineID', '', '', '2018-03-29 20:25:54', '2018-03-29 20:26:35');
INSERT INTO `sys_api` VALUES ('71', '0000000002', '49', '印钞品种列表', '0fff65bc40', 'select ProductID value,ProductName name from ProductData a where a.ProductID<>7 order by 1', '', '', '2018-03-29 20:46:06', '2018-03-29 20:46:06');
INSERT INTO `sys_api` VALUES ('72', '0000000002', '49', '异常产品原因列表', '2b853fe9ed', 'select DISTINCT abnormal_type proc_name from Print_Abnormal_Prod', '', '', '2018-03-29 21:04:02', '2018-04-11 12:49:20');
INSERT INTO `sys_api` VALUES ('73', '0000000002', '49', '异常产品车号列表', '2dcf6571e6', 'SELECT * FROM view_print_abnormal_prod a where a.记录日期 between ? and ?', 'tstart,tend', '', '2018-03-29 22:25:18', '2018-03-31 16:54:02');
INSERT INTO `sys_api` VALUES ('74', '0000000002', '49', '按开始时间插入四新计划', '05807b4c13', 'insert into dbo.print_newproc_plan(date_type,machine_name,proc_name,prod_id,reason,num1,num2,proc_stream1,proc_stream2,rec_date1,rec_time,task_name ) values (?,?,?,?,?,?,?,?,?,?,?,?)', 'date_type,machine_name,proc_name,prod_id,reason,num1,num2,proc_stream1,proc_stream2,rec_date1,rec_time,task_name', '', '2018-03-31 15:39:16', '2018-04-12 18:25:33');
INSERT INTO `sys_api` VALUES ('75', '0000000002', '49', '四新计划列表', '6ac934ad66', 'SELECT * FROM view_print_newproc_plan where convert(varchar,[记录时间],120) between ? and ? order by id desc', 'tstart,tend', '', '2018-03-31 16:14:57', '2018-03-31 16:28:12');
INSERT INTO `sys_api` VALUES ('76', '0000000002', '49', '按时间范围插入四新计划', '1335f12ee9', 'insert into dbo.print_newproc_plan(date_type,machine_name,proc_name,prod_id,reason,proc_stream1,rec_date1,rec_date2,rec_time,task_name ) values (?,?,?,?,?,?,?,?,?,?)', 'date_type,machine_name,proc_name,prod_id,reason,proc_stream1,rec_date1,rec_date2,rec_time,task_name ', '', '2018-03-31 16:19:22', '2018-04-12 18:25:46');
INSERT INTO `sys_api` VALUES ('77', '0000000002', '49', '添加异常品', 'd9072e2900', 'insert into print_abnormal_prod(prod_id,cart_number,rec_date,machine_name,reason,proc_stream,proc_name,captain_name,prod_date,abnormal_type) values (?,?,?,?,?,?,?,?,?,?)', 'prod_id,cart_number,rec_date,machine_name,reason,proc_stream,proc_name,captain_name,prod_date,abnormal_type', '', '2018-03-31 16:44:54', '2018-04-11 11:21:29');
INSERT INTO `sys_api` VALUES ('78', '0000000002', '49', '未完成的全检任务计划列表', 'b36aab89f7', 'SELECT a.id,a.date_type,a.machine_name,a.proc_name,rtrim(b.ProductName) ProductName,a.reason,isnull(a.num1,0) num1,isnull(a.num2,0) num2,a.proc_stream1,a.proc_stream2,CONVERT (VARCHAR,a.rec_date1,112) rec_date1,CONVERT (VARCHAR,a.rec_date2,112) rec_date2,a.complete_num,a.complete_status,a.alpha_num FROM dbo.print_newproc_plan AS a INNER JOIN ProductData b on a.prod_id = b.ProductID WHERE a.complete_status = 0', '', '', '2018-04-01 17:26:42', '2018-04-12 10:29:19');
INSERT INTO `sys_api` VALUES ('79', '0000000014', '49', '冠字查车号', '797066c5d6', 'SELECT 车号 cartNumber,冠号 carNumber,字号 gzNumber,工艺 techTypeName,工序 procName,班次 workClassName,机台 machineName,机长 captainName,班组 teamName,班长 monitorName,产量 printNum,to_char(开始时间,\'YYYY-MM-DD hh24:mi:ss\') startDate,品种 productName FROM CDYC_USER.VIEW_CARTFINDER A WHERE 品种 = ? AND ( ( 冠号 = ? AND 字号 BETWEEN ? AND ? ) OR ( 冠号 = ? AND 字号 BETWEEN ? AND ? ) ) ORDER BY 开始时间', 'prod,alpha,start,end,alpha2,start2,end2', '', '2018-04-09 11:53:13', '2018-04-16 17:22:02');
INSERT INTO `sys_api` VALUES ('80', '0000000002', '49', '添加机检弱项信息', 'c2f98ddf63', 'insert into print_machinecheck_weak(prod_id,code_num,cart_number,proc_name,machine_name,captain_name,fake_type,paper_num,level_type,img_url,remark,rec_time ) values (?,?,?,?,?,?,?,?,?,?,?,?)', 'prod_id,code_num,cart_number,proc_name,machine_name,captain_name,fake_type,paper_num,level_type,img_url,remark,rec_time', '', '2018-04-09 16:57:02', '2018-04-09 16:57:02');
INSERT INTO `sys_api` VALUES ('81', '0000000002', '49', '机检弱项记废列表', 'a22afbf675', 'SELECT a.[品种],a.[号码信息],a.[车号],a.[工序],a.[设备],a.[机长],a.[类型],a.[张数],a.[记废等级],a.[缺陷图像],a.[备注],a.[登记时间] FROM view_print_machinecheck_weak a where 登记日期 between ? and ? order by a.[登记时间] desc', 'tstart,tend', '', '2018-04-09 18:00:54', '2018-04-27 16:38:09');
INSERT INTO `sys_api` VALUES ('82', '0000000014', '49', '车号信息查询', '32635d468b', 'SELECT 车号 cartNumber,冠号 carNumber,字号 gzNumber,工艺 techTypeName,工序 procName,班次 workClassName,机台 machineName,机长 captainName,班组 teamName,班长 monitorName,产量 printNum,to_char(开始时间,\'YYYY-MM-DD hh24:mi:ss\') startDate,品种 productName FROM CDYC_USER.VIEW_CARTFINDER A WHERE 车号 = ? ORDER BY 开始时间', 'cart', '', '2018-04-10 10:30:01', '2018-04-16 17:21:53');
INSERT INTO `sys_api` VALUES ('83', '0000000002', '49', '机台连续废信息通知', '3475990fbf', 'insert into print_machinecheck_multiweak(cart_number,prod_id,proc_name,machine_name,captain_name,fake_type,kilo_num,pos_info,remark,rec_time,fake_num ) values (?,?,?,?,?,?,?,?,?,?,?)', 'cart_number,prod_id,proc_name,machine_name,captain_name,fake_type,kilo_num,pos_info,remark,rec_time,fake_num', '', '2018-04-10 10:50:11', '2018-04-12 08:39:25');
INSERT INTO `sys_api` VALUES ('84', '0000000002', '49', '机台是否通知作废信息', '4c10668fdd', 'select a.cart_number,a.machine_name,a.captain_name,a.fake_type,a.kilo_num,a.pos_info,a.remark,convert(varchar,a.rec_time,112) rec_time from print_machinecheck_multiweak a where a.cart_number=?', 'cart_number', '', '2018-04-10 13:11:51', '2018-04-10 13:11:51');
INSERT INTO `sys_api` VALUES ('85', '0000000002', '49', '增加冠字号段验证计划', '2df9bb813c', 'insert into print_newproc_plan(alpha_num,date_type,num1,num2,proc_name,proc_stream1,prod_id,reason,rec_time ,task_name ) values (?,?,?,?,?,?,?,?,?,?)', 'alpha_num,date_type,num1,num2,proc_name,proc_stream1,prod_id,reason,rec_time,task_name ', '', '2018-04-11 08:57:35', '2018-04-12 18:25:58');
INSERT INTO `sys_api` VALUES ('86', '0000000014', '49', '根据车号查询生产信息', 'db8acd1ea1', 'select distinct 工序 \"proc_name\",机台 \"machine_name\",机长 \"captain_name\",to_char(开始时间,\'yyyymmdd\') \"start_time\" from view_cartfinder t where t.车号=?', 'cart', '', '2018-04-11 09:56:16', '2018-04-11 10:07:07');
INSERT INTO `sys_api` VALUES ('87', '0000000002', '49', '流转工艺列表', 'a7835c9ebc', 'select proc_stream_id value ,proc_stream_name name from print_newproc_type a', '', '', '2018-04-11 11:32:42', '2018-04-11 11:32:42');
INSERT INTO `sys_api` VALUES ('88', '0000000014', '49', '印刷工序所有机台列表', '6d0e2a4781', 'select a.machine_id \"machine_id\",dept_name \"dept_name\",machine_no \"machine_name\" from TBBASE_MACHINE_INFO a inner join TBBASE_DEPT_INFO b on a.dept_id = b.dept_id where a.dept_id<25 order by a.dept_id', '', '', '2018-04-11 14:25:33', '2018-04-11 17:23:21');
INSERT INTO `sys_api` VALUES ('89', '0000000014', '49', '机台最近开印品种', 'cab08fa0d8', 'select 品种 \"prod_type\" from (select t.品种,row_number() over ( order by 完成时间 desc ) rn from VIEW_CARTFINDER t where 机台=? order by 完成时间 desc) t where t.rn=1', 'machine_name', '', '2018-04-11 17:32:58', '2018-04-11 17:32:58');
INSERT INTO `sys_api` VALUES ('90', '0000000002', '49', '更新四新计划状态信息', 'a6c66f8d72', 'update print_newproc_plan set complete_num = ?,complete_status = ?,update_time = ? where id=?', 'complete_num,complete_status,update_time,_id', '@id:_id. 参数说明：api 索引序号', '2018-04-12 11:39:03', '2018-04-12 11:39:03');
INSERT INTO `sys_api` VALUES ('91', '0000000002', '49', '记录库管系统日志信息', 'f0500427cb', 'insert into print_wms_log(remark,rec_time,return_info ) values ?', 'values', '@desc:批量插入数据时，约定使用二维数组values参数，格式为[{remark,rec_time,return_info }]，数组的每一项表示一条数据', '2018-04-12 11:44:49', '2018-04-12 11:44:49');
INSERT INTO `sys_api` VALUES ('92', '0000000002', '49', '批量插入立体库四新计划工艺流转信息', 'db02022755', 'insert into dbo.print_wms_proclist(cart_number,gz_num,proc_plan,proc_real,rec_time,check_type,task_id ) values ?', 'values', '@desc:批量插入数据时，约定使用二维数组values参数，格式为[{cart_number,gz_num,proc_plan,proc_real,rec_time }]，数组的每一项表示一条数据', '2018-04-12 22:51:14', '2018-04-17 15:38:08');
INSERT INTO `sys_api` VALUES ('93', '0000000002', '49', '未处理的异常品列表', 'ba126b61bf', 'SELECT distinct a.cart_number,a.proc_stream,a.id FROM Print_Abnormal_Prod a where a.id in (select max(a.id) id from Print_Abnormal_Prod a where complete_status=0 group by a.cart_number)', '', '', '2018-04-13 09:57:02', '2018-04-17 16:03:43');
INSERT INTO `sys_api` VALUES ('94', '0000000002', '49', '记录异常品任务处理状态为已完成', 'ae030c585f', 'update Print_Abnormal_Prod set complete_status=1 where cart_number=?', 'cart_number', '', '2018-04-13 11:29:58', '2018-04-13 11:30:49');
INSERT INTO `sys_api` VALUES ('95', '0000000002', '49', '更新NodeJS 服务心跳', 'eb4416dc92', 'insert into dbo.print_wms_heartbeat(rec_time,task_name ) values (?,?)', 'rec_time,task_name', '', '2018-04-13 11:35:59', '2018-04-13 11:35:59');
INSERT INTO `sys_api` VALUES ('96', '0000000002', '49', '查询NodeJS 服务心跳', '8d7c52c835', 'SELECT a.rec_time,a.task_name FROM dbo.print_wms_heartbeat AS a', '', '', '2018-04-13 11:39:49', '2018-04-13 11:39:49');
INSERT INTO `sys_api` VALUES ('97', '0000000002', '49', '更新Nodejs 服务心跳', 'c7677a2271', 'update dbo.print_wms_heartbeat set rec_time = ? where task_name = ?', 'rec_time,task_name', '', '2018-04-13 11:43:41', '2018-04-13 11:43:41');
INSERT INTO `sys_api` VALUES ('98', '0000000002', '49', '自动排活待处理列表', '8832903756', 'SELECT DISTINCT a.cart_number,a.gz_no + a.code_no gz_num FROM print_sample_cartlist a WHERE ( lock_status = 0 OR lock_status IS NULL ) AND proc_name = \'印码\'', '', '', '2018-04-13 13:58:08', '2018-04-13 14:01:48');
INSERT INTO `sys_api` VALUES ('99', '0000000002', '49', '连续废通知未生产完毕车号列表', '4c9141bdd3', 'select id,cart_number,isnull(last_proc,proc_name) last_proc,isnull(last_machine,machine_name) last_machine,convert(varchar,isnull(last_rec_time,rec_time),120) rec_time from print_machinecheck_multiweak a where a.id in (SELECT max(id) id FROM print_machinecheck_multiweak where complete_status=0 or complete_status is null group by cart_number)', '', '', '2018-04-13 15:17:39', '2018-04-13 22:24:03');
INSERT INTO `sys_api` VALUES ('100', '0000000001', '49', '车号最近生产工序', '97cfc715f4', 'select 车号 \"cart_number\",工序 \"last_proc\",机台 \"machine_name\" ,to_char(开始时间,\'YYYY-MM-DD HH24:mi:ss\') rec_time from VIEW_CARTFINDER where key_recid in (select max(key_recid) key_recid from VIEW_CARTFINDER t where 车号 in (?) group by 车号) and 车号 in (?)', 'cart1,cart2', '', '2018-04-13 22:22:06', '2018-05-08 17:22:33');
INSERT INTO `sys_api` VALUES ('101', '0000000002', '49', '更新连续废通知产品生产进度信息', 'f4f2a8ef0f', 'update print_machinecheck_multiweak set last_proc = ?,last_machine = ?,last_rec_time = ? where id=?', 'last_proc,last_machine,last_rec_time,_id', '@id:_id. 参数说明：api 索引序号', '2018-04-13 22:28:31', '2018-04-13 22:28:31');
INSERT INTO `sys_api` VALUES ('102', '0000000002', '49', '根据id信息查询连续废通知情况', '66373f0467', 'select * from [dbo].[print_machinecheck_multiweak] where id=?', '_id', '@id:_id. 参数说明：api 索引序号', '2018-04-13 22:34:10', '2018-04-13 22:34:10');
INSERT INTO `sys_api` VALUES ('103', '0000000002', '49', '连续废通知产品已完工', '1db66c49a0', 'update print_machinecheck_multiweak set complete_status = 1 where id=?', '_id', '@id:_id. 参数说明：api 索引序号', '2018-04-13 22:50:00', '2018-04-13 22:50:00');
INSERT INTO `sys_api` VALUES ('104', '0000000002', '49', '待检车号列表', 'fe5d8ec5c9', 'SELECT DISTINCT a.cart_number 车号,a.gz_no + a.code_no 冠字,a.machine_name 机台,(  CASE  WHEN a.week_name = \'星期一\' THEN  \'是\'  ELSE  \'否\'  END ) 周一,convert(varchar,a.print_date,120) 印刷时间,a.prod_name 品种,a.week_num 周数,a.status 领取状态 FROM print_sample_cartlist a WHERE proc_name = \'印码\' ORDER BY a.status,6 DESC,5', '', '', '2018-04-16 17:26:38', '2018-04-16 17:29:45');
INSERT INTO `sys_api` VALUES ('105', '0000000014', '49', '车号查冠字', '153ec8ad02', 'select distinct 车号 \"cart_number\",冠号||字号 \"gz_num\" from view_cartfinder t where t.车号 in (?)', 'carnos', '', '2018-04-16 18:05:03', '2018-04-16 18:25:13');
INSERT INTO `sys_api` VALUES ('106', '0000000014', '49', '机台从某天起生产的X万产品车号列表', 'f47aa951dd', 'select a.车号 from (select a.车号,min(row_num) row_num from (select distinct 车号,row_number() over ( order by 开始时间) row_num from view_cartfinder a where a.机台=? and to_char(开始时间,\'YYYYMMDD\') >=?) a group by a.车号 order by 2) a where rownum<=?', 'machine_name, rec_date, max_carts', '', '2018-04-17 10:20:17', '2018-05-07 15:52:39');
INSERT INTO `sys_api` VALUES ('107', '0000000014', '49', '机台某段时间生产的车号列表', '4463f2c07c', 'select 车号 from view_cartfinder a where a.机台=? and to_char(开始时间,\'YYYYMMDD\') between ? and ? order by a.开始时间', 'machine_name,         rec_date1,         rec_date2', '', '2018-04-17 13:25:44', '2018-04-17 13:29:35');
INSERT INTO `sys_api` VALUES ('108', '0000000014', '49', '某冠字号段车号列表', 'cf760bfe6d', 'select distinct 车号,a.字号 from view_cartfinder a where a.品种=? and a.冠号=? and a.字号 between ? and ? order by a.字号', 'prod_name, gz, start_no, end_no', '', '2018-04-17 13:41:05', '2018-04-17 13:41:05');
INSERT INTO `sys_api` VALUES ('109', '0000000002', '49', '过滤已处理的四新或异常品车号列表', '95aa0001e8', 'select distinct cart_number from print_wms_proclist where check_type=? and task_id=?', 'check_type,task_id', '', '2018-04-17 16:13:29', '2018-04-17 16:13:29');
INSERT INTO `sys_api` VALUES ('110', '0000000002', '49', '机检弱项产品作废汇总', 'b579b29ab8', 'SELECT a.[品种],a.[工序],a.[设备],a.[机长],a.[类型],(case when a.[记废等级]=0 then 0 else a.[记废等级]+1 end ) 记废等级,sum(a.[张数]) 总张数,count(a.[记废等级]) 次数,sum(a.张数*a.记废等级) 总作废开数 FROM view_print_machinecheck_weak a WHERE 登记日期 BETWEEN ? AND ? group by a.[品种],a.[工序],a.[设备],a.[机长],a.[类型],(case when a.[记废等级]=0 then 0 else a.[记废等级]+1 end ) order by 9 desc', 'tstart,tend', '', '2018-04-26 17:12:49', '2018-04-26 17:12:49');
INSERT INTO `sys_api` VALUES ('111', '0000000002', '49', '各机台弱项类型汇总', '0dfc50bc58', 'SELECT a.[品种],a.[工序],a.[设备],a.[机长],a.[类型],sum(a.[张数]) 总张数,count(a.[记废等级]) 次数,sum(a.张数*a.记废等级) 总作废开数 FROM view_print_machinecheck_weak a WHERE 登记日期 BETWEEN ? AND ? group by a.[品种],a.[工序],a.[设备],a.[机长],a.[类型] order by 8 desc', 'tstart,tend', '', '2018-04-27 17:46:10', '2018-04-27 17:46:10');
INSERT INTO `sys_api` VALUES ('112', '0000000002', '49', '胶凹设备机检弱项分布', 'e91457516b', 'SELECT a.[品种],a.[工序],a.[设备],a.[类型],sum(a.[张数]) 总张数,count(a.[记废等级]) 次数 FROM view_print_machinecheck_weak a WHERE 登记日期 BETWEEN ? AND ? group by a.[品种],a.[工序],a.[设备],a.[类型] order by 6 desc', 'tstart,tend', '', '2018-04-27 17:52:25', '2018-04-27 17:52:25');
INSERT INTO `sys_api` VALUES ('113', '0000000002', '49', '当前车号已输入信息', '898aa211d8', 'SELECT a.[品种],a.[号码信息],a.[车号],a.[工序],a.[设备],a.[机长],a.[类型],a.[张数],a.[记废等级],a.[缺陷图像],a.[备注],a.[登记时间] FROM view_print_machinecheck_weak a where a.[车号] =? order by a.[登记时间] desc', 'cart', '', '2018-04-27 18:10:25', '2018-04-27 18:10:25');
INSERT INTO `sys_api` VALUES ('114', '0000000002', '49', '印码机检设备弱项统计信息', 'da79e3d38c', 'SELECT d.ProductName 品种,a.fake_type 类型,c.MachineName 机检设备,sum(a.paper_num) 总张数,count(a.paper_num) 次数 FROM print_machinecheck_weak a INNER JOIN MaHouData b on a.cart_number=b.CartNumber INNER JOIN MachineData c on c.MachineID=b.MachineID INNER JOIN ProductData d on d.ProductID=a.prod_id where convert(varchar,rec_time,112) between ? and ? group by d.ProductName,a.fake_type,c.MachineName order by 4 desc', 'tstart,tend', '', '2018-04-28 23:51:13', '2018-04-29 11:36:58');

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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_database
-- ----------------------------
INSERT INTO `sys_database` VALUES ('1', '接口管理', 'db1', 'mysql', '10.9.5.133', 'root', 'root', '3306', 'api_quality');
INSERT INTO `sys_database` VALUES ('2', '质量信息系统', 'db2', 'mssql', '10.9.5.133', 'sa', 'julien', '1433', 'notacheck_db');
INSERT INTO `sys_database` VALUES ('3', '全幅面', 'db4', 'orcl', '10.9.3.21', 'xzhc', 'xzhc', '1521', 'SJJC');
INSERT INTO `sys_database` VALUES ('4', '工艺质量管理', 'db3', 'mssql', '10.9.5.133', 'sa', 'julien', '1433', 'QuaCenter');
INSERT INTO `sys_database` VALUES ('5', '小张核查', 'db5', 'orcl', '10.9.3.22', 'xzhc', 'xzhc', '1521', 'SJJC');
INSERT INTO `sys_database` VALUES ('6', '在线清数', 'db6', 'orcl', '10.9.5.51', 'zxqs', 'zxqs', '1521', 'zxqs');
INSERT INTO `sys_database` VALUES ('7', '号码三合一', 'db7', 'orcl', '10.9.3.24', 'hmzx', 'hmzx', '1521', 'dcdb');
INSERT INTO `sys_database` VALUES ('8', '钞纸机检', 'db8', 'orcl', '10.9.5.210', 'czuser', 'czuser', '1521', 'ORCL');
INSERT INTO `sys_database` VALUES ('9', '检封装箱系统', 'db9', 'orcl', '10.9.5.25', 'CC_JFZX', 'CC_JFZX', '1521', 'Orcl');
INSERT INTO `sys_database` VALUES ('10', '检封装箱系统_2017', 'db10', 'orcl', '10.9.4.25', 'cc_jfzx', 'cc_jfzx', '1521', 'Orcl');
INSERT INTO `sys_database` VALUES ('11', '总公司数据共享平台', 'db11', 'orcl', '10.8.2.34', 'dwuser', 'dwuser', '1521', 'DSPDB');
INSERT INTO `sys_database` VALUES ('12', '质量信息系统_图像库', 'db12', 'mssql', '10.9.5.133', 'sa', 'julien', '1433', 'NotaCheck_IMGDB');
INSERT INTO `sys_database` VALUES ('13', '库管系统', 'db13', 'orcl', '10.8.2.38', 'jitai', 'jitai', '1521', 'BPAUTO');
INSERT INTO `sys_database` VALUES ('14', '机台作业', 'db14', 'orcl', '10.9.5.40', 'cdyc_user', 'sky123', '1521', 'orcl');

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
DROP TRIGGER IF EXISTS `insert`;
DELIMITER ;;
CREATE TRIGGER `insert` BEFORE INSERT ON `sys_user` FOR EACH ROW SET new.psw = MD5(concat('wMqSakbLdy9t8LLD',new.psw)),new.rec_time = CURRENT_TIMESTAMP
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

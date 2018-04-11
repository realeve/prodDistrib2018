-- view_print_newproc_plan
SELECT
	a.id,
	b.ProductName 品种,
	a.machine_name 机台,
	a.proc_name 分类,
	a.reason 详细说明,
	(case when a.date_type=0 then '从某天开始' when a.date_type=1 then   '时间范围' else '冠字号段' end) 日期类型,
	a.alpha_num 冠字号,
	CONVERT (VARCHAR, a.rec_date1, 112) 开始日期,
	(
		CASE
		WHEN a.rec_date2 is null then ''
		ELSE
			CONVERT (VARCHAR, a.rec_date2, 112)
		END
	) 结束日期,
	a.num1 "开始万数/号段",
	c.proc_stream_name 开始工艺,
	a.num2 "结束万数/号段",
	d.proc_stream_name 结束工艺,
	a.complete_num 完成大万数,
	(case when a.complete_status=0 then '未完成' else '已完成' end) 完成状态,
	a.rec_time 记录时间
FROM
	dbo.print_newproc_plan AS a
INNER JOIN dbo.ProductData AS b ON b.ProductID = a.prod_id
left JOIN dbo.print_newproc_type AS c ON c.proc_stream_id = a.proc_stream1
left JOIN dbo.print_newproc_type AS d ON d.proc_stream_id = a.proc_stream2
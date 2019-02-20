import React from 'react';
import { connect, Row, Col } from 'dva';
import TaskItem from './TaskItem';

function taskList({ task_list, unhandle_carts, unupload_carts }) {
  console.log(task_list, unhandle_carts, unupload_carts);

  return task_list.map((task_item) => (
    <TaskItem {...task_item} key={task_item.user_no} />
  ));
}

function mapStateToProps(state) {
  return {
    ...state.addcart.hechaTask,
    ...state.common
  };
}

export default connect(mapStateToProps)(taskList);

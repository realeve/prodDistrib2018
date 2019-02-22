import React from 'react';
import { connect, Row, Col } from 'dva';
import TaskItem from './TaskItem';

function taskList({ task_list, unhandle_carts, unupload_carts, hechaLoading }) {
  console.log(unhandle_carts, unupload_carts, hechaLoading);

  return task_list.map((task_item) => (
    <TaskItem {...task_item} key={task_item.user_no} />
  ));
}

// const taskList = () => <Skeleton active />;

const mapStateToProps = (state) => ({
  ...state.addcart.hechaTask,
  hechaLoading: state.addcart.hechaLoading,
  ...state.common
});

export default connect(mapStateToProps)(taskList);

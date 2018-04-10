import React, { Component } from "react";
import { connect } from "dva";
import { Upload, Icon, Modal } from "antd";
import * as lib from "../../../utils/axios";
const R = require("ramda");
class ErrImage extends Component {
  state = {
    previewVisible: false,
    previewImage: ""
    // fileList: []
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleThumbUrl = url => lib.uploadHost + url; //.replace("/image/", "/image/thumb_");

  handleChange = ({ fileList }) => {
    this.props.dispatch({
      type: "weak/setFileList",
      payload: fileList
    });
    if (fileList.length) {
      let { response } = fileList[0];

      if (response && R.has("url")(response)) {
        this.props.dispatch({
          type: "weak/setImgUrl",
          payload: response.url
        });

        fileList = fileList.map(item => {
          item.thumbUrl = this.handleThumbUrl(item.response.url);
          return item;
        });

        this.props.dispatch({
          type: "weak/setFileList",
          payload: fileList
        });
      }
    }
  };

  render() {
    const { previewVisible, previewImage } = this.state;
    const { fileList } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={lib.uploadHost}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length < 1 && uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.weak,
    ...state.weak
  };
}

export default connect(mapStateToProps)(ErrImage);

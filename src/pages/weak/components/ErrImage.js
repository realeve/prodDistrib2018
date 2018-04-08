import React, { Component } from "react";
import { connect } from "dva";
import { Upload, Icon, Modal } from "antd";

class ErrImage extends Component {
  state = {
    previewVisible: false,
    previewImage: "",
    fileList: [
      {
        uid: -1,
        name: "xxx.png",
        status: "done",
        url:
          "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
      }
      // {
      //   width: 400,
      //   height: 400,
      //   size: 13.66,
      //   type: "images/webp",
      //   url:
      //     "http://localhost/upload/image/MTUyMzE1MDczNV8yMjM1ODlfQmlhemZhbnhtYW1OUm94eFZ4a2E=.webp",
      //   status: 1,
      //   msg: "\u4e0a\u4f20\u6210\u529f",
      //   name: "BiazfanxmamNRoxxVxka.png"
      // }
    ]
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleChange = ({ fileList }) =>
    this.setState({
      fileList
    });

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="//localhost/upload/"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
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

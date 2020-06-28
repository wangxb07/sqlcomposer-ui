import React, {MouseEvent} from 'react';
import {Layout, Collapse, Button} from "antd";

import DocList from "../components/DocList";
import EditorForm from "../components/EditorForm";
import {FileAddOutlined, PlusSquareOutlined} from '@ant-design/icons';
import {Dispatch, iRootState} from "../store";
import {connect} from 'react-redux';
import {Route} from "react-router";
import DNSList from "../components/DSNList";

const {Sider, Content} = Layout;
const {Panel} = Collapse;

interface DocEditorState {
}

const mapState = (state: iRootState) => ({});

const mapDispatch = (dispatch: Dispatch) => ({
  showDocAddForm: dispatch.doc.showAddForm,
  showDNSAddForm: dispatch.dsn.showAddForm,
  clearDocFormFields: dispatch.doc.clearFormFields,
  clearDNSFormFields: dispatch.dsn.clearFormFields,
});

type connectedProps = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>
type Props = connectedProps

class DocMain extends React.Component<Props, DocEditorState> {
  handleDocAddClick = (e: MouseEvent) => {
    e.stopPropagation();
    this.props.clearDocFormFields();
    this.props.showDocAddForm();
  };

  handleDNSAddClick = (e: MouseEvent) => {
    e.stopPropagation();
    this.props.clearDNSFormFields();
    this.props.showDNSAddForm();
  };

  render() {
    return (
      <Layout hasSider={true}>
        <Sider theme="light" width={300}>
          <Collapse defaultActiveKey={['1']}>
            <Panel
              header="Documents"
              key="1"
              extra={<Button
                type="default"
                shape="round"
                size="small"
                onClick={this.handleDocAddClick}
                icon={<FileAddOutlined/>}/>}>
              <DocList/>
            </Panel>
            <Panel
              header="DNS"
              forceRender={true}
              key="2"
              extra={<Button
                type="default"
                shape="round"
                size="small"
                onClick={this.handleDNSAddClick}
                icon={<PlusSquareOutlined/>}/>}>
              <DNSList/>
            </Panel>
          </Collapse>
        </Sider>
        <Content>
          <Route path="/docs/:id" component={EditorForm}/>
        </Content>
      </Layout>
    )
  }
}

// @ts-ignore
export default connect(mapState, mapDispatch)(DocMain)

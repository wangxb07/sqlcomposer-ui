import React, {MouseEvent} from 'react';
import {Layout, Collapse, Button} from "antd";

import DocList from "../components/DocList";
import EditorForm from "../components/EditorForm";
import {FileAddOutlined} from '@ant-design/icons';
import {Dispatch, iRootState} from "../store";
import {connect} from 'react-redux';
import {Route} from "react-router";

const {Sider, Content} = Layout;
const {Panel} = Collapse;

interface DocEditorState {
  collapsible: boolean
  collapsed: boolean
}

const mapState = (state: iRootState) => ({});

const mapDispatch = (dispatch: Dispatch) => ({
  showAddForm: dispatch.doc.showAddForm,
  hideAddForm: dispatch.doc.hideAddForm,
  clearFormFields: dispatch.doc.clearFormFields,
});

type connectedProps = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>
type Props = connectedProps

class DocEditor extends React.Component<Props, DocEditorState> {
  state = {
    collapsible: false,
    collapsed: false
  };

  handleAddClick = (e: MouseEvent) => {
    e.stopPropagation();
    this.props.clearFormFields();
    this.props.showAddForm();
  };

  render() {
    return (
      <Layout hasSider={true}>
        <Sider theme="light" width={300} collapsible={this.state.collapsible} collapsed={this.state.collapsed}>
          <Collapse defaultActiveKey={['1']}>
            <Panel
              header="Documents"
              key="1"
              extra={<Button
                type="default"
                shape="round"
                size="small"
                onClick={this.handleAddClick}
                icon={<FileAddOutlined/>}/>}>
              <DocList/>
            </Panel>
            <Panel header="DNS" key="2">
            </Panel>
          </Collapse>
        </Sider>
        <Content>
          <Route path="/docs/:id" component={EditorForm} />
        </Content>
      </Layout>
    )
  }
}

// @ts-ignore
export default connect(mapState, mapDispatch)(DocEditor)

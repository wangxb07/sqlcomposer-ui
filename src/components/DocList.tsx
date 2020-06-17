import React, {Component} from "react";
import {deleteDoc} from "../api";
import {Button, Drawer, Form, Col, Row, Input, Menu} from "antd";
import {Link} from "react-router-dom";
import {iRootState, Dispatch} from "../store";
import {connect} from "react-redux";
import DocForm from './DocForm'

const Search = Input.Search;

interface DocIdentity {
  name: string
  path: string
  uuid: string
}

const mapState = (state: iRootState) => ({
  docs: state.doc.list,
  drawerFormVisible: state.doc.drawerFormVisible
});

const mapDispatch = (dispatch: Dispatch) => ({
  showAddForm: dispatch.doc.showAddForm,
  hideAddForm: dispatch.doc.hideAddForm,
  loadDocList: dispatch.doc.load,
  postDoc: dispatch.doc.post,
});

type connectedProps = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>
type Props = connectedProps

export class DocList extends Component<Props> {
  state = {
    docs: [],
    drawerFormVisible: false
  };

  componentDidMount(): void {
    this.props.loadDocList()
  }

  onDrawerFormClose = () => {
    this.props.hideAddForm()
  };

  onDrawerFormShow = () => {
    this.props.showAddForm()
  };

  onFormFinishFailed = (values: any) => {
    console.log(values)
  };

  render() {
    const empty = (
      <div style={{
        height: '20vh',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div>
          <h4>No sql composer document found</h4>
          <Button type="primary" onClick={this.onDrawerFormShow}>Create a new document</Button>
        </div>
      </div>
    );

    const list = (
      <div>
        <Search
          placeholder="input search text"
          onSearch={(value: any) => console.log(value)}
          style={{width: '100%'}}
        />
        <Menu theme="light">
          {this.props.docs.map((doc: DocIdentity) => (
            <Menu.Item>
              <Link to={`/docs/${doc.uuid}`}>
              <span style={{
                textDecoration: "underline"
              }}>{doc.path}</span> | {doc.name}
              </Link>
            </Menu.Item>)
          )}
        </Menu>
      </div>
    );

    return (
      <div>
        {this.props.docs.length === 0 ? (empty) : (list)}
        <DocForm onClose={this.onDrawerFormClose}
                 visible={this.props.drawerFormVisible}
                 onFinishFailed={this.onFormFinishFailed}/>
      </div>
    );
  }
}

// @ts-ignore
export default connect(mapState, mapDispatch)(DocList)

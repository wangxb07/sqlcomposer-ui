import React, {Component} from "react";
import {Button, Input, Menu, Popconfirm} from "antd";
import {iRootState, Dispatch} from "../store";
import {connect} from "react-redux";
import DNSForm from "./DSNForm";

import {DeleteOutlined} from '@ant-design/icons';

const Search = Input.Search;

const mapState = (state: iRootState) => ({
  docs: state.dsn.list,
  drawerFormVisible: state.dsn.drawerFormVisible
});

const mapDispatch = (dispatch: Dispatch) => ({
  showAddForm: dispatch.dsn.showAddForm,
  hideAddForm: dispatch.dsn.hideAddForm,
  deleteDNS: dispatch.dsn.delete,
  loadDocList: dispatch.dsn.load,
  postDoc: dispatch.dsn.post,
});

type connectedProps = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>
type Props = connectedProps

export class DSNList extends Component<Props> {
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
        <div style={{
          textAlign: "center"
        }}>
          <h4>No DNS found</h4>
          <Button type="primary" onClick={this.onDrawerFormShow}>Create a new DNS</Button>
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
          {this.props.docs.map((dns: any) => (
            <Menu.Item key={dns.id}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                {dns.name}
                <Popconfirm placement="top" title="Delete confirm?" onConfirm={() => this.props.deleteDNS(dns.id)}
                            okText="Yes" cancelText="No">
                  <Button
                    size="small"
                    type="default"
                    shape="round"
                    icon={<DeleteOutlined/>}
                  />
                </Popconfirm>
              </div>
            </Menu.Item>)
          )}
        </Menu>
      </div>
    );

    return (
      <div>
        {this.props.docs.length === 0 ? (empty) : (list)}
        <DNSForm onClose={this.onDrawerFormClose}
                 visible={this.props.drawerFormVisible}
                 onFinishFailed={this.onFormFinishFailed}/>
      </div>
    );
  }
}

// @ts-ignore
export default connect(mapState, mapDispatch)(DSNList)

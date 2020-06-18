import React from 'react';
import {Route, Link, Switch} from 'react-router-dom';
import {History} from 'history'
import {Layout, Menu, notification} from 'antd';
import './App.css'
import {
  FileOutlined,
} from '@ant-design/icons';
import DocMain from "./page/DocMain";
import {Dispatch, iRootState} from "./store";
import {connect} from 'react-redux';
import {ArgsProps} from "antd/lib/notification";
import {ConnectedRouter} from 'connected-react-router';

const {Header} = Layout;

const mapState = (state: iRootState) => ({
  msg: state.msgbox.msg,
  msgType: state.msgbox.type,
  showMsg: state.msgbox.show
});

const mapDispatch = (dispatch: Dispatch) => ({
  hideMsg: dispatch.msgbox.hideMsg
});

interface AppProps {
  history: History;
}

type connectedProps = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch> & AppProps
type Props = connectedProps

const openNotification = (args: ArgsProps) => {
  notification.open(args);
};


class App extends React.Component<Props> {
  render() {
    if (this.props.showMsg) {
      openNotification(this.props.msg);
      this.props.hideMsg();
    }
    return (
      <ConnectedRouter history={this.props.history}>
        <div className="App">
          <Layout style={{minHeight: '100vh'}}>
            <Header className="header" style={{
              height: "50px"
            }}>
              <div className="logo"/>
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{
                lineHeight: "50px",
              }}>
                <Menu.Item key="1" icon={<FileOutlined/>}><Link to="/">Sql Composer</Link></Menu.Item>
              </Menu>
            </Header>

            <Layout className="site-layout">
              <Switch>
                <Route key="docs" path="/" exact={false} component={DocMain}/>
              </Switch>
            </Layout>
          </Layout>
        </div>
      </ConnectedRouter>
    );
  }
}

// @ts-ignore
export default connect(mapState, mapDispatch)(App);

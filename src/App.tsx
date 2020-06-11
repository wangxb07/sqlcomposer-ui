import React from 'react';

import {Route, Link, Switch,withRouter} from 'react-router-dom';

import {Layout, Menu} from 'antd';
import './App.css'
import {
  DesktopOutlined,
  FileOutlined,
} from '@ant-design/icons';
import DocList from "./page/doclist";
import DbConfigList from "./page/dbconfig";

const {Header, Content, Footer, Sider} = Layout;

class App extends React.Component<any, any> {
  baseUrl = process.env.REACT_APP_API_URL

  constructor(props: any) {
    super(props)
  }

  componentWillMount(): void {

    // console.log(process.env)
    //docList
    fetch(this.baseUrl + "/doc", {
      method: "get",
    }).then((r) => (
      r.json()
    )).then(r => {
      this.setState({
        docList: r
      })
    })

    //dbConfig list
    fetch(this.baseUrl + "/dbconfig", {
      method: "get",
    }).then((r) => (
      r.json()
    )).then(r => {
      console.log(r)
      this.setState({
        dbConfig: r.data
      })
    })

    // console.log(this.props.match.params)
  }

  render() {
    return (
      <div className="App">

        <Layout style={{minHeight: '100vh'}}>
          <Sider collapsible>
            <div className="logo"/>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">

              <Menu.Item key="1" icon={<DesktopOutlined/>}>
                <Link to="/doclist">Sql-compose</Link>
              </Menu.Item>

              <Menu.Item key="2" icon={<FileOutlined/>}><Link to="/doclist">文档列表</Link></Menu.Item>
              <Menu.Item key="3" icon={<FileOutlined/>}><Link to="/dbconfig">数据库配置</Link></Menu.Item>
              <Menu.Item key="4" icon={<FileOutlined/>}><Link to="/about">关于</Link></Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{padding: 0}}/>
            <Content style={{margin: '0 16px'}}>
              <br/>
              <Switch>
                <Route key="doclist" exact={true} path="/doclist" component={DocList}/>
                <Route key="dblist" exact={true} path="/dbconfig" component={DbConfigList} />
                <Route key="about" exact={true} path="/" component={DocList} />
              </Switch>

            </Content>
            <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
          </Layout>
        </Layout>
      </div>
    );
  }

}

export default App;

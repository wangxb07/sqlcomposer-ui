import React from 'react';

import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';

import {Button, Layout, Menu} from 'antd';
import './App.css'
import {
  DesktopOutlined,
  FileOutlined,
} from '@ant-design/icons';
import DocList from "./page/doclist";
import DbConfigList from "./page/dbconfig";
//router
const routes = [
  {
    path: "/doclist",
    exact: true,
    main: () => <DocList/>
  },
  {
    path: "/dbconfig",
    main: () => <DbConfigList/>
  },
  {
    path: "/about",
    main: () => <h2>about</h2>
  }
];


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
                {routes.map((route, index) => (
                  // Render more <Route>s with the same paths as
                  // above, but different components this time.
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    children={<route.main/>}
                  />
                ))}
              </Switch>

            </Content>
            <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
          </Layout>
        </Layout>
        <Button type="primary">Button</Button>

      </div>
    );
  }

}

export default App;

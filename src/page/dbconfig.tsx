import React from 'react';
import {DbConfig} from "../types";
import {Row, Col, Input, PageHeader, Button, message} from 'antd'

interface IState {
  dbConfigList: DbConfig[]
  addConfigBody: {
    name: string
    dsn: string
  }
  updateConfigBody: {
    dsn: string
  }

  isChanged: boolean
}

class DbConfigList extends React.Component<any, IState> {
  baseUrl = process.env.REACT_APP_API_URL

  constructor(props: any) {
    super(props)
    this.state = {
      dbConfigList: [],
      addConfigBody: {
        name: "",
        dsn: ""
      },
      updateConfigBody: {
        dsn: ""
      },
      isChanged: false,
    }
  }

  componentDidMount(): void {
    //dbConfig list
    fetch(this.baseUrl + '/dbconfig', {
      method: "get",
    }).then((r) => (
      r.json()
    )).then(r => {
      console.log(r)
      this.setState({
        dbConfigList: r.data
      })
    })
  }

  deleteByUuid = (uuid: string) => {
    //dbConfig list
    fetch(this.baseUrl + '/dbconfig/' + uuid, {
      method: "delete",
    }).then((r) => (
      r.text()
    )).then(r => {
      // @ts-ignore
      message
        .loading("deleting...", 0.5)
        .then(() => {
          window.location.reload(false)
        }, () => {
        })
    })

  }

  addInputChanged = (event: any) => {
    console.log(event.target.name)
    console.log(event.target.value)
    let body = this.state.addConfigBody
    if (event.target.name === 'name') {
      this.setState({
        addConfigBody: {
          name: event.target.value,
          dsn: body.dsn
        }
      })
    }

    if (event.target.name === 'dsn') {
      this.setState({
        addConfigBody: {
          name: body.name,
          dsn: event.target.value
        }
      })
    }

    console.log(this.state.addConfigBody)
  }

  addConfig = () => {
    //dbConfig list
    fetch(this.baseUrl + '/dbconfig', {
      method: "PATCH",
      body: JSON.stringify(this.state.addConfigBody),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((r) => (
      r.text()
    )).then(r => {
      message
        .loading("添加...", 0.5)
        .then(() => {
          window.location.reload(false)
        }, () => {

        })
    })
  }

  updateConfigByUuid = (uuid: string, name: string) => {
    //dbConfig list
    fetch(this.baseUrl + '/dbconfig/'+uuid, {
      method: "POST",
      body: JSON.stringify(
        {
          name: name,
          dsn: this.state.updateConfigBody.dsn
        }
      ),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((r) => (
      r.text()
    )).then(r => {
      message
        .loading("更新中...", 0.5)
        .then(() => {
          window.location.reload(false)
        }, () => {

        })
    })
  }

  updateInputChanged = (event: any) => {
    console.log(event.target.value)
    this.setState({
      updateConfigBody: {
        dsn: event.target.value
      }
    })
  }


  render() {
    return (
      <div>
        <h1>数据库配置</h1>
        <Row>

          <Col className="gutter-row" span={7}>
            {/*<label><span className="dbconfig-input-demo">数据库名称</span></label><br/>*/}
            <Input className="dbconfig-input" name="name" placeholder="name" onChange={this.addInputChanged}/>
            <Input className="dbconfig-input" name="dsn" placeholder="dsn" onChange={this.addInputChanged}/>
            <br/>
            <label><span className="dbconfig-input-demo">DSN示例:dbuser:dbpw@tcp(host:port)/dbname?charset=utf8mb4&parseTime=True&loc=Local</span></label><br/>

            <br/>

            <Button onClick={this.addConfig}>添加</Button>

          </Col>
          <Col className="gutter-row" span={10}>

            {
              this.state.dbConfigList.map((dbConfig) => {
                let dsn = dbConfig.dsn
                return (
                  <div>
                    <br/>
                    <PageHeader
                      className="site-page-header"
                      onBack={() => null}
                      title={dbConfig.name}
                      subTitle={<Input placeholder="编辑dsn" onChange={this.updateInputChanged}/>}
                      extra={[
                        <Button key="2" type="primary"
                                onClick={this.updateConfigByUuid.bind(this, dbConfig.uuid, dbConfig.name)}>
                          保存
                        </Button>,
                        <Button key="1" type="primary" onClick={this.deleteByUuid.bind(this, dbConfig.uuid)}>
                          删除
                        </Button>,
                      ]}
                    />
                  </div>
                )
              })}

          </Col>
          <Col className="gutter-row" span={7}>
          </Col>
        </Row>
      </div>

    )
  }
}

export default DbConfigList

import React from 'react';
import {DocumentList, Doc, FilterParam} from "../types";
import {Button, Col, Collapse, Row, Input, AutoComplete} from "antd";
import {Link} from 'react-router-dom';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-monokai";
import {message} from "antd/es";

const {Panel} = Collapse;
const options: any = [
  {value: 'Burns Bay Road'},
  {value: 'Downing Street'},
  {value: 'Wall Street'},
];

interface IState {
  docList: DocumentList
  dbconfigOptions: [
    {
      value: string
    }
    ]
  docDetail: Doc
  currentContent: string
  filterParams: any
  apiPath: string
  dbName: string
  result: string
}


class DocList extends React.Component<any, IState> {
  baseUrl = process.env.REACT_APP_API_URL
  query = new URLSearchParams(window.location.search)

  constructor(props: any) {
    super(props)
    console.log(this.props)
    let docList: DocumentList = {
      data: [],
      total: 0
    };

    let docDetail: Doc = {
      uuid: "",
      name: "",
      content: "",
      path: "",
      created_at: "",
      updated_at: ""

    }
    // @ts-ignore
    this.state = {
      docList: docList,
      docDetail: docDetail,
      result: "",
      filterParams: "{\n" +
        "  \"filters\":[\n" +
        "    \n" +
        "  ],\n" +
        "  \"page_index\":1,\n" +
        "  \"page_limit\":2\n" +
        "}"
    }
  }


  componentDidMount(): void {

    //docList
    fetch(this.baseUrl + "/doc", {
      method: "get",
    }).then((r) => (
      r.json()
    )).then((r) => {
      this.setState({docList: r})
    })

    //dbconfig
    //docList
    fetch(this.baseUrl + "/dbconfig", {
      method: "get",
    }).then((r) => (
      r.json()
    )).then((r) => {
      let dbConfigOptions: any = []
      for (let i = 0; i < r.data.length; i++) {
        dbConfigOptions.push({value: r.data[i].name})
      }
      this.setState({dbconfigOptions: dbConfigOptions})
    })

    if (this.query.get('uuid') !== null) {
      this.getDocDetail(this.query.get('uuid'))
    }
  }

  getDocDetail = (uuid: any) => {
    //docDetail
    if (uuid !== null) {
      fetch(this.baseUrl + "/doc/" + uuid, {
        method: "get",
      }).then((r) => (
        r.json()
      )).then(r => {
        console.log(r)
        this.setState({
          docDetail: r,
          currentContent: r.content,
          apiPath: r.path
        })
      })
    }

  }

  getResult = () => {
    //docDetail
    // @ts-ignore
    fetch(this.baseUrl + process.env.REACT_APP_RESULT_URL_PREFIX + this.state.apiPath + '?dbname=' + this.state.dbName, {
      method: "post",
      body: this.state.filterParams,
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((r) => (
      r.text()
    )).then(r => {
      console.log(r)
      this.setState({
        result: r
      })
    })
  }

  deleteDoc = (uuid: string) => {
    //docDetail
    fetch(this.baseUrl + '/doc/' + uuid, {
      method: "delete",

    }).then((r) => (
      r.text()
    )).then(r => {
      message
        .loading("deleting...", 0.5)
        .then(() => {

          window.location.reload(false)
        }, () => {
        })
    })

  }
  saveDoc = () => {
    const formData = new FormData()
    formData.append('content', this.state.currentContent)
    formData.append('path', this.state.apiPath)
    //docDetail
    fetch(this.baseUrl + '/doc', {
      method: "PATCH",
      body: formData
    }).then((r) => (
      r.text()
    )).then(r => {
      message.info(r).then(() => {
        window.location.reload(false)
      }, () => {
      })
    })
  }
  updateDoc = () => {
    const formData = new FormData()
    formData.append('content', this.state.currentContent)
    formData.append('path', this.state.apiPath)
    //docDetail
    fetch(this.baseUrl + '/doc/' + this.state.docDetail.uuid, {
      method: "POST",
      body: formData
    }).then((r) => (
      r.text()
    )).then(r => {
      message.info(r)
    })
  }
  changeNowDoc = (newValue: any) => {
    console.log(newValue)
    this.setState({currentContent: newValue})
  }

  filterInputChange = (newValue: any) => {
    console.log(newValue)
    this.setState({filterParams: newValue})
  }

  apiPathInputChanged = (event: any) => {
    this.setState({apiPath: event.target.value})
  }
  dbNameInputChanged = (value: any) => {
    this.setState({dbName: value})
  }

  //格式化json字符串
  getFormatJson = (json: string) => {

    if (json.length > 0) {
      let jsonObj
      try {
        jsonObj = JSON.parse(json)
        let jsonString = JSON.stringify(jsonObj, null, "\t")
        return jsonString
      } catch (e) {
        //todo 错误提示
        throw e
      }
    }
    return ""
  }


  render() {
    return (
      <div className="doclist">

        <Row>
          <Col className="gutter-row" span={5}>
            <Collapse>
              {this.state.docList.data.map((doc) => {
                return (
                  <Panel header={doc.name} key={doc.uuid}>
                    <p>{doc.path}</p>
                    <Button onClick={this.getDocDetail.bind(this, doc.uuid)}><Link to={"/doclist?uuid=" + doc.uuid}
                    >编辑</Link></Button>
                    <Button type="primary" danger onClick={this.deleteDoc.bind(this, doc.uuid)}>删除</Button>
                  </Panel>
                )
              })}
            </Collapse>
          </Col>

          <Col className="gutter-row" span={12}>
            <div>
              <div className="yml-editor"><h2><span></span> <Button onClick={this.updateDoc}>保存</Button>

                <Button onClick={this.saveDoc}>新增</Button>
                <Input className="api-path-input" placeholder="输入接口路径..." onChange={this.apiPathInputChanged.bind(this)}
                       value={this.state.apiPath}/>
                <Button onClick={this.getResult.bind(this)}>查看查询结果</Button>
                <AutoComplete
                  className="dbconfig-input"
                  onChange={this.dbNameInputChanged.bind(this)}
                  style={{width: 200}}
                  options={this.state.dbconfigOptions}
                  placeholder="输入/选择数据库配置..."
                  filterOption={(inputValue, option: any) =>
                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              </h2>


                <AceEditor
                  placeholder="请输入yaml文本"
                  mode="yaml"
                  theme="monokai"
                  name="yml-editor-input"
                  onChange={this.changeNowDoc.bind(this)}
                  fontSize={14}
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  value={this.state.currentContent}
                  setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}/>
                <AceEditor
                  placeholder="请输入筛选条件"
                  mode="json"
                  theme="monokai"
                  name="filter-editor-input"
                  fontSize={14}
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  onChange={this.filterInputChange.bind(this)}
                  value={this.state.filterParams}
                  setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}/>


              </div>



            </div>
          </Col>

          <Col className="gutter-row" span={7}>
            <div>
              <div className="json-editor"><h2>运行结果<span></span></h2>
                <AceEditor
                  placeholder=""
                  mode="yaml"
                  theme="monokai"
                  name="json-editor-input"
                  fontSize={14}
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  value={this.getFormatJson(this.state.result)}
                  setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}/>

              </div>

            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default DocList

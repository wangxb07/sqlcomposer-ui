import React, {FC, useEffect} from "react";
import {Col, Row, Tag, Button, Space, Popconfirm, Spin} from "antd";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import ButtonGroup from "antd/lib/button/button-group";
import {Dispatch, iRootState} from "../store";
import {useParams} from "react-router";
import {connect} from "react-redux";
import MainEditorForm from "./MainEditorForm";
import ReactJson from 'react-json-view'

const mapState = (state: iRootState) => ({
  doc: state.doc.doc,
  loading: state.doc.loading || state.dns.loading,
  queryLoading: state.executor.loading,
  queryParams: state.executor.paramsContent,
  result: state.executor.result
});

const mapDispatch = (dispatch: Dispatch) => ({
  getDoc: dispatch.doc.get,
  saveDoc: dispatch.doc.save,
  deleteDoc: dispatch.doc.delete,
  editDoc: dispatch.doc.edit,
  getResult: dispatch.executor.query,
  updateQueryParams: dispatch.executor.updateQueryParams
});

interface EditorFormProps {
}

type connectedProps = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch> & EditorFormProps
type Props = connectedProps;

const EditorForm: FC<Props> = (
  {
    doc,
    getDoc,
    saveDoc,
    editDoc,
    deleteDoc,
    getResult,
    loading,
    queryParams,
    result,
    queryLoading,
    updateQueryParams
  }: Props) => {
  const {id} = useParams();

  useEffect(() => {
    if (!doc.uuid || doc.uuid !== id) {
      getDoc(id)
    }
  });

  return (
    <Spin spinning={queryLoading} delay={500}>
      <div>
        <Row>
          <Col span={24}>

            <div>
              <header>
                <div style={{
                  backgroundColor: "#333",
                  color: "#fff",
                  padding: "10px",
                  marginBottom: 0
                }}>
                  <Tag>Name: {doc.name}</Tag> <Tag>Path: {doc.path}</Tag>
                  <ButtonGroup style={{
                    float: "right"
                  }}>
                    <Space>
                      <Button type="primary" size="small" onClick={() => {
                        const formData = new FormData();

                        Object.keys(doc).forEach(k => {
                          formData.append(k, doc[k])
                        });

                        saveDoc({data: formData, uuid: doc.uuid});
                      }} loading={loading}>Save</Button>
                      <Button type="default" size="small" onClick={() => {
                        editDoc(doc)
                      }} loading={loading}>Edit</Button>
                      <Popconfirm placement="top" title="Delete confirm?" onConfirm={() => deleteDoc(doc.uuid)}
                                  okText="Yes" cancelText="No">
                        <Button type="default" size="small" loading={loading}>Delete</Button>
                      </Popconfirm>
                    </Space>
                  </ButtonGroup>
                </div>

              </header>
              <MainEditorForm content={doc.content}/>
              <footer>
                <div style={{
                  backgroundColor: "#333",
                  color: "#fff",
                  padding: "10px",
                  marginBottom: 0,
                  overflow: "hidden"
                }}>
                  <ButtonGroup style={{
                    float: "right"
                  }}>
                    <Space>
                      <Button type="primary" size="small" onClick={() => {
                        getResult(doc.path)
                      }}>Query</Button>
                    </Space>
                  </ButtonGroup>
                </div>
              </footer>
            </div>

          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{
              paddingRight: "5px"
            }}>
              <header>
                <div style={{
                  backgroundColor: "#eee",
                  padding: "5px",
                  marginBottom: 0
                }}>
                  <h5>Filters:</h5>
                </div>
              </header>

              <AceEditor
                width="100%"
                placeholder="请输入筛选条件"
                mode="json"
                theme="github"
                name="filter-editor"
                fontSize={12}
                showPrintMargin={false}
                showGutter={false}
                value={queryParams}
                onChange={updateQueryParams}
                highlightActiveLine={true}
                setOptions={{
                  enableBasicAutocompletion: false,
                  enableLiveAutocompletion: false,
                  enableSnippets: false,
                  showLineNumbers: true,
                  tabSize: 2,
                }}/>
            </div>
          </Col>

          <Col span={16}>
            <header>
              <div style={{
                backgroundColor: "#eee",
                padding: "5px",
                marginBottom: 0
              }}>
                <h5>Result:</h5>
              </div>
            </header>

            <ReactJson src={result} collapsed={false} theme={"bright"}/>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

// @ts-ignore
export default connect(mapState, mapDispatch)(EditorForm);

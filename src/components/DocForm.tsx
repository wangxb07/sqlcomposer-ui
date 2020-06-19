import React from "react";
import {Button, Col, Drawer, Form, Input, Row, Select} from "antd";
import {Dispatch, iRootState} from "../store";
import {connect} from "react-redux";
import {FieldData} from "../models";

const { Option } = Select;
const FormItem = Form.Item;

interface DrawerFormProps {
  onClose: () => void
  visible: boolean
  onFinishFailed: (values: any) => void
  fields: FieldData[]
}

const mapState = (state: iRootState) => ({
  fields: state.doc.formFields,
  loading: state.doc.loading,
  DNSList: state.dns.list
});

const mapDispatch = (dispatch: Dispatch) => ({
  post: dispatch.doc.post,
  save: (formData: FormData, uuid: string) => {
    dispatch.doc.save({
      data: formData, uuid
    })
  }
});

type connectedProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch> & DrawerFormProps
type Props = connectedProps

const DocForm: React.FC<Props> = (
  {
    onClose,
    visible,
    onFinishFailed,
    post,
    save,
    fields,
    loading,
    DNSList
  }) => {
  const [form] = Form.useForm();

  return (
    <Drawer
      title="Create a new document"
      width={620}
      onClose={onClose}
      visible={visible}
      bodyStyle={{paddingBottom: 80}}
      destroyOnClose={true}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={onClose} loading={loading} style={{marginRight: 8}}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => {
              form
                .validateFields()
                .then(values => {
                  const formData = new FormData();

                  Object.keys(values).forEach(k => {
                    formData.append(k, values[k])
                  });

                  const uuidIndex = fields.findIndex((f: FieldData) => (f.name[0] === 'uuid' && f.value))

                  if (uuidIndex < 0) {
                    post(formData);
                  } else {
                    save(formData, fields[uuidIndex].value);
                  }
                  // form.resetFields();
                })
                .catch(info => {
                  console.log('Validate Failed:', info);
                });
            }}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      }
    >
      <Form layout="vertical"
            form={form}
            hideRequiredMark
            onFinishFailed={onFinishFailed}
            fields={fields}
      >
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              name="name"
              label="Name"
              rules={[{required: true, message: 'Please enter composer name'}]}
            >
              <Input placeholder="Please enter composer name"/>
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem
              name="db_name"
              label="Database"
              rules={[{required: true, message: 'Please select database'}]}
            >
              <Select placeholder="Please select database">
                {DNSList.map((dns: any) => (<Option value={dns.name} >{dns.name}</Option>))}
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <FormItem
              name="path"
              label="Path"
              rules={[{required: true, message: 'Please enter path'}, {
                pattern: /^\//,
                message: 'Path must start with slash'
              }]}
            >
              <Input
                style={{width: '100%'}}
                addonBefore={process.env.REACT_APP_API_URL}
                placeholder="Please enter path"
              />
            </FormItem>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <FormItem
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: 'please enter composer document description',
                },
              ]}
            >
              <Input.TextArea rows={4} placeholder="please enter composer document description"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
};

// @ts-ignore
export default connect(mapState, mapDispatch)(DocForm);

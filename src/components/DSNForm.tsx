import * as React from "react";
import {Button, Col, Drawer, Form, Input, Row} from "antd";
import {Dispatch, iRootState} from "../store";
import {connect} from "react-redux";
import {FieldData} from "../models";

const FormItem = Form.Item;

interface DrawerFormProps {
  onClose: () => void
  visible: boolean
  onFinishFailed: (values: any) => void
  fields: FieldData[]
}

const mapState = (state: iRootState) => ({
  fields: state.dsn.formFields,
  loading: state.dsn.loading
});

const mapDispatch = (dispatch: Dispatch) => ({
  post: dispatch.dsn.post,
  save: (formData: FormData, uuid: string) => {
    dispatch.dsn.save({
      data: formData, uuid
    })
  }
});

type connectedProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch> & DrawerFormProps
type Props = connectedProps

const DSNForm: React.FC<Props> = (
  {
    onClose,
    visible,
    onFinishFailed,
    post,
    save,
    fields,
    loading
  }) => {
  const [form] = Form.useForm();
  return (
    <Drawer
      title="Create a new DNS"
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
                  post(values);
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
              rules={[{required: true, message: 'Please enter database name'}]}
            >
              <Input placeholder="Please enter database alias name"/>
            </FormItem>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <FormItem
              name="dsn"
              label="DSN"
              rules={[
                {
                  required: true,
                  message: 'please enter database connection string',
                },
              ]}
            >
              <Input.TextArea rows={4} placeholder="please enter database connection string"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
};

// @ts-ignore
export default connect(mapState, mapDispatch)(DSNForm);

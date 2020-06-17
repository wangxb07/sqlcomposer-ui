import {Dispatch} from "./store";
import {deleteDoc, getDoc, getDocList, postDoc, saveDoc} from "./api";
import {ArgsProps} from "antd/lib/notification";
import {createModel, ModelConfig} from "@rematch/core";

export interface FieldData {
  name: string[];
  value: any;
  touched: boolean;
  validating: boolean;
  errors: string[];
}

export interface EntityDocument {
  uuid: string
  name: string
  path: string
  content: string
  description: string
  db_name: string
  created_at: string
  updated_at: string
}

interface DocState {
  list: Array<any>
  drawerFormVisible: boolean
  doc: EntityDocument
  formFields: FieldData[]
  loading: boolean
}

const doc: ModelConfig = createModel<DocState>({
  state: {
    list: [],
    drawerFormVisible: false,
    doc: {},
    loading: false
  },
  reducers: {
    loaded: (state: DocState, docs: any) => {
      return {
        ...state,
        list: docs,
        loading: false
      }
    },
    setDoc: (state: DocState, doc: EntityDocument) => {
      return {
        ...state,
        doc
      }
    },
    showAddForm: (state: DocState) => {
      return {
        ...state,
        drawerFormVisible: true,
        formFields: []
      }
    },
    hideAddForm: (state: DocState) => {
      return {
        ...state,
        drawerFormVisible: false
      }
    },
    edit: (state: DocState, doc: any) => {
      return {
        ...state,
        drawerFormVisible: true,
        formFields: Object.keys(doc).map((k: string) => {
          return {
            name: [k],
            value: doc[k],
          };
        }),
      }
    },
    removeItem: (state: DocState, uuid: string) => {
      const list = state.list.filter((item: EntityDocument) => item.uuid !== uuid );
      return {
        ...state,
        list
      }
    },
    fillFormFields: (state: DocState, doc: any) => ({
      ...state,
      formFields: Object.keys(doc).map((k: string) => {
        return {
          name: [k],
          value: doc[k],
        };
      }),
    }),
    clearFormFields: (state: DocState) => {
      const formFields: FieldData[] = [];
      return {
        ...state,
        formFields
      }
    },
    showLoading: (state: DocState) => ({
      ...state,
      loading: true
    }),
    hideLoading: (state: DocState) => ({
      ...state,
      loading: false
    }),
    onChange: (state: DocState, content: string) => ({
      ...state,
      doc: {
        ...state.doc,
        content
      }
    })
  },
  // @ts-ignore
  effects: (dispatch: Dispatch) => ({
    async load() {
      let res: any = {};
      try {
        res = await getDocList();
      } catch (e) {
        dispatch.msgbox.notification({
          message: "Document list fetch failure",
          description: "Please check the Network and try again"
        })
      }

      if (res && res.data && res.data.data) {
        dispatch.doc.loaded(res.data.data)
      }
    },
    async get(uuid: string) {
      let res: any = {};

      try {
        res = await getDoc(uuid);
      }
      catch (e) {
        dispatch.msgbox.notification({
          message: "Document fetch failure",
          description: "Please check the Network and try again"
        })
      }

      if (res && res.data) {
        dispatch.doc.setDoc(res.data)
      }
    },
    async post(data: FormData) {
      dispatch.doc.showLoading();
      try {
        const res = await postDoc(data);
        dispatch.doc.hideLoading();
      }
      catch (e) {
        if (e.data.code) {
          dispatch.msgbox.notification({
            message: "Document add failure",
            description: e.data.message
          });
        }
        dispatch.doc.hideLoading();
        return
      }

      await dispatch.doc.load();
      dispatch.doc.hideLoading();
      dispatch.doc.clearFormFields();
      dispatch.doc.hideAddForm();
    },
    async save(payload: any, state: any) {
      let res: any = {};
      dispatch.doc.showLoading();

      const formData: FormData = payload.data;
      if (!formData.get("content")) {
        formData.set("content", state.doc.doc.content)
      }

      try {
        res = await saveDoc(payload.data, payload.uuid)
      } catch (e) {
        if (e.data.code) {
          dispatch.msgbox.notification({
            message: "Document save failure",
            description: e.data.message
          });
        }
        dispatch.doc.hideLoading();
        return
      }

      if (res && res.data) {
        dispatch.doc.setDoc(res.data)
      }
      dispatch.doc.hideLoading();
    },
    async delete(uuid: string) {
      let res: any = {};
      dispatch.doc.showLoading();
      try {
        res = await deleteDoc(uuid);
      } catch (e) {
        if (e.data.code) {
          dispatch.msgbox.notification({
            message: "Document save failure",
            description: e.data.message
          });
        }
        dispatch.doc.hideLoading();
        return
      }

      if (res && res.data) {
        dispatch.doc.removeItem(uuid);
      }
      dispatch.doc.hideLoading();
    },
  })
});

interface MsgBoxState {
  show: boolean
  msg: ArgsProps
  type: 'success' | 'error' | 'info' | 'warning' | 'open'
}

const msgbox: ModelConfig = createModel<MsgBoxState>({
  state: {
    show: false,
    msg: {},
    type: 'info'
  },
  reducers: {
    notification: (state: MsgBoxState, msg: MsgBoxState) => ({show: true, msg}),
    hideMsg: (state: MsgBoxState) => ({...state, show: false}),
  }
});

// no need to extend from Models
export interface RootModel {
  doc: typeof doc,
  msgbox: typeof msgbox,
}

export const models: RootModel = {doc, msgbox};

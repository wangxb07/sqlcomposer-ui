import {Dispatch} from "./store";
import {
  deleteDoc,
  getDoc,
  getDocList,
  postDoc,
  saveDoc,
  getDNSList,
  getDNS,
  postDNS,
  saveDNS,
  deleteDNS,
  query
} from "./api";
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
      const list = state.list.filter((item: EntityDocument) => item.uuid !== uuid);
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
      } catch (e) {
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
      } catch (e) {
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

interface DNSState {
  list: Array<any>
  drawerFormVisible: boolean
  formFields: FieldData[]
  loading: boolean
}

const dns: ModelConfig = createModel<DNSState>({
  state: {
    list: [],
    drawerFormVisible: false,
    formFields: [],
    loading: false
  },
  reducers: {
    loaded: (state: DocState, list: any) => {
      return {
        ...state,
        list,
        loading: false
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
        drawerFormVisible: false,
        formFields: []
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
      const list = state.list.filter((item: EntityDocument) => item.uuid !== uuid);
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
  },
  // @ts-ignore
  effects: (dispatch: Dispatch) => ({
    async load() {
      let res: any = {};
      try {
        res = await getDNSList();
      } catch (e) {
        dispatch.msgbox.notification({
          message: "DNS list fetch failure",
          description: "Please check the Network and try again"
        })
      }

      if (res && res.data && res.data.data) {
        dispatch.dns.loaded(res.data.data)
      }
    },
    async get(uuid: string) {
      let res: any = {};

      try {
        res = await getDNS(uuid);
      } catch (e) {
        dispatch.msgbox.notification({
          message: "DNS fetch failure",
          description: "Please check the Network and try again"
        })
      }

      if (res && res.data) {
        dispatch.dns.setdns(res.data)
      }
    },
    async post(data: FormData) {
      dispatch.dns.showLoading();
      try {
        const res = await postDNS(data);
        dispatch.dns.hideLoading();
      } catch (e) {
        if (e.data.code) {
          dispatch.msgbox.notification({
            message: "DNS add failure",
            description: e.data.message
          });
        }
        dispatch.dns.hideLoading();
        return
      }

      await dispatch.dns.load();
      dispatch.dns.hideLoading();
      dispatch.dns.clearFormFields();
      dispatch.dns.hideAddForm();
    },
    async save(payload: any, state: any) {
      let res: any = {};
      dispatch.dns.showLoading();

      try {
        res = await saveDNS(payload.data, payload.uuid)
      } catch (e) {
        if (e.data.code) {
          dispatch.msgbox.notification({
            message: "DNS save failure",
            description: e.data.message
          });
        }
        dispatch.dns.hideLoading();
        return
      }

      if (res && res.data) {
        dispatch.dns.setdns(res.data)
      }
      dispatch.dns.hideLoading();
    },
    async delete(uuid: string) {
      let res: any = {};
      dispatch.dns.showLoading();
      try {
        res = await deleteDNS(uuid);
      } catch (e) {
        if (e.data.code) {
          dispatch.msgbox.notification({
            message: "DNS save failure",
            description: e.data.message
          });
        }
        dispatch.dns.hideLoading();
        return
      }

      if (res && res.data) {
        dispatch.dns.removeItem(uuid);
      }
      dispatch.dns.hideLoading();
    },
  })
});

interface Filter {
  attr: string
  op: string
  val: any
}

interface ExexutorRequestParams {
  filters: Filter[]
  page_index: number
  page_limit: number
}

interface ExecutorState {
  loading: boolean
  params: ExexutorRequestParams
  result: any
  paramsContent: string
}

let timeout: NodeJS.Timeout;

const defaultParams = {
  filters: [],
  page_index: 1,
  page_limit: 10
};

const executor: ModelConfig = createModel<ExecutorState>({
  state: {
    loading: false,
    params: defaultParams,
    paramsContent: JSON.stringify(defaultParams),
    result: {}
  },
  reducers: {
    updateParams: (state: ExecutorState, params: ExexutorRequestParams) => {
      return {
        ...state,
        params
      }
    },
    updateParamsContent: (state: ExecutorState, paramsContent: string) => {
      return {
        ...state,
        paramsContent
      }
    },
    showLoading: (state: ExecutorState) => ({
      ...state,
      loading: true
    }),
    hideLoading: (state: ExecutorState) => ({
      ...state,
      loading: false
    }),
    updateResult: (state: ExecutorState, result: any) => ({
      ...state,
      result
    }),
  },
  // @ts-ignore
  effects: (dispatch: Dispatch) => ({
    async updateQueryParams(content: string, state: any) {
      dispatch.executor.updateParamsContent(content);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        try {
          const parsed = JSON.parse(content);
          dispatch.executor.updateParams(parsed)
        } catch (e) {
          dispatch.msgbox.notification({
            message: "Run query failure",
            description: "Query parameters parse to json failure" + e
          });
        }
      }, 1200)
    },
    async query(path, state: any) {
      let res: any = {};
      dispatch.executor.showLoading();

      try {
        // TODO prefix path 需要放到配置中去
        res = await query(`${process.env.REACT_APP_RESULT_URL_PREFIX}${path}?debug=1`, state.executor.params)
      } catch (e) {
        if (e.data.code) {
          dispatch.msgbox.notification({
            message: "Run query failure",
            description: e.data.message
          });
        }
        dispatch.executor.hideLoading();
        return
      }

      if (res && res.data) {
        dispatch.executor.updateResult(res.data)
      }
      dispatch.executor.hideLoading();
    }
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
  dns: typeof dns,
  msgbox: typeof msgbox,
  executor: typeof executor,
}

export const models: RootModel = {doc, dns, msgbox, executor};

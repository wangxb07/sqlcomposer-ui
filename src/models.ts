import {Dispatch} from "./store";
import {
  deleteDoc,
  getDoc,
  getDocList,
  postDoc,
  saveDoc,
  getDSNList,
  getDSN,
  postDSN,
  saveDSN,
  deleteDSN,
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
  id: string
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
      if (!doc.content) {
        doc.content = ""
      }
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
    removeItem: (state: DocState, id: string) => {
      const list = state.list.filter((item: EntityDocument) => item.id !== id);
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
    async get(id: string) {
      let res: any = {};

      try {
        res = await getDoc(id);
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
    async post(data: any) {
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

      try {
        res = await saveDoc(payload.data, payload.id)
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
        dispatch.msgbox.notification({
          message: "Document save success",
        });
        dispatch.doc.setDoc(res.data)
      }
      dispatch.doc.hideLoading();
    },
    async delete(id: string) {
      let res: any = {};
      dispatch.doc.showLoading();
      try {
        res = await deleteDoc(id);
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
        dispatch.doc.removeItem(id);
      }
      dispatch.doc.hideLoading();
    },
  })
});

interface DSNState {
  list: Array<any>
  drawerFormVisible: boolean
  formFields: FieldData[]
  loading: boolean
}

const dsn: ModelConfig = createModel<DSNState>({
  state: {
    list: [],
    drawerFormVisible: false,
    formFields: [],
    loading: false
  },
  reducers: {
    setDSN: (state, DSNState, dsn: any) => {
      return {
        ...state,
        dsn
      }
    },
    loaded: (state: DSNState, list: any) => {
      return {
        ...state,
        list,
        loading: false
      }
    },
    showAddForm: (state: DSNState) => {
      return {
        ...state,
        drawerFormVisible: true,
        formFields: []
      }
    },
    hideAddForm: (state: DSNState) => {
      return {
        ...state,
        drawerFormVisible: false,
        formFields: []
      }
    },
    edit: (state: DSNState, dsn: any) => {
      return {
        ...state,
        drawerFormVisible: true,
        formFields: Object.keys(dsn).map((k: string) => {
          return {
            name: [k],
            value: dsn[k],
          };
        }),
      }
    },
    removeItem: (state: DSNState, id: string) => {
      const list = state.list.filter((item: EntityDocument) => item.id !== id);
      return {
        ...state,
        list
      }
    },
    fillFormFields: (state: DSNState, dsn: any) => ({
      ...state,
      formFields: Object.keys(dsn).map((k: string) => {
        return {
          name: [k],
          value: dsn[k],
        };
      }),
    }),
    clearFormFields: (state: DSNState) => {
      const formFields: FieldData[] = [];
      return {
        ...state,
        formFields
      }
    },
    showLoading: (state: DSNState) => ({
      ...state,
      loading: true
    }),
    hideLoading: (state: DSNState) => ({
      ...state,
      loading: false
    }),
  },
  // @ts-ignore
  effects: (dispatch: Dispatch) => ({
    async load() {
      let res: any = {};
      try {
        res = await getDSNList();
      } catch (e) {
        dispatch.msgbox.notification({
          message: "DSN list fetch failure",
          description: "Please check the Network and try again"
        })
      }

      if (res && res.data && res.data.data) {
        dispatch.dsn.loaded(res.data.data)
      }
    },
    async get(id: string) {
      let res: any = {};

      try {
        res = await getDSN(id);
      } catch (e) {
        dispatch.msgbox.notification({
          message: "DSN fetch failure",
          description: "Please check the Network and try again"
        })
      }

      if (res && res.data) {
        dispatch.dsn.setDSN(res.data)
      }
    },
    async post(data: any) {
      dispatch.dsn.showLoading();
      try {
        const res = await postDSN(data);
        dispatch.dsn.hideLoading();
      } catch (e) {
        if (e.data.code) {
          dispatch.msgbox.notification({
            message: "DSN add failure",
            description: e.data.message
          });
        }
        dispatch.dsn.hideLoading();
        return
      }

      await dispatch.dsn.load();
      dispatch.dsn.hideLoading();
      dispatch.dsn.clearFormFields();
      dispatch.dsn.hideAddForm();
    },
    async save(payload: any, state: any) {
      let res: any = {};
      dispatch.dsn.showLoading();

      try {
        res = await saveDSN(payload.data, payload.id)
      } catch (e) {
        if (e.data.code) {
          dispatch.msgbox.notification({
            message: "DSN save failure",
            description: e.data.message
          });
        }
        dispatch.dsn.hideLoading();
        return
      }

      if (res && res.data) {
        dispatch.dsn.setDSN(res.data)
      }
      dispatch.dsn.hideLoading();
    },
    async delete(id: string) {
      let res: any = {};
      dispatch.dsn.showLoading();
      try {
        res = await deleteDSN(id);
      } catch (e) {
        if (e.data.code) {
          dispatch.msgbox.notification({
            message: "DSN save failure",
            description: e.data.message
          });
        }
        dispatch.dsn.hideLoading();
        return
      }

      if (res && res.data) {
        dispatch.dsn.removeItem(id);
      }
      dispatch.dsn.hideLoading();
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
  page_limit: 10,
  sorts: []
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
  dsn: typeof dsn,
  msgbox: typeof msgbox,
  executor: typeof executor,
}

export const models: RootModel = {doc, dsn, msgbox, executor};

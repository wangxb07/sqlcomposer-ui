import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use((response) => {
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error.response);
});

export function getDocList() {
  return axios.get("/v1/doc")
}

export function getDoc(id: string) {
  return axios.get(`/v1/doc/${id}`)
}

export function saveDoc(data: any, id: string) {
  return axios.patch(`/v1/doc/${id}`, data)
}

export function postDoc(data: any) {
  return axios.post('/v1/doc', data)
}

export function deleteDoc(id: string) {
  return axios.delete(`/v1/doc/${id}`)
}

export function getDSNList() {
  return axios.get(`/v1/dsn`)
}

export function getDSN(id: string) {
  return axios.get(`/v1/dsn/${id}`)
}

export function postDSN(data: any) {
  return axios.post(`/v1/dsn`, data)
}

export function saveDSN(data: any, id: string) {
  return axios.post(`/v1/dsn/${id}`, data)
}

export function deleteDSN(id: string) {
  return axios.delete(`/v1/dsn/${id}`)
}

export function query(path: string, filters: any) {
  return axios.post(path, filters)
}

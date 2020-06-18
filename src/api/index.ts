import axios from 'axios'
import {string} from "prop-types";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use((response) => {
  return response;
}, function (error) {
  // Do something with response error
  if (error.response.status === 400) {
    return Promise.reject(error.response);
  }
});

export function getDocList() {
  return axios.get("/doc")
}

export function getDoc(uuid: string) {
  return axios.get(`/doc/${uuid}`)
}

export function saveDoc(data: FormData, uuid: string) {
  return axios.post(`/doc/${uuid}`, data)
}

export function postDoc(data: FormData) {
  return axios.post('/doc', data)
}

export function deleteDoc(uuid: string) {
  return axios.delete(`/doc/${uuid}`)
}

export function getDNSList() {
  return axios.get(`/dns`)
}

export function getDNS(uuid: string) {
  return axios.get(`/dns/${uuid}`)
}

export function postDNS(data: FormData) {
  return axios.post(`/dns`, data)
}

export function saveDNS(data: FormData, uuid: string) {
  return axios.post(`/dns/${uuid}`, data)
}

export function deleteDNS(uuid: string) {
  return axios.delete(`/dns/${uuid}`)
}

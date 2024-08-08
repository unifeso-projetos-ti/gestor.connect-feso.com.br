import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://jlfgnu3iqc.execute-api.sa-east-1.amazonaws.com/dev/',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')?.replace(/"/g, '')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
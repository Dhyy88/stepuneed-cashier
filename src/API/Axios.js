import axios from 'axios';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Accept = 'application/json';
    config.baseURL = 'http://192.168.1.9:8000/api';
    // config.baseURL = 'https://api.sjm-auto.com/api';
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {

    if (error.response && error.response.status === 401) {
      // originalRequest._retry = true;

      Swal.fire({
        icon: 'warning',
        title: 'Sesi login berakhir',
        text: 'Silahkan melakukan login kembali.',
        showCancelButton: false,
        confirmButtonText: 'OK',
      }).then(() => {
        window.location.href = '/';
        localStorage.removeItem('token')
      });
    }

    return Promise.reject(error);
  }
);

axios.defaults.withCredentials = true;

export default axios;

// helper/axios-wrapper.js
import { useAuthStore } from '@/stores/auth.store.js';
import axios from 'axios';
import { toast } from 'vue3-toastify';

export const axiosWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE'),
};

function request(method) {
  return (url, body = null, notification = false, contentType = 'application/json') => {
    const requestOptions = {
      url,
      method,
      headers: authHeader(url),
    };

    if (body) {
      if (contentType === 'multipart/form-data') {
        // Untuk FormData, jangan set Content-Type manual
        requestOptions.data = body;
      } else {
        requestOptions.headers['Content-Type'] = 'application/json';
        requestOptions.data = JSON.stringify(body);
      }
    }

    return axios(requestOptions)
      .then((response) => {
        if (notification && response.data?.message) {
          toast(response.data.message, {
            autoClose: 2000,
            type: 'success',
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }

        // kembalikan response asli
        return response;
      })
      .catch((error) => {
        return errorHandler(error);
      });
  };
}

// Header Authorization
function authHeader(url) {
  const { user } = useAuthStore();
  const isLoggedIn = !!user?.token;
  const isApiUrl = url.startsWith(import.meta.env.VITE_API_BASE_URL);

  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
}

// Error handler
function errorHandler(error) {
  const response = error.response;
  let message = '';

  if (response) {
    if (response.status === 401) {
      const { logout } = useAuthStore();
      logout();
      message = 'Sesi kamu telah berakhir, silakan login ulang.';
    } else if (response.status === 403) {
      message = response.data?.message || 'Kamu tidak memiliki izin untuk mengakses data ini.';
    } else if (response.status === 422) {
      // Backend biasanya mengirim object { field: [errors...] }
      const errors = response.data?.errors;
      if (errors && typeof errors === 'object') {
        message = Object.values(errors).flat().join(', ');
      } else {
        message = response.data?.message || 'Validasi gagal.';
      }
    } else {
      message = response.data?.message || error.message;
    }
  } else {
    message = error.message || 'Terjadi kesalahan jaringan.';
  }

  toast(message, {
    autoClose: 2000,
    type: 'error',
    position: toast.POSITION.BOTTOM_RIGHT,
  });

  // Penting! reject promise supaya catch di caller bisa bekerja
  return Promise.reject(error);
}

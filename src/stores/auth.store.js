import { defineStore } from "pinia";
import { getActivePinia } from "pinia";
import { axiosWrapper } from "@/helper/axios-wrapper.js";

import router from "@/router/index.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")),
    authError: null,
  }),
  actions: {
    async login(data) {
      try {
        const res = await axiosWrapper.post(`${baseUrl}/login`, data, true);

        if (res?.data) {
          this.user = res.data;
          localStorage.setItem("user", JSON.stringify(res.data));
          router.push("/");
        }
      } catch (err) {
        this.authError = err;
        console.error("Login gagal:", err);
      }
    },

    async register(data) {
      try {
        const res = await axiosWrapper.post(`${baseUrl}/register`, data, true);

        if (res?.data) {
          router.push("/login");
        }
      } catch (err) {
        this.authError = err;
        console.error("Register gagal:", err);
      }
    },
  },
});

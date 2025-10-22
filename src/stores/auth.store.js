import { defineStore, getActivePinia } from "pinia";
import { axiosWrapper } from "@/helper/axios-wrapper.js";
import router from "@/router/index.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    authError: null,
  }),
  actions: {
    async login(data) {
      try {
        const res = await axiosWrapper.post(`${baseUrl}/login`, data, true);

        if (res?.data?.data) {
          const userData = res.data.data;

          // Simpan user + token
          this.user = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            token: userData.token,
          };

          localStorage.setItem("user", JSON.stringify(this.user));

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

    logout() {
      this.user = null;
      this.authError = null;
      localStorage.removeItem("user");
      const pinia = getActivePinia();
      if (pinia) {
        Object.values(pinia._s).forEach((store) => store.$reset());
      }
      router.push("/login");
    },
  },
});

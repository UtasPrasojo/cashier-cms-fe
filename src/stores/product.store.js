import { defineStore } from "pinia";
import { axiosWrapper } from "@/helper/axios-wrapper.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useProductStore = defineStore({
  id: "product",
  state: () => ({
    products: [],
    product: null,
    loading: false,
    error: null,
  }),
  actions: {
    async getAll() {
      this.loading = true;
      try {
        const res = await axiosWrapper.get(`${baseUrl}/product`);
        if (res.status === 200) {
          this.products = res.data;
        }
      } catch (err) {
        this.error = err;
        console.error("Gagal mengambil data produk:", err);
      } finally {
        this.loading = false;
      }
    },

    async getById(id) {
      this.loading = true;
      try {
        const res = await axiosWrapper.get(`${baseUrl}/product/${id}`);
        if (res.status === 200) {
          this.product = res.data;
        }
      } catch (err) {
        this.error = err;
        console.error(`Gagal mengambil produk dengan ID ${id}:`, err);
      } finally {
        this.loading = false;
      }
    },

    async create(data) {
      this.loading = true;
      try {
        const res = await axiosWrapper.post(`${baseUrl}/product`, data, true);
        if (res.status === 201 || res.status === 200) {
          this.products.push(res.data);
        }
        return res;
      } catch (err) {
        this.error = err;
        console.error("Gagal menambah produk:", err);
      } finally {
        this.loading = false;
      }
    },

    async update(id, data) {
      this.loading = true;
      try {
        const res = await axiosWrapper.put(
          `${baseUrl}/product/${id}`,
          data,
          true
        );
        if (res.status === 200) {
          const index = this.products.findIndex((p) => p.id === id);
          if (index !== -1) {
            this.products[index] = res.data;
          }
        }
        return res;
      } catch (err) {
        this.error = err;
        console.error("Gagal mengupdate produk:", err);
      } finally {
        this.loading = false;
      }
    },

    async delete(id) {
      this.loading = true;
      try {
        const res = await axiosWrapper.delete(`${baseUrl}/product/${id}`);
        if (res.status === 200 || res.status === 204) {
          this.products = this.products.filter((p) => p.id !== id);
        }
        return res;
      } catch (err) {
        this.error = err;
        console.error("Gagal menghapus produk:", err);
      } finally {
        this.loading = false;
      }
    },
  },
});

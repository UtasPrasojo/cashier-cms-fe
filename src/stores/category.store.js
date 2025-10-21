import { defineStore } from 'pinia'
import { useHttp } from '@/composables/useHttp'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
  }),

  actions: {
    async getAll() {
      const { get } = useHttp()
      try {
        const res = await get('/category') // Endpoint API
        if (res.status === 200) {
          this.categories = res.data
        }
        return res
      } catch (error) {
        console.error('Error fetching categories:', error)
        throw error
      }
    },

    async getById(id) {
      const { get } = useHttp()
      try {
        const res = await get(`/category/${id}`)
        return res
      } catch (error) {
        console.error(`Error fetching category with ID ${id}:`, error)
        throw error
      }
    },

    async createCategory(payload) {
      const { post } = useHttp()
      try {
        const res = await post('/category', payload)
        if (res.status === 201) {
          this.categories.push(res.data)
        }
        return res
      } catch (error) {
        console.error('Error creating category:', error)
        throw error
      }
    },

    async updateCategory(id, payload) {
      const { patch } = useHttp()
      try {
        const res = await patch(`/category/${id}`, payload)
        if (res.status === 200) {
          const index = this.categories.findIndex(cat => cat.id === id)
          if (index !== -1) {
            this.categories[index] = res.data
          }
        }
        return res
      } catch (error) {
        console.error('Error updating category:', error)
        throw error
      }
    },

    async deleteCategory(id) {
      const { del } = useHttp()
      try {
        const res = await del(`/category/${id}`)
        if (res.status === 200) {
          this.categories = this.categories.filter(cat => cat.id !== id)
        }
        return res
      } catch (error) {
        console.error('Error deleting category:', error)
        throw error
      }
    },
  },
})

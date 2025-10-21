<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <a-card class="w-[420px] rounded-2xl shadow-md">
      <div class="flex flex-col space-y-4">
        <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">
          Tambah Produk
        </h2>

        <!-- Upload Gambar -->
        <a-upload-dragger
          name="file"
          :multiple="false"
          :before-upload="beforeUpload"
          :show-upload-list="false"
          class="border-dashed border-2 border-gray-300 rounded-lg bg-gray-50"
        >
          <div class="py-6">
            <div class="flex flex-col items-center">
              <i class="ri-upload-2-line text-3xl text-blue-500 mb-2"></i>
              <p class="text-gray-600 text-sm font-medium">
                Seret & Letakkan atau <span class="text-blue-600">Pilih File</span> untuk diunggah
              </p>
              <p class="text-gray-400 text-xs mt-1">
                Format yang didukung: Jpg, Png
              </p>
            </div>
          </div>
        </a-upload-dragger>

        <!-- Form Input -->
        <a-form layout="vertical" @submit.prevent="handleSubmit">
          <a-form-item label="Produk">
            <a-input v-model:value="product" placeholder="Produk" allow-clear />
          </a-form-item>

          <a-form-item label="Harga">
            <a-input
              v-model:value="price"
              type="number"
              placeholder="Harga"
              allow-clear
            />
          </a-form-item>

          <a-form-item label="Pilih Kategori">
            <a-select
              v-model:value="category"
              placeholder="Pilih kategori"
              :options="categoryOptions"
              allow-clear
            />
          </a-form-item>

          <!-- Tombol Aksi -->
          <div class="flex justify-end space-x-3 border-t w-full pt-4">
            <a-button
              class="border-blue-500 text-blue-500 w-full hover:bg-blue-50 rounded-lg"
              @click="handleCancel"
            >
              Batal
            </a-button>
            <a-button
              type="primary"
              class="bg-blue-600 w-full hover:bg-blue-700 rounded-lg"
              @click="handleSubmit"
            >
              Tambah
            </a-button>
          </div>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'

const product = ref('')
const price = ref('')
const category = ref(null)
const imageFile = ref(null)

// contoh data kategori (nanti bisa dari API)
const categoryOptions = ref([
  { label: 'Makanan', value: 'makanan' },
  { label: 'Minuman', value: 'minuman' },
  { label: 'Lainnya', value: 'lainnya' }
])

const beforeUpload = (file) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isImage) {
    message.error('Hanya file JPG atau PNG yang diperbolehkan!')
    return false
  }
  imageFile.value = file
  message.success(`File "${file.name}" berhasil dipilih`)
  return false // mencegah upload otomatis
}

const handleSubmit = () => {
  if (!product.value || !price.value || !category.value) {
    message.warning('Mohon lengkapi semua data produk')
    return
  }
  message.success(`Produk "${product.value}" berhasil ditambahkan!`)
  product.value = ''
  price.value = ''
  category.value = null
  imageFile.value = null
}

const handleCancel = () => {
  product.value = ''
  price.value = ''
  category.value = null
  imageFile.value = null
  message.info('Batal menambah produk')
}
</script>

<style scoped>
.ant-card {
  border: none;
}
</style>

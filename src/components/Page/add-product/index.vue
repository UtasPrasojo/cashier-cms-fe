<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useProductStore } from "@/stores/product.store.js";
import { useCategoryStore } from "@/stores/category.store.js";

const router = useRouter();
const productStore = useProductStore();
const categoryStore = useCategoryStore();

// Form state
const formState = reactive({
  name: "",
  price: null,
  category_id: null,
  file: null, // simpan file asli langsung di sini
});

const isSubmitting = ref(false);

// Ambil kategori saat mounted
onMounted(async () => {
  try {
    await categoryStore.getAll();
  } catch {
    message.error("Gagal mengambil kategori");
  }
});

// Mapping kategori ke options untuk select
const categoryOptions = computed(() => {
  if (!categoryStore.categories || !Array.isArray(categoryStore.categories)) {
    return [];
  }
  
  return categoryStore.categories.map((item) => ({
    label: item?.name || 'Unknown',
    value: item?.id || '',
  })).filter(option => option.value); // Filter out invalid options
});

// Sebelum upload file
const beforeUpload = (file) => {
  const isImage = file.type === "image/jpeg" || file.type === "image/png";
  if (!isImage) {
    message.error("Hanya file JPG atau PNG yang diperbolehkan!");
    return false;
  }
  // Simpan file asli
  formState.file = file;
  message.success(`File "${file.name}" berhasil dipilih`);
  return false; // mencegah upload otomatis
};

// Submit form
const handleSubmit = async () => {
  if (
    !formState.name ||
    !formState.price ||
    !formState.category_id ||
    !formState.file
  ) {
    message.warning("Lengkapi semua field dan pilih gambar");
    return;
  }

  const formData = new FormData();
  formData.append("name", formState.name);
  formData.append("price", Number(formState.price));
  formData.append("category_id", String(formState.category_id));
  formData.append("picture", formState.file);

  console.log("picture", formState.file);
  console.log("picture name", formState.file.name);
  console.log("picture type", formState.file.type);
  console.log("picture size", formState.file.size);

  isSubmitting.value = true;
  try {
    const res = await productStore.create(formData);
    message.success(`Produk "${formState.name}" berhasil ditambahkan!`);
    router.push("/");
  } catch (err) {
    message.error("Gagal menambah produk!");
    console.error(err.response?.data || err);
  } finally {
    isSubmitting.value = false;
  }
};

// Cancel form
const handleCancel = () => {
  formState.name = "";
  formState.price = null;
  formState.category_id = null;
  formState.file = null;
  message.info("Batal menambah produk");
  router.push("/");
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <a-card class="w-[420px] rounded-2xl shadow-md">
      <div class="flex flex-col space-y-4">
        <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">
          Tambah Produk
        </h2>

        <!-- Upload Gambar -->
        <a-upload-dragger
          :file-list="formState.file ? [formState.file] : []"
          name="file"
          :multiple="false"
          :before-upload="beforeUpload"
          list-type="picture-card"
          class="border-dashed border-2 border-gray-300 rounded-lg bg-gray-50"
        >
          <div v-if="!formState.file" class="py-6 text-center">
            <i class="ri-upload-2-line text-3xl text-blue-500 mb-2"></i>
            <p class="text-gray-600 text-sm font-medium">
              Seret & Letakkan atau
              <span class="text-blue-600">Pilih File</span> untuk diunggah
            </p>
            <p class="text-gray-400 text-xs mt-1">Format: JPG atau PNG</p>
          </div>
        </a-upload-dragger>

        <!-- Form Input -->
        <a-form layout="vertical" @submit.prevent="handleSubmit">
          <a-form-item label="Produk">
            <a-input
              v-model:value="formState.name"
              placeholder="Produk"
              allow-clear
            />
          </a-form-item>

          <a-form-item label="Harga">
            <a-input
              v-model:value="formState.price"
              type="number"
              placeholder="Harga"
              allow-clear
            />
          </a-form-item>

          <a-form-item label="Pilih Kategori">
            <a-select
              v-model:value="formState.category_id"
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
              :loading="isSubmitting"
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

<style scoped>
.ant-card {
  border: none;
}
</style>

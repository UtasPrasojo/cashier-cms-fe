<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.js";
import { useProductStore } from "@/stores/product.store.js";
import { useCategoryStore } from "@/stores/category.store.js";
import { message, Modal } from "ant-design-vue";

const router = useRouter();
const authStore = useAuthStore();
const productStore = useProductStore();
const categoryStore = useCategoryStore();

const search = ref("");
const selectedCategory = ref(null);
const isLoading = ref(true);

const products = computed(() => productStore.products || []);
const categories = computed(() => categoryStore.categories || []);

// --- Ambil data produk & kategori ---
onMounted(async () => {
  try {
    await Promise.all([productStore.getAll(), categoryStore.getAll()]);
  } finally {
    isLoading.value = false;
  }
});

// --- Navigasi tombol ---
const goToAddCategory = () => router.push("/add-category");
const goToAddProduct = () => router.push("/add-product");
const goToCartView = () => router.push("/cart-view");
const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

// --- Filter produk berdasarkan kategori & pencarian ---
const filteredProducts = computed(() => {
  const list = products.value || [];
  return list.filter((item) => {
    const matchCategory =
      !selectedCategory.value || item.category_id === selectedCategory.value.id;

    const matchSearch = item.name
      ?.toLowerCase()
      .includes(search.value.toLowerCase());

    return matchCategory && matchSearch;
  });
});

const deleteProduct = (id) => {
  Modal.confirm({
    title: "Konfirmasi Hapus",
    content: "Apakah kamu yakin ingin menghapus produk ini?",
    okText: "Ya, Hapus",
    cancelText: "Batal",
    okType: "danger",
    async onOk() {
      try {
        await productStore.delete(id);
        message.success("Produk berhasil dihapus!");
      } catch (error) {
        message.error("Gagal menghapus produk!");
        console.error(error);
      }
    },
  });
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div
      class="flex justify-between items-center bg-white rounded-2xl shadow p-4 mb-6"
    >
      <h1 class="text-2xl font-bold text-blue-600">MASPOS</h1>

      <div class="flex items-center gap-2">
        <a-button type="primary" @click="goToAddCategory"
          >+ Tambah Kategori</a-button
        >

        <a-button type="primary" @click="goToAddProduct" ghost
          >+ Tambah Produk</a-button
        >

        <a-button
          shape="circle"
          class="flex items-center justify-center"
          @click="goToCartView"
        >
          <template #icon>
            <i class="ri-shopping-cart-2-line text-lg"></i>
          </template>
        </a-button>

        <!-- Dropdown Avatar -->
        <a-dropdown trigger="click">
          <a-avatar
            size="large"
            class="cursor-pointer"
            src="https://api.dicebear.com/9.x/adventurer/svg?seed=admin"
          />
          <template #overlay>
            <a-menu>
              <a-menu-item key="logout" @click="handleLogout">
                Logout
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <div
      class="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-2 items-center"
    >
      <div class="relative">
        <a-input-search
          v-model:value="search"
          placeholder="Cari nama produk..."
          class="max-w-xs"
          allow-clear
        />

        <!-- Dropdown hasil pencarian -->
        <div
          v-if="search && filteredProducts.length > 0"
          class="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 w-full max-w-xs"
        >
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            @click="selectProduct(product)"
          >
            {{ product.name }}
          </div>
        </div>

        <!-- Jika tidak ada hasil -->
        <div
          v-else-if="search && filteredProducts.length === 0"
          class="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 w-full max-w-xs px-3 py-2 text-gray-500"
        >
          Tidak ada produk ditemukan
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <a-tag
          :color="!selectedCategory ? 'blue' : ''"
          @click="selectedCategory = null"
          class="cursor-pointer hover:scale-105 transition"
        >
          Semua
        </a-tag>

        <a-tag
          v-for="(category, index) in categories"
          :key="category.id"
          :color="selectedCategory?.id === category.id ? 'blue' : ''"
          @click="selectedCategory = category"
          class="cursor-pointer hover:scale-105 transition"
        >
          {{ category.name }}
        </a-tag>
      </div>
    </div>
    <div>
      <div v-if="isLoading" class="text-center py-10">Loading...</div>

      <div
        v-else
        class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        <div
          v-for="(item, index) in filteredProducts"
          :key="item.id"
          class="bg-white rounded-xl shadow hover:shadow-lg transition relative overflow-hidden"
        >
          <div class="relative">
            <img
              :src="item.picture_url"
              alt="product"
              class="rounded-t-xl w-full h-40 object-cover"
            />

            <!-- Tombol Hapus di pojok kanan bawah -->
            <button
              @click="deleteProduct(item.id)"
              class="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md transition"
              title="Hapus produk"
            >
              <i class="ri-delete-bin-line text-sm"></i>
            </button>
          </div>

          <div class="p-3">
            <p class="text-sm font-semibold truncate">{{ item.name }}</p>
            <p class="text-blue-600 font-medium mb-3">
              Rp {{ item.price.toLocaleString("id-ID") }}
            </p>
            <a-button type="primary" block>+ Keranjang</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  transition: transform 0.3s ease;
}
img:hover {
  transform: scale(1.03);
}
</style>

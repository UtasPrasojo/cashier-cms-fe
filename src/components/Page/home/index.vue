<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.js";
import { useProductStore } from "@/stores/product.store.js";

const search = ref("");
const selectedCategory = ref("Semua");
const authStore = useAuthStore();
const router = useRouter();
const productStore = useProductStore();
const products = computed(() => productStore.products || []);
const categories = ref(["Semua", "Burger", "Pizza", "Drink"]);
onMounted(async () => {
  try {
    await productStore.getAll();
  } finally {
    isLoading.value = false;
  }
});


const goToAddCategory = () => {
  router.push("/add-category");
};
const goToAddProduct = () => {
  router.push("/add-product");
};
const goToCartView = () => {
  router.push("/cart-view");
};
const handleLogout = () => {
  authStore.logout();
  message.success("Berhasil logout!");
  router.push("/login");
};

// --- Filter produk berdasarkan kategori & pencarian
const filteredProducts = computed(() => {
  return products.value.filter((item) => {
    const matchCategory =
      selectedCategory.value === "Semua" ||
      item.category === selectedCategory.value;
    const matchSearch = item.name
      .toLowerCase()
      .includes(search.value.toLowerCase());
    return matchCategory && matchSearch;
  });
});
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
      <a-input-search
        v-model:value="search"
        placeholder="Cari nama produk..."
        class="max-w-xs"
        allow-clear
      />

      <div class="flex flex-wrap gap-2">
        <a-tag
          v-for="(category, index) in categories"
          :key="index"
          :color="selectedCategory === category ? 'blue' : ''"
          @click="selectedCategory = category"
          class="cursor-pointer hover:scale-105 transition"
        >
          {{ category }}
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
          v-for="(item, index) in products"
          :key="item.id"
          class="bg-white rounded-xl shadow hover:shadow-lg transition"
        >
          <img
            :src="item.picture_url"
            alt="product"
            class="rounded-t-xl w-full h-40 object-cover"
          />
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

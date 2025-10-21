<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div
      class="flex justify-between items-center bg-white rounded-2xl shadow p-4 mb-6"
    >
      <h1 class="text-2xl font-bold text-blue-600">MASPOS</h1>

      <div class="flex items-center gap-2">
        <a-button type="primary">+ Tambah Kategori</a-button>
        <a-button type="primary" ghost>+ Tambah Produk</a-button>
        <a-button shape="circle" class="flex items-center justify-center">
          <template #icon>
            <i class="ri-shopping-cart-2-line text-lg"></i>
          </template>
        </a-button>
        <a-avatar
          size="large"
          src="https://api.dicebear.com/9.x/adventurer/svg?seed=admin"
        />
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
    <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div
        v-for="(item, index) in filteredProducts"
        :key="index"
        class="bg-white rounded-xl shadow hover:shadow-lg transition"
      >
        <img
          :src="item.image"
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
</template>

<script setup>
import { ref, computed } from "vue";

// --- State untuk search & kategori
const search = ref("");
const selectedCategory = ref("Semua");

// --- Data kategori
const categories = ref(["Semua", "Burger", "Pizza", "Drink"]);

// --- Data produk (sementara statis, nanti bisa diganti dari API)
const products = ref([
  {
    name: "Pepperoni Cheese",
    price: 45000,
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1601924638867-3ec3e06f8b8b?auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "French Fries",
    price: 18000,
    category: "Burger",
    image:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Big Mac Cheese",
    price: 31000,
    category: "Burger",
    image:
      "https://images.unsplash.com/photo-1606756790138-8e1b0dc5e490?auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Lechy Tea",
    price: 12000,
    category: "Drink",
    image:
      "https://images.unsplash.com/photo-1510626176961-4b37d6af1c4a?auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Coca Cola",
    price: 10000,
    category: "Drink",
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=500&q=60",
  },
   {
    name: "Coca Cola",
    price: 10000,
    category: "Drink",
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=500&q=60",
  },
]);

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

<style scoped>
img {
  transition: transform 0.3s ease;
}
img:hover {
  transform: scale(1.03);
}
</style>


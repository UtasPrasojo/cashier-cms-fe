<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.js";
import { useProductStore } from "@/stores/product.store.js";
import { useCategoryStore } from "@/stores/category.store.js";
import { message, Modal } from "ant-design-vue";
import { useCartStore } from "@/stores/cart.store.js";

const router = useRouter();
const authStore = useAuthStore();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const cartStore = useCartStore();

const search = ref("");
const selectedCategory = ref(null);
const isLoading = ref(true);

// 🛒 state baru untuk keranjang
const cartItems = ref([]); // [{id, name, price, qty}]
const showCartPopover = ref(false);

const products = computed(() => productStore.products || []);
const categories = computed(() => categoryStore.categories || []);

onMounted(async () => {
  try {
    await Promise.all([productStore.getAll(), categoryStore.getAll()]);
  } finally {
    isLoading.value = false;
  }
});

const goToAddCategory = () => router.push("/add-category");
const goToAddProduct = () => router.push("/add-product");
const goToCartView = () => router.push("/cart-view");

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

const addToCart = (product) => {
  cartStore.addItem(product);
  message.success(`${product.name} ditambahkan ke keranjang`);
};

// Total harga semua item
const totalCartPrice = computed(() =>
  cartItems.value.reduce((acc, item) => acc + item.price * item.qty, 0)
);

// Total item dalam keranjang
const totalCartQty = computed(() =>
  cartItems.value.reduce((acc, item) => acc + item.qty, 0)
);

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

        <!-- 🛒 Tombol keranjang dengan popover -->
        <a-popover
          v-model:open="showCartPopover"
          placement="bottomRight"
          trigger="click"
        >
          <template #content>
            <div class="min-w-[220px]">
              <p class="font-semibold mb-2 border-b pb-1">
                Keranjang ({{ cartStore.totalQty }})
              </p>

              <!-- Daftar item dalam keranjang -->
              <div
                v-if="cartStore.items.length > 0"
                class="max-h-60 overflow-y-auto space-y-2"
              >
                <div
                  v-for="item in cartStore.items"
                  :key="item.id"
                  class="flex justify-between items-center text-sm"
                >
                  <span class="truncate w-2/3">{{ item.name }}</span>
                  <span class="font-medium">x{{ item.qty }}</span>
                  <span class="text-blue-600 font-semibold">
                    Rp {{ (item.price * item.qty).toLocaleString("id-ID") }}
                  </span>
                </div>
              </div>

              <div v-else class="text-gray-500 text-sm">Keranjang kosong</div>

              <!-- Total harga -->
              <div
                class="mt-3 pt-2 border-t flex justify-between text-sm font-medium"
              >
                <span>Total:</span>
                <span
                  >Rp {{ cartStore.totalPrice.toLocaleString("id-ID") }}</span
                >
              </div>

              <a-button
                type="primary"
                size="small"
                block
                class="mt-3"
                @click="goToCartView"
              >
                Lihat Keranjang
              </a-button>
            </div>
          </template>

          <!-- Tombol ikon keranjang -->
          <a-button
            shape="circle"
            class="relative flex items-center justify-center"
          >
            <template #icon>
              <i class="ri-shopping-cart-2-line text-lg"></i>
            </template>

            <!-- Badge jumlah item -->
            <span
              v-if="cartStore.totalQty > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5"
            >
              {{ cartStore.totalQty }}
            </span>
          </a-button>
        </a-popover>

        <!-- Total harga di sebelah kanan ikon -->
        <span
          v-if="cartStore.totalPrice > 0"
          class="ml-2 text-blue-600 font-semibold text-sm"
        >
          Rp {{ cartStore.totalPrice.toLocaleString("id-ID") }}
        </span>

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
            <a-button type="primary" block @click="addToCart(item)"
              >+ Keranjang</a-button
            >
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

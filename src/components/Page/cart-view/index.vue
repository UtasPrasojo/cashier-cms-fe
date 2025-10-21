<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Header -->
    <div
      class="flex justify-between items-center bg-white rounded-2xl shadow p-4 mb-6"
    >
      <h1 class="text-2xl font-bold text-blue-600">MASPOS</h1>

      <div class="flex items-center gap-3">
        <a-button type="primary" size="large">+ Tambah Kategori</a-button>
        <a-button type="primary" size="large">+ Tambah Produk</a-button>

        <div
          class="flex justify-start items-center bg-blue-50 border border-blue-200 text-blue-600 rounded-lg"
        >
          <div
            class="flex items-center justify-center bg-blue-600 border border-blue-600 text-white font-semibold rounded-lg w-10 h-10 mr-2"
          >
            <i class="ri-shopping-cart-2-line text-lg"></i>
          </div>
          <span class="flex items-center justify-center text-m ">Total Tagihan</span>
          <span class="ml-2 mr-2 font-semibold"
            >Rp {{ totalPrice.toLocaleString("id-ID") }}</span
          >
        </div>

        <a-avatar
          size="large"
          src="https://api.dicebear.com/9.x/adventurer/svg?seed=Aldean"
        />
      </div>
    </div>

    <!-- Table Produk -->
    <div class="bg-white rounded-2xl shadow p-4">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b text-gray-500">
            <th class="pb-3 w-2/5">Produk</th>
            <th class="pb-3">Harga</th>
            <th class="pb-3">Jumlah</th>
            <th class="pb-3">Sub Total</th>
            <th class="pb-3 text-right">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in cartItems"
            :key="index"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="py-3 flex items-center gap-3">
              <img
                :src="item.image"
                alt="product"
                class="w-16 h-16 object-cover rounded-lg"
              />
              <span class="font-medium">{{ item.name }}</span>
            </td>

            <td>Rp {{ item.price.toLocaleString("id-ID") }}</td>

            <td>
              <div class="flex items-center gap-2">
                <a-button
                  shape="circle"
                  size="small"
                  @click="decreaseQty(index)"
                  :disabled="item.qty === 1"
                >
                  <template #icon><i class="ri-subtract-line"></i></template>
                </a-button>

                <span class="w-6 text-center">{{ item.qty }}</span>

                <a-button
                  shape="circle"
                  size="small"
                  @click="increaseQty(index)"
                >
                  <template #icon><i class="ri-add-line"></i></template>
                </a-button>
              </div>
            </td>

            <td>Rp {{ (item.price * item.qty).toLocaleString("id-ID") }}</td>

            <td class="text-right">
              <a class="text-red-500 hover:underline" @click="removeItem(index)"
                >Hapus</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer Button -->
    <div class="flex justify-end gap-3 mt-6">
      <a-button> Kembali </a-button>
      <a-button type="primary"> Bayar </a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const cartItems = ref([
  {
    name: "Pepperoni Cheese",
    price: 45000,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1601924638867-3ec3e06f8b8b?auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Pepperoni Fiesta",
    price: 55000,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1601924638867-3ec3e06f8b8b?auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Mushroom & Truffle",
    price: 38000,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Margherita Classic",
    price: 40000,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1603079842036-7b47de8b84d5?auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Burgeraxx",
    price: 25000,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=60",
  },
]);

// Total harga semua produk
const totalPrice = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
);

// Fungsi ubah jumlah produk
const increaseQty = (index) => {
  cartItems.value[index].qty++;
};

const decreaseQty = (index) => {
  if (cartItems.value[index].qty > 1) {
    cartItems.value[index].qty--;
  }
};

// Hapus produk
const removeItem = (index) => {
  cartItems.value.splice(index, 1);
};
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0 8px;
}
</style>

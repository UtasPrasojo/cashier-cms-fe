<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { useCartStore } from "@/stores/cart.store";
const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

// Ambil total dari query parameter
const total = ref(Number(route.query.total) || 0);

// Format tanggal otomatis
const date = ref(new Date());
const formattedDate = date.value.toLocaleDateString("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

// Tombol kembali

function handleBack() {
  cartStore.clearCart(); // kosongkan keranjang
  message.success("Pembayaran selesai! Keranjang dikosongkan.");
  router.push("/");
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <a-card class="w-[350px] text-center rounded-2xl shadow-md">
      <div class="flex flex-col items-center space-y-2 py-4">
        <div class="flex items-center justify-center">
          <img
            src="@/assets/image/succes.svg"
            alt="success icon"
            class="w-32 h-32"
          />
        </div>

        <div>
          <p class="text-green-600 font-semibold text-lg">Pembayaran Sukses</p>
        </div>

        <div>
          <p class="text-gray-500 text-sm">Total</p>
          <p class="text-lg font-bold text-gray-900">
            Rp{{ total.toLocaleString("id-ID") }}
          </p>
          <p class="text-gray-400 text-xs mt-1">{{ formattedDate }}</p>
        </div>

        <a-button
          type="primary"
          class="w-full rounded-lg mt-3 bg-blue-600 hover:bg-blue-700"
          @click="handleBack"
        >
          ← Kembali
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.ant-card {
  border: none;
}
</style>

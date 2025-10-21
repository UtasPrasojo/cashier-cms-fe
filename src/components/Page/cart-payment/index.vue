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

<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";

const total = ref(224000);
const date = ref(new Date("2024-09-04"));

const formattedDate = date.value.toLocaleDateString("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function handleBack() {
  message.info("Kembali ke halaman utama");
  // contoh navigasi jika pakai vue-router:
  // router.push('/dashboard')
}
</script>

<style scoped>
.ant-card {
  border: none;
}
</style>

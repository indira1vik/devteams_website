<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../components/Footer.vue'

const router = useRouter();
type Role = 'student' | 'professor' | 'admin' | null;
const selectedRole = ref<Role>(null)

function toLoginPage(role: Role) {
  selectedRole.value = role
  router.push({
    name: 'login',
    params: { role: role }
  });
}

</script>

<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex-1 flex justify-center items-center">
      <section class="bg-white">
        <div class="container flex flex-col items-center px-4 py-12 mx-auto text-center">
          <img class="w-auto h-14" src="https://img.icons8.com/glyph-neue/64/155dfc/graduation-cap.png" alt="">
          <h2 class="text-2xl font-bold tracking-tight text-gray-800 xl:text-3xl mt-2">
            Welcome to Dev UnivPortal
          </h2>
          <p class="block max-w-4xl mt-4 text-gray-500"> A website for students and professors to access their
            coursework.
          </p>
          <div class="mt-6">
            <button @click="toLoginPage('student')"
              class="inline-flex items-center justify-center w-full px-4 py-2.5 mt-4 overflow-hidden text-sm text-white transition-colors duration-300 bg-blue-600 rounded-lg shadow sm:w-auto sm:mx-2 sm:mt-0 hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80">
              <span class="mx-2"> Student User </span>
            </button>
            <button @click="toLoginPage('professor')"
              class="inline-flex items-center justify-center w-full px-4 py-2.5 mt-4 overflow-hidden text-sm text-white transition-colors duration-300 bg-blue-600 rounded-lg shadow sm:w-auto sm:mx-2 sm:mt-0 hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80">
              <span class="mx-2"> Professor User </span>
            </button>
            <button @click="toLoginPage('admin')"
              class="inline-flex items-center justify-center w-full px-4 py-2.5 mt-4 overflow-hidden text-sm text-white transition-colors duration-300 bg-blue-600 rounded-lg shadow sm:w-auto sm:mx-2 sm:mt-0 hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80">
              <span class="mx-2"> Admin User </span>
            </button>
          </div>
        </div>
      </section>
    </div>
    <Footer />
  </div>
</template>

<style scoped></style>

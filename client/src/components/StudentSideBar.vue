<script setup lang="ts">

import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
    sname: string,
    semail: string
}>();

const emit = defineEmits<{
    (e: 'select-tab', value: 'dashboard' | 'profile'): void
}>()

function openDashboard() {
    emit('select-tab', 'dashboard')
}

function openProfile() {
    emit('select-tab', 'profile')
}

function logout() {
  localStorage.removeItem('student')
  localStorage.removeItem('professor')
  router.push('/')
}

</script>

<template>
    <div>
        <aside
            class="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l sticky top-0">

            <div class="flex flex-col items-center mt-6 -mx-2">
                <img class="object-cover w-24 h-24 mx-2 rounded-full"
                    src="https://img.icons8.com/ios-filled/100/user-male-circle.png" alt="avatar">
                <h4 class="mx-2 mt-2 font-medium text-gray-800">{{ props.sname }}</h4>
                <p class="mx-2 mt-1 text-sm font-medium text-gray-600">{{ props.semail }}</p>
            </div>

            <div class="flex flex-col justify-between flex-1 mt-6">
                <nav class="flex flex-col gap-2">
                    <a class="flex items-center px-4 py-2 text-gray-700 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                        href="#" @click="openDashboard">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <span class="mx-4 font-medium">Dashboard</span>
                    </a>

                    <a class="flex items-center px-4 py-2 text-gray-700 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                        href="#" @click="openProfile">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <span class="mx-4 font-medium">Account</span>
                    </a>
                    <a class="flex items-center px-4 py-2 text-gray-700 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                        href="#" @click="logout">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H15"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10 17L15 12L10 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path d="M15 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>


                        <span class="mx-4 font-medium">Logout</span>
                    </a>
                </nav>
            </div>
        </aside>
    </div>
</template>
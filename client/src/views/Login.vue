<script setup lang="ts">

import Footer from '../components/Footer.vue';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const role = ref(route.params.role as string);

const email = ref('');
const password = ref('');

const STUDENT_LOGIN = gql`
    mutation Arguments($input: StudentLogin!) {
        loginStudent(input: $input) {
            success
            message
            sid
        }
    }
`;
const PROFESSOR_LOGIN = gql`
    mutation Arguments($input: ProfessorLogin!) {
        loginProfessor(input: $input) {
            success
            message
            pid
        }
    }
`;
const ADMIN_LOGIN = gql`
    mutation Arguments($input: AdminLogin!) {
        loginAdmin(input: $input) {
            success
            message
            aid
        }
    }
`;

const { mutate: studentLoginQuery } = useMutation(STUDENT_LOGIN);
const { mutate: professorLoginQuery } = useMutation(PROFESSOR_LOGIN);
const { mutate: adminLoginQuery } = useMutation(ADMIN_LOGIN);

async function checkLogin() {
    if (email.value === "" || password.value === "") {
        return alert("One of the fields are empty!")
    }
    try {
        if (role.value === 'student') {
            const studentLoginResponse = await studentLoginQuery({
                input: {
                    semail: email.value.toString(),
                    spass: password.value.toString(),
                }
            });

            const data = studentLoginResponse?.data.loginStudent;
            if (data.success) {
                router.push({
                    name: 'student',
                    params: { sid: data.sid }
                });
            } else {
                alert(data.message);
            }

        } else if (role.value === 'professor') {
            const professorLoginResponse = await professorLoginQuery({
                input: {
                    pemail: email.value.toString(),
                    ppass: password.value.toString()
                }
            });
            const data = professorLoginResponse?.data.loginProfessor;
            if (data.success) {
                router.push({
                    name: 'professor',
                    params: { pid: data.pid }
                });
            } else {
                alert(data.message);
            }
        } else if (role.value === 'admin') {
            const adminLoginResponse = await adminLoginQuery({
                input: {
                    aemail: email.value.toString(),
                    apass: password.value.toString()
                }
            });
            const data = adminLoginResponse?.data.loginAdmin;
            if (data.success) {
                router.push({
                    name: 'admin',
                    params: { aid: data.aid }
                });
            } else {
                alert(data.message);
            }
        }
    } catch (error) {
        console.error("Login error => ", error);
    }
}

</script>

<template>
    <div class="flex-col flex min-h-screen">
        <div class="flex-1 flex items-center">
            <section class="bg-white w-full">
                <div class="container px-12 py-24 mx-auto lg:py-32">
                    <div class="lg:flex">
                        <div class="lg:w-1/2">
                            <img class="w-auto h-12 sm:h-12"
                                src="https://img.icons8.com/glyph-neue/64/155dfc/graduation-cap.png" alt="">

                            <h1 class="mt-4 text-gray-600">Welcome back</h1>

                            <h1 class="mt-2 text-2xl font-medium text-gray-800 capitalize lg:text-3xl">
                                login as {{ role }}
                            </h1>
                        </div>

                        <div class="mt-8 lg:w-1/2 lg:mt-0 flex justify-end">
                            <form class="w-full" @submit.prevent="checkLogin">
                                <div class="relative flex items-center">
                                    <span class="absolute">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-3 text-gray-300"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </span>

                                    <input type="email" v-model="email"
                                        class="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                        placeholder="Email address" />
                                </div>

                                <div class="relative flex items-center mt-4">
                                    <span class="absolute">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-3 text-gray-300"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>

                                    <input type="password" v-model="password"
                                        class="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                        placeholder="Password" />
                                </div>

                                <div class="mt-8 md:flex md:items-center justify-between">
                                    <button type="submit"
                                        class="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg md:w-1/2 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                        Sign in
                                    </button>

                                    <a href="#"
                                        class="inline-block mt-4 text-center text-blue-500 md:mt-0 hover:underline">
                                        Forgot your password?
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <Footer />
    </div>
</template>

<style></style>
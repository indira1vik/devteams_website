<script setup lang="ts">

import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const GET_ADMIN_DATA = gql`
  query GetAdminData {
    getAllStudents { sid }
    getAllProfessors { pid }
    getAllCourses { cid }
    getAllTeams { tid }
    getAllAdmins { aid }
  }
`

const { result: adminData, loading, error } = useQuery(GET_ADMIN_DATA)

</script>
<template>
    <div class="w-full mb-10 mt-10">
        <h1 class="text-xl font-medium text-center text-gray-800">Your Dashboard</h1>
        <section class="container mx-auto mt-6">
            <div class="flex flex-col mt-3">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div class="overflow-hidden border border-gray-200 md:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                            Title
                                        </th>
                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                            Count
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <h4 class="text-gray-700">Students</h4>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <h4 class="font-medium text-gray-700">{{ adminData?.getAllStudents?.length || 0
                                                }}</h4>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <h4 class="text-gray-700">Professors</h4>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <h4 class="font-medium text-gray-700">{{ adminData?.getAllProfessors?.length || 0
                                                }}</h4>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <h4 class="text-gray-700">Admins</h4>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <h4 class="font-medium text-gray-700">{{ adminData?.getAllAdmins?.length || 0
                                                }}</h4>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <h4 class="text-gray-700">Courses</h4>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <h4 class="font-medium text-gray-700">{{ adminData?.getAllCourses?.length || 0
                                                }}</h4>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

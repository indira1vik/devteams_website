<script lang="ts" setup>

import gql from 'graphql-tag';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pidVal = route.params.pid as string;

const gsizes = ref<Record<string, number>>({});

const FORM_GROUP_MUTATION = gql`
    mutation FormGroups($input: FormingGroupInput!) {
        formGroups(input: $input) {
            success
            message
            teamsCreated
        }
    }
`;

const GET_PROFESSORS_DETAILS = gql`
    query Arguments($pid: ID!) {
        getOneProfessor(pid: $pid) {
            pid
            pname
            pemail
            courses {
                cid
                ctitle
                enrolled {
                    eid
                }
            }
        }
    }
`;

const { result: oneProfessorResult } = useQuery(GET_PROFESSORS_DETAILS, { pid: pidVal });
const { mutate: formGroups } = useMutation(FORM_GROUP_MUTATION);

const handleFormGroups = async (courseId: string, enrolledLength: number) => {
    const courseGroupSize = gsizes.value[courseId] || 0;
    if (courseGroupSize <= 0 || courseGroupSize > enrolledLength) {
        alert("Enter valid group size");
        return;
    }
    try {
        const result = await formGroups({
            input: {
                cid: courseId,
                gsize: courseGroupSize
            }
        });

        if (result?.data?.formGroups?.success) {
            alert(`Success! Created ${result.data.formGroups.teamsCreated} teams`);
        } else {
            alert(`Error: ${result?.data?.formGroups?.message || 'Unknown error'}`);
        }
    } catch(error) {
        console.error('Error forming groups:', error);
        alert('Error forming groups');
    }
};

</script>

<template>
    <div class="w-full mb-10">
        <section class="bg-white rounded-2xl shadow-lg border-1 h-fit mt-10">
            <div class="container grid grid-cols-1 gap-10 px-6 py-12 mx-auto lg:grid-cols-3">
                <div class="">
                    <img class="object-cover w-24 h-24 rounded-full"
                        src="https://img.icons8.com/ios-filled/100/user-male-circle.png" alt="avatar">
                    <h1 class="mt-2 text-2xl font-semibold text-gray-800 md:text-3xl">{{
                        oneProfessorResult.getOneProfessor.pname }}</h1>
                </div>

                <div class="grid grid-cols-1 gap-12 lg:col-span-2 sm:grid-cols-2">
                    <div>
                        <h2 class="font-medium text-gray-800">{{ oneProfessorResult.getOneProfessor.pemail }}</h2>
                        <p class="text-gray-500">Email ID</p>
                    </div>
                    <div>
                        <h2 class="font-medium text-gray-800">{{ oneProfessorResult.getOneProfessor.pid }}</h2>
                        <p class="text-gray-500">ID Number</p>
                    </div>
                </div>
            </div>
        </section>
        <section class="container mx-auto mt-6">
            <h2 class="text-lg text-center font-medium text-gray-800">Your Courses</h2>
            <div class="flex flex-col mt-3">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div class="overflow-hidden border border-gray-200 md:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                            Course Code
                                        </th>

                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                            Course Name
                                        </th>

                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                            No. of Students
                                        </th>
                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                            Select Group Size</th>
                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="course in oneProfessorResult?.getOneProfessor.courses">
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <h4 class="text-gray-700">{{ course.cid }}</h4>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                            <div>
                                                <h2 class="font-medium text-gray-800">{{ course.ctitle }}</h2>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <h4 class="text-gray-700">{{ course.enrolled.length }}</h4>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <input type="number" v-model="gsizes[course.cid]"
                                                class="block py-2 w-30 text-gray-700 bg-white border rounded-lg px-2 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                                placeholder="Group Size" />
                                        </td>
                                        <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                            <button @click="handleFormGroups(course.cid, course.enrolled.length)"
                                                class="inline-flex items-center justify-center w-full px-4 py-2.5 mt-4 overflow-hidden text-sm text-white transition-colors duration-300 bg-blue-600 rounded-lg shadow sm:w-auto sm:mx-2 sm:mt-0 hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                                                <span class="mx-2"> Form Groups </span>
                                            </button>
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
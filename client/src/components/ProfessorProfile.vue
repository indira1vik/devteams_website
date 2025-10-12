<script lang="ts" setup>

import gql from 'graphql-tag';
import { useQuery } from '@vue/apollo-composable';

const props = defineProps<{
    pid: string
}>();

const pidVal = props.pid;

const GET_PROFESSORS_DETAILS = gql`
    query Arguments($pid: ID!) {
        getOneProfessor(pid: $pid) {
            pid
            pname
            pemail
        }
    }
`;

const { result: oneProfessorResult } = useQuery(GET_PROFESSORS_DETAILS, { pid: pidVal });

</script>

<template>
    <div class="shadow-lg border-1 h-fit rounded-2xl mt-10 flex-1">
        <section class="bg-white rounded-2xl">
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
    </div>

</template>
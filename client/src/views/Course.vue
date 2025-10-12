<script setup lang="ts">

import { useRoute } from 'vue-router';
import gql from 'graphql-tag';
import { ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import CourseStudentsTable from '../components/CourseStudentsTable.vue';
import CourseStudentsGroups from '../components/CourseStudentsGroups.vue';

const route = useRoute();
const cid = route.params.cid as string;

const activeTab = ref<'groups' | 'roster'>('groups')

const GET_COURSE_DETAILS = gql`
query Arguments($cid: ID!) {
  getOneCourse(cid: $cid) {
    cid
    ctitle
  }
}
`;

const { result: getCourseDetails } = useQuery(GET_COURSE_DETAILS, { cid: cid });

function setTab(tab: 'groups' | 'roster') {
    activeTab.value = tab
}

</script>

<template>
    <div class="p-8">
        <div>
            <h1 class="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl">
                {{ getCourseDetails.getOneCourse.ctitle }}
            </h1>
            <p class="mt-1 max-w-2xl mx-auto text-center text-gray-500">
                Code - {{ getCourseDetails.getOneCourse.cid }}
            </p>
        </div>
        <div class="flex overflow-x-auto overflow-y-hidden border-b border-gray-200 whitespace-nowrap w-full">
            <button @click="setTab('groups')"
                class="flex-1 justify-center inline-flex items-center h-10 px-4 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-transparent sm:text-base whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400">
                Groups
            </button>
            <button @click="setTab('roster')"
                class="flex-1 justify-center inline-flex items-center h-10 px-4 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-transparent sm:text-base whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400">
                Roster List
            </button>
        </div>
        <div v-if="activeTab === 'roster'">
            <CourseStudentsTable />
        </div>
        <div v-else-if="activeTab === 'groups'">
            <CourseStudentsGroups />
        </div>
    </div>
</template>
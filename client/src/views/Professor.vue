<script setup lang="ts">

import { useRoute } from 'vue-router';
import gql from 'graphql-tag';
import { ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import ProfessorSideBar from '../components/ProfessorSideBar.vue';
import ProfessorProfile from '../components/ProfessorProfile.vue';
import ProfessorDashboard from '../components/ProfessorDashboard.vue';

const route = useRoute();

const pid = route.params.pid as string;
const selectedTab = ref<'dashboard' | 'profile'>('dashboard')

const GET_PROFESSORS_DETAILS = gql`
    query Arguments($pid: ID!) {
        getOneProfessor(pid: $pid) {
            pid
            pname
            pemail
        }
    }
`;

const { result: oneProfessorResult } = useQuery(GET_PROFESSORS_DETAILS, { pid: pid });

</script>

<template>
    <div class="flex gap-10 pr-10">
        <ProfessorSideBar :pname="oneProfessorResult.getOneProfessor.pname"
            :pemail="oneProfessorResult.getOneProfessor.pemail" @select-tab="selectedTab = $event" />
        <ProfessorDashboard v-if="selectedTab === 'dashboard'" :pid="pid" />
        <ProfessorProfile v-else-if="selectedTab === 'profile'" :pid="pid" />
    </div>
</template>
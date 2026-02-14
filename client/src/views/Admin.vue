<script setup lang="ts">

import { useRoute } from 'vue-router';
import gql from 'graphql-tag';
import { ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import AdminStudentsList from '../components/AdminStudentsList.vue';
import AdminAllAdminsList from '../components/AdminAllAdminsList.vue';
import AdminCoursesList from '../components/AdminCoursesList.vue';
import AdminProfessorsList from '../components/AdminProfessorsList.vue';
import AdminSideBar from '../components/AdminSideBar.vue';
import AdminDashboard from '../components/AdminDashboard.vue';

const route = useRoute();

const aid = route.params.aid as string;
const selectedTab = ref<'students' | 'professors' | 'admins' | 'courses' | 'dashboard'>('dashboard')

const GET_ADMIN_DETAILS = gql`
    query Arguments($aid: ID!) {
        getOneAdmin(aid: $aid) {
            aid
            aname
            aemail
        }
    }
`;

const { result: oneAdminResult, loading, error } = useQuery(GET_ADMIN_DETAILS, { aid: aid });

</script>

<template>
    <div v-if="loading">
        <div class="text-lg">Loading...</div>
    </div>
    <div v-else-if="error">
        <div>Error: {{ error.message }}</div>
    </div>
    <div v-else-if="oneAdminResult?.getOneAdmin" class="flex gap-10 pr-10">
        <AdminSideBar :aname="oneAdminResult.getOneAdmin.aname" :aemail="oneAdminResult.getOneAdmin.aemail" @select-tab="selectedTab = $event" />
        <AdminDashboard v-if="selectedTab === 'dashboard'" :aid="aid" />
        <AdminStudentsList v-if="selectedTab === 'students'" :aid="aid" />
        <AdminProfessorsList v-else-if="selectedTab === 'professors'" :aid="aid" />
        <AdminAllAdminsList v-else-if="selectedTab === 'admins'" :aid="aid" />
        <AdminCoursesList v-else-if="selectedTab === 'courses'" :aid="aid" />
    </div>
    <div v-else class="flex justify-center items-center h-screen">
        <div>Admin not found</div>
    </div>
</template>
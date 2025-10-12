<script setup lang="ts">

import { useRoute } from 'vue-router';
import gql from 'graphql-tag';
import { ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import StudentSideBar from '../components/StudentSideBar.vue';
import StudentDashboard from '../components/StudentDashboard.vue';
import StudentProfile from '../components/StudentProfile.vue';

const route = useRoute();

const sid = route.params.sid as string;
const selectedTab = ref<'dashboard' | 'profile'>('dashboard')

const GET_STUDENTS_DETAILS = gql`
    query Arguments($sid: ID!) {
        getOneStudent(sid: $sid) {
            sid
            sname
            gender
            semail
        }
    }
`;

const { result: oneStudentResult } = useQuery(GET_STUDENTS_DETAILS, { sid: sid });

</script>
<template>
  <div class="flex gap-10 pr-10">
    <StudentSideBar :sname="oneStudentResult.getOneStudent.sname" :semail="oneStudentResult.getOneStudent.semail" 
    @select-tab="selectedTab = $event"
    />
    <StudentDashboard v-if="selectedTab === 'dashboard'" :sid="sid" />
    <StudentProfile v-else-if="selectedTab === 'profile'" :sid="sid"/>
  </div>

</template>

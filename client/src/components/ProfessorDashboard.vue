<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useRouter } from 'vue-router';

const props = defineProps<{
    pid: string
}>();
const pidVal = props.pid;

const GET_COURSES_LIST = gql`
query GetOneProfessor($pid: ID!) {
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

const { result: professorCoursesResult, loading, error } = useQuery(GET_COURSES_LIST, { pid: pidVal });

const router = useRouter();

function handleCourseClick(cid: string) {
  console.log(cid);
  router.push({
    name: 'course',
    params: { cid: cid }
  })
}

</script>

<template>
<div class="flex-col m-8">
        <h1 class="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl">Your Course List</h1>
        <div v-if="loading" class="text-center mt-8 text-gray-500">Loading...</div>
        <div v-else-if="error" class="text-center text-red-600 mt-8">{{ error.message }}</div>
        <div v-else class="grid grid-cols-1 gap-4 mt-8 xl:mt-12 xl:gap-8 md:grid-cols-2 xl:grid-cols-3">
            <div v-for="course in professorCoursesResult?.getOneProfessor.courses" class="flex cursor-pointer" @click="handleCourseClick(course.cid)">
                <div class="w-full max-w-xs overflow-hidden bg-white rounded-lg shadow-lg border-1">
                    <img class="object-cover w-full h-56"
                        src="https://img.freepik.com/free-photo/book-composition-with-open-book_23-2147690555.jpg"
                        alt="avatar">

                    <div class="py-5 text-center">
                        <span class="text-sm text-blue-500 font-medium capitalize">code - {{ course.cid }}</span>
                        <div class="block text-2xl font-bold text-gray-800 mb-4 px-3" tabindex="0" role="link">{{ course.ctitle }}</div>
                        <span class="text-sm text-gray-700">{{ course.enrolled.length }} Students</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
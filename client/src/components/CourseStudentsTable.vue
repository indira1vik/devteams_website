<script setup lang="ts">
import { useRoute } from 'vue-router';
import gql from 'graphql-tag';
import { useQuery } from '@vue/apollo-composable';

const route = useRoute();
const cid = route.params.cid as string;

const GET_COURSE_ROSTER_LIST = gql`
query Arguments($cid: ID!) {
  getOneCourse(cid: $cid) {
    cid
    ctitle
    enrolled {
      student {
        sname
        gender
        sid
        semail
      }
    }
  }
}
`;

const { result: getCourseRosterList, loading, error } = useQuery(GET_COURSE_ROSTER_LIST, { cid: cid });

function genderClasses(gender: string) {
  const g = gender.trim();
  if (g === 'Male') return 'text-orange-500 bg-orange-100/60';
  else if (g === 'Female') return 'text-emerald-500 bg-emerald-100/60';
  else if (g === 'Other') return 'text-purple-500 bg-purple-100/60';
  return 'text-gray-500 bg-gray-100/60';
}

</script>

<template>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <div v-else>
        <section class="container px-4 mx-auto">
            <div class="flex flex-col mt-6">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div class="overflow-hidden border border-gray-200 md:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                            Index
                                        </th>
                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                            ID Number
                                        </th>

                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                            Student Name
                                        </th>

                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                            Student Email</th>

                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                            Gender</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="(enroll, index) in getCourseRosterList.getOneCourse.enrolled">
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <h4 class="text-gray-700">{{ index + 1 }}</h4>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <h4 class="text-gray-700">{{ enroll.student.sid }}</h4>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                            <div>
                                                <h2 class="font-medium text-gray-800">{{ enroll.student.sname }}</h2>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <h4 class="text-gray-700">{{ enroll.student.semail }}</h4>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                            <div class="inline px-3 py-1 text-sm font-normal rounded-full" :class="genderClasses(enroll.student.gender)">
                                                {{ enroll.student.gender }}
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
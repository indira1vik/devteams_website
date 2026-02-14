<script lang="ts" setup>

import gql from 'graphql-tag';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const sidVal = route.params.sid as string;

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

const GET_ALL_SKILLS = gql`
    query GetAllSkillSets {
        getAllSkillSets {
            skname
            skid
        }
    }
`;

const UPDATE_STUDENT_SKILLS = gql`
mutation UpdateStudentSkill($input: updateSkillInput) {
  updateStudentSkill(input: $input) {
    levels
  }
}
`;

const GET_STUDENT_SKILLS_SET = gql`
query GetOneStudentSkills($sid: ID!) {
  getOneStudentSkills(sid: $sid) {
    ssid
    skillset {
      skid
    }
    levels
  }
}
`;

const { result: oneStudentResult } = useQuery(GET_STUDENTS_DETAILS, { sid: sidVal });
const { result: allSkills } = useQuery(GET_ALL_SKILLS);
const { mutate: updateStudentSkillQuery } = useMutation(UPDATE_STUDENT_SKILLS);
const { result: getStudentSkills } = useQuery(GET_STUDENT_SKILLS_SET, { sid: sidVal });

const selectedLevel = ref<Record<string, number>>({});

async function selectLevel(sid: string, skid: string, levels: number) {
    selectedLevel.value[skid] = levels;
    await updateStudentSkillQuery({
        input: {
            sid: parseInt(sid, 10),
            skid: parseInt(skid, 10),
            levels: levels
        }
    });
}

const skillLevelsMapping = () => {
    return Object.fromEntries(
        getStudentSkills.value.getOneStudentSkills.map((s: any) => [s.skillset.skid, s.levels])
    );
}

</script>

<template>
    <div class="w-full mb-10">
        <section class="bg-white rounded-2xl shadow-lg border-1 h-fit mt-10">
            <div class="container grid grid-cols-1 gap-10 px-6 py-12 mx-auto lg:grid-cols-3">
                <div class="">
                    <img class="object-cover w-24 h-24 rounded-full"
                        src="https://img.icons8.com/ios-filled/100/user-male-circle.png" alt="avatar">
                    <h1 class="mt-2 text-2xl font-semibold text-gray-800 md:text-3xl">{{
                        oneStudentResult.getOneStudent.sname }}</h1>
                </div>

                <div class="grid grid-cols-1 gap-12 lg:col-span-2 sm:grid-cols-2">
                    <div>
                        <h2 class="font-medium text-gray-800">{{ oneStudentResult.getOneStudent.semail }}</h2>
                        <p class="text-gray-500">Email ID</p>
                    </div>
                    <div>
                        <h2 class="font-medium text-gray-800">{{ oneStudentResult.getOneStudent.sid }}</h2>
                        <p class="text-gray-500">ID Number</p>
                    </div>

                    <div>
                        <h2 class="font-medium text-gray-800">{{ oneStudentResult.getOneStudent.gender }}</h2>
                        <p class="text-gray-500">Gender</p>
                    </div>
                </div>
            </div>
        </section>
        <section class="container mx-auto mt-6">
            <h2 class="text-lg text-center font-medium text-gray-800">Your Skillset</h2>
            <div class="flex flex-col mt-3">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div class="overflow-hidden border border-gray-200 md:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                            Skill ID
                                        </th>

                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                            Skill Name
                                        </th>

                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                            Skill Input
                                        </th>
                                        <th scope="col"
                                            class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                            Selected Level
                                        </th>
                                    </tr>
                                </thead>
                                <tbody v-for="oneSkill in allSkills.getAllSkillSets"
                                    class="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <h4 class="text-gray-700">{{ oneSkill.skid }}</h4>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                            <div>
                                                <h2 class="font-medium text-gray-800">{{ oneSkill.skname }}</h2>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                                            <div class="flex">
                                                <a v-for="level in [1, 2, 3, 4, 5]"
                                                    @click.prevent="selectLevel(oneStudentResult.getOneStudent.sid, oneSkill.skid, level)"
                                                    class="items-center cursor-pointer px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform rounded-md"
                                                    :class="selectedLevel[oneSkill.skid] === level ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'">
                                                    {{ level }}
                                                </a>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                            <div>
                                                <h2 class="font-medium text-gray-800">{{skillLevelsMapping()[oneSkill.skid]}}</h2>
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
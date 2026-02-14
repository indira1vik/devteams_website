import { createRouter, createWebHistory } from 'vue-router';
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Student from '../views/Student.vue';
import Professor from '../views/Professor.vue';
import Course from '../views/Course.vue';
import Admin from '../views/Admin.vue';

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/login/:role",
    name: "login",
    component: Login
  },
  {
    path: "/student/:sid",
    name: "student",
    component: Student
  },
  {
    path: "/professor/:pid",
    name: "professor",
    component: Professor
  },
  {
    path: "/course/:cid",
    name: "course",
    component: Course
  },
  {
    path: "/admin/:aid",
    name: "admin",
    component: Admin
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
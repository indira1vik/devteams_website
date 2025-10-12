import { pid } from "process";
import { courses, enrolled, PrismaClient, professors, skillset, students, studentskills, teampeople, teams } from "../generated/prisma";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const resolvers = {
    Query: {
        getAllStudents: () => prisma.students.findMany(),
        getAllProfessors: () => prisma.professors.findMany(),
        getAllCourses: () => prisma.courses.findMany(),
        getAllEnrolled: () => prisma.enrolled.findMany(),
        getAllSkillSets: () => prisma.skillset.findMany(),
        getAllStudentSkills: () => prisma.studentskills.findMany(),
        getAllTeams: () => prisma.teams.findMany(),
        getAllTeamPeople: () => prisma.teampeople.findMany(),

        getOneStudent: (_: any, args: any) => prisma.students.findUnique({ where: { sid: parseInt(args.sid, 10) } }),
        getOneProfessor: (_: any, args: any) => prisma.professors.findUnique({ where: { pid: parseInt(args.pid, 10) } }),
        getOneCourse: (_: any, args: any) => prisma.courses.findUnique({ where: { cid: parseInt(args.cid, 10) } }),
        getOneEnrolled: (_: any, args: any) => prisma.enrolled.findUnique({ where: { eid: parseInt(args.eid, 10) } }),
        getOneSkillSet: (_: any, args: any) => prisma.skillset.findUnique({ where: { skid: parseInt(args.skid, 10) } }),
        getOneStudentSkills: (_: any, args: any) => prisma.studentskills.findMany({ where: { sid: parseInt(args.sid, 10) } }),
        getOneTeam: (_: any, args: any) => prisma.teams.findUnique({ where: { tid: parseInt(args.tid, 10) } }),
        getOneTeamPeople: (_: any, args: any) => prisma.teampeople.findUnique({ where: { tpid: parseInt(args.tpid, 10) } })
    },
    Mutation: {
        addStudent: (_: any, { input }: any) => {
            return prisma.students.create({
                data: {
                    sname: input.sname,
                    semail: input.semail,
                    gender: input.gender,
                    spass: input.spass
                },
            });
        },
        addProfessor: (_: any, { input }: any) => {
            return prisma.professors.create({
                data: {
                    pname: input.pname,
                    pemail: input.pemail,
                    ppass: input.ppass
                }
            })
        },
        addCourse: (_: any, { input }: any) => {
            return prisma.courses.create({
                data: {
                    ctitle: input.ctitle,
                    pid: input.pid
                }
            })
        },
        enrollStudent: (_: any, { input }: any) => {
            return prisma.enrolled.create({
                data: {
                    sid: input.sid,
                    cid: input.cid
                }
            });
        },
        addOneTeam: (_: any, input: any) => {
            return prisma.teams.create({
                data: {
                    cid: input.sid,
                }
            });
        },
        addTeamPeople: (_: any, input: any) => {
            return prisma.teampeople.create({
                data: {
                    tid: input.tid,
                    sid: input.sid
                }
            });
        },
        updateStudentSkill: async (_: any, args: any) => {
            const { sid, skid, levels } = args.input;

            const existing = await prisma.studentskills.findUnique({
                where: { sid_skid: { sid: parseInt(sid, 10), skid: parseInt(skid, 10) } },
            });

            if (existing) {
                return prisma.studentskills.update({
                    where: { sid_skid: { sid: parseInt(sid, 10), skid: parseInt(skid, 10) } },
                    data: { levels: parseInt(levels, 10) },
                });
            } else {
                return prisma.studentskills.create({
                    data: {
                        sid: parseInt(sid, 10),
                        skid: parseInt(skid, 10),
                        levels: parseInt(levels, 10),
                    },
                });
            }
        },
        loginStudent: async (_: any, { input }: any) => {
            const student = await prisma.students.findUnique({
                where: { semail: input.semail }
            });

            if (!student) return {
                success: false,
                message: "Email not found",
                sid: null
            }

            const validPass = await bcrypt.compare(input.spass, student.spass);
            if (!validPass) return {
                success: false,
                message: "Invalid Password",
                sid: null
            }

            return {
                success: true,
                message: "Right credentials",
                sid: student.sid
            };
        },
        loginProfessor: async (_: any, { input }: any) => {
            const professor = await prisma.professors.findUnique({
                where: { pemail: input.pemail }
            });

            if (!professor) return {
                success: false,
                message: "Email not found",
                pid: null
            };

            const validPass = await bcrypt.compare(input.ppass, professor.ppass);
            if (!validPass) return {
                success: false,
                message: "Invalid Password",
                pid: professor.pid
            };

            return {
                success: true,
                message: "Right credentials",
                pid: professor.pid
            };
        }
    },


    Enroll: {
        student(parent: students) {
            return prisma.students.findUnique({
                where: { sid: parent.sid }
            });
        },
        course(parent: courses) {
            return prisma.courses.findUnique({
                where: { cid: parent.cid }
            });
        }
    },
    Student: {
        enrolled(parent: enrolled) {
            return prisma.enrolled.findMany({
                where: { sid: parent.sid }
            });
        },
        studentskills(parent: studentskills) {
            return prisma.studentskills.findMany({
                where: { sid: parent.sid }
            });
        },
        teampeople(parent: teampeople) {
            return prisma.teampeople.findMany({
                where: { sid: parent.sid }
            });
        }
    },
    Professor: {
        courses(parent: courses) {
            return prisma.courses.findMany({
                where: { pid: parent.pid }
            });
        }
    },
    Course: {
        professor(parent: professors) {
            return prisma.professors.findUnique({
                where: { pid: parent.pid }
            })
        },
        enrolled(parent: enrolled) {
            return prisma.enrolled.findMany({
                where: { cid: parent.cid }
            });
        },
        teams(parent: teams) {
            return prisma.teams.findMany({
                where: { cid: parent.cid }
            });
        }
    },
    SkillSet: {
        studentskills(parent: studentskills) {
            return prisma.studentskills.findMany({
                where: { skid: parent.skid }
            });
        }
    },
    StudentSkill: {
        skillset(parent: skillset) {
            return prisma.skillset.findUnique({
                where: { skid: parent.skid }
            });
        }
    },
    Team: {
        course: (parent: courses) => {
            return prisma.courses.findUnique({
                where: { cid: parent.cid },
            });
        },
        teampeople: (parent: teampeople) => {
            return prisma.teampeople.findMany({
                where: { tid: parent.tid },
            });
        },
    },
    TeamPerson: {
        student: (parent: students) => {
            return prisma.students.findUnique({
                where: { sid: parent.sid },
            });
        },
        team: (parent: teams) => {
            return prisma.teams.findUnique({
                where: { tid: parent.tid },
            });
        },
    }
};
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const prisma_1 = require("../generated/prisma");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new prisma_1.PrismaClient();
exports.resolvers = {
    Query: {
        getAllStudents: () => prisma.students.findMany(),
        getAllProfessors: () => prisma.professors.findMany(),
        getAllAdmins: () => prisma.admins.findMany(),
        getAllCourses: () => prisma.courses.findMany(),
        getAllEnrolled: () => prisma.enrolled.findMany(),
        getAllSkillSets: () => prisma.skillset.findMany(),
        getAllStudentSkills: () => prisma.studentskills.findMany(),
        getAllTeams: () => prisma.teams.findMany(),
        getAllTeamPeople: () => prisma.teampeople.findMany(),
        getOneStudent: (_, args) => prisma.students.findUnique({ where: { sid: parseInt(args.sid, 10) } }),
        getOneProfessor: (_, args) => prisma.professors.findUnique({ where: { pid: parseInt(args.pid, 10) } }),
        getOneAdmin: (_, args) => prisma.admins.findUnique({ where: { aid: parseInt(args.aid, 10) } }),
        getOneCourse: (_, args) => prisma.courses.findUnique({ where: { cid: parseInt(args.cid, 10) } }),
        getOneEnrolled: (_, args) => prisma.enrolled.findUnique({ where: { eid: parseInt(args.eid, 10) } }),
        getOneSkillSet: (_, args) => prisma.skillset.findUnique({ where: { skid: parseInt(args.skid, 10) } }),
        getOneStudentSkills: (_, args) => prisma.studentskills.findMany({ where: { sid: parseInt(args.sid, 10) } }),
        getOneTeam: (_, args) => prisma.teams.findUnique({ where: { tid: parseInt(args.tid, 10) } }),
        getOneTeamPeople: (_, args) => prisma.teampeople.findUnique({ where: { tpid: parseInt(args.tpid, 10) } })
    },
    Mutation: {
        addStudent: (_, { input }) => {
            return prisma.students.create({
                data: {
                    sname: input.sname,
                    semail: input.semail,
                    gender: input.gender,
                    spass: input.spass
                },
            });
        },
        addProfessor: (_, { input }) => {
            return prisma.professors.create({
                data: {
                    pname: input.pname,
                    pemail: input.pemail,
                    ppass: input.ppass
                }
            });
        },
        addAdmin: (_, { input }) => {
            return prisma.admins.create({
                data: {
                    aname: input.aname,
                    aemail: input.aemail,
                    apass: input.apass
                }
            });
        },
        addCourse: (_, { input }) => {
            return prisma.courses.create({
                data: {
                    ctitle: input.ctitle,
                    pid: input.pid
                }
            });
        },
        enrollStudent: (_, { input }) => {
            return prisma.enrolled.create({
                data: {
                    sid: input.sid,
                    cid: input.cid
                }
            });
        },
        addOneTeam: (_, input) => {
            return prisma.teams.create({
                data: {
                    cid: input.sid,
                }
            });
        },
        addTeamPeople: (_, input) => {
            return prisma.teampeople.create({
                data: {
                    tid: input.tid,
                    sid: input.sid
                }
            });
        },
        updateStudentSkill: async (_, args) => {
            const { sid, skid, levels } = args.input;
            const existing = await prisma.studentskills.findUnique({
                where: { sid_skid: { sid: parseInt(sid, 10), skid: parseInt(skid, 10) } },
            });
            if (existing) {
                return prisma.studentskills.update({
                    where: { sid_skid: { sid: parseInt(sid, 10), skid: parseInt(skid, 10) } },
                    data: { levels: parseInt(levels, 10) },
                });
            }
            else {
                return prisma.studentskills.create({
                    data: {
                        sid: parseInt(sid, 10),
                        skid: parseInt(skid, 10),
                        levels: parseInt(levels, 10),
                    },
                });
            }
        },
        loginStudent: async (_, { input }) => {
            const student = await prisma.students.findUnique({
                where: { semail: input.semail }
            });
            if (!student)
                return {
                    success: false,
                    message: "Email not found",
                    sid: null
                };
            const validPass = await bcrypt.compare(input.spass, student.spass);
            if (!validPass)
                return {
                    success: false,
                    message: "Invalid Password",
                    sid: null
                };
            return {
                success: true,
                message: "Right credentials",
                sid: student.sid
            };
        },
        loginProfessor: async (_, { input }) => {
            const professor = await prisma.professors.findUnique({
                where: { pemail: input.pemail }
            });
            if (!professor)
                return {
                    success: false,
                    message: "Email not found",
                    pid: null
                };
            const validPass = await bcrypt.compare(input.ppass, professor.ppass);
            if (!validPass)
                return {
                    success: false,
                    message: "Invalid Password",
                    pid: professor.pid
                };
            return {
                success: true,
                message: "Right credentials",
                pid: professor.pid
            };
        },
        loginAdmin: async (_, { input }) => {
            const admin = await prisma.admins.findUnique({
                where: { aemail: input.aemail }
            });
            if (!admin)
                return {
                    success: false,
                    message: "Email not found",
                    aid: null
                };
            const validPass = await bcrypt.compare(input.apass, admin.apass);
            if (!validPass)
                return {
                    success: false,
                    message: "Invalid Password",
                    aid: null
                };
            return {
                success: true,
                message: "Right credentials",
                aid: admin.aid
            };
        },
        formGroups: async (_, { input }) => {
            try {
                // Deleting already created teams (if button clicked again)
                const existingTeams = await prisma.teams.findMany({
                    where: { cid: parseInt(input.cid) }
                });
                if (existingTeams.length > 0) {
                    await prisma.teampeople.deleteMany({
                        where: {
                            tid: {
                                in: existingTeams.map(team => team.tid)
                            }
                        }
                    });
                    await prisma.teams.deleteMany({
                        where: { cid: parseInt(input.cid) }
                    });
                }
                const enrolledStudents = await prisma.enrolled.findMany({
                    where: { cid: parseInt(input.cid) },
                    include: { students: true }
                });
                if (enrolledStudents.length === 0) {
                    return {
                        success: false,
                        message: "No students enrolled in this course",
                        teamsCreated: 0
                    };
                }
                const totalStudents = enrolledStudents.length;
                const numberOfTeams = Math.ceil(totalStudents / input.gsize);
                const teams = [];
                const teamMembers = [];
                for (let i = 0; i < numberOfTeams; i++) {
                    const team = await prisma.teams.create({
                        data: {
                            cid: parseInt(input.cid),
                            tname: `Team ${i + 1}`
                        }
                    });
                    teams.push(team.tid);
                }
                // Member Assignment
                enrolledStudents.forEach((enrollment, index) => {
                    const teamIndex = index % numberOfTeams;
                    const teamId = teams[teamIndex];
                    if (teamId != undefined) {
                        teamMembers.push({
                            tid: teamId,
                            sid: enrollment.sid
                        });
                    }
                });
                await prisma.teampeople.createMany({ data: teamMembers });
                return {
                    success: true,
                    message: `Successfully created ${numberOfTeams} teams with ${totalStudents} students`,
                    teamsCreated: numberOfTeams
                };
            }
            catch (error) {
                console.error('Error forming groups:', error);
                return {
                    success: false,
                    message: "Error forming groups: " + error.message,
                    teamsCreated: 0
                };
            }
        }
    },
    Enroll: {
        student(parent) {
            return prisma.students.findUnique({
                where: { sid: parent.sid }
            });
        },
        course(parent) {
            return prisma.courses.findUnique({
                where: { cid: parent.cid }
            });
        }
    },
    Student: {
        enrolled(parent) {
            return prisma.enrolled.findMany({
                where: { sid: parent.sid }
            });
        },
        studentskills(parent) {
            return prisma.studentskills.findMany({
                where: { sid: parent.sid }
            });
        },
        teampeople(parent) {
            return prisma.teampeople.findMany({
                where: { sid: parent.sid }
            });
        }
    },
    Professor: {
        courses(parent) {
            return prisma.courses.findMany({
                where: { pid: parent.pid }
            });
        }
    },
    Course: {
        professor(parent) {
            return prisma.professors.findUnique({
                where: { pid: parent.pid }
            });
        },
        enrolled(parent) {
            return prisma.enrolled.findMany({
                where: { cid: parent.cid }
            });
        },
        teams(parent) {
            return prisma.teams.findMany({
                where: { cid: parent.cid }
            });
        }
    },
    SkillSet: {
        studentskills(parent) {
            return prisma.studentskills.findMany({
                where: { skid: parent.skid }
            });
        }
    },
    StudentSkill: {
        skillset(parent) {
            return prisma.skillset.findUnique({
                where: { skid: parent.skid }
            });
        }
    },
    Team: {
        course: (parent) => {
            return prisma.courses.findUnique({
                where: { cid: parent.cid },
            });
        },
        teampeople: (parent) => {
            return prisma.teampeople.findMany({
                where: { tid: parent.tid },
            });
        },
    },
    TeamPerson: {
        student: (parent) => {
            return prisma.students.findUnique({
                where: { sid: parent.sid },
            });
        },
        team: (parent) => {
            return prisma.teams.findUnique({
                where: { tid: parent.tid },
            });
        },
    }
};

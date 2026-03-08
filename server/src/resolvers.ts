import { courses, enrolled, PrismaClient, professors, skillset, students, admins, studentskills, teampeople, teams } from "../generated/prisma";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// --- K-Means Helpers ---
function euclideanDistSq(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += (a[i] - b[i]) ** 2;
    return sum;
}

function kMeansPlusPlusInit(vectors: number[][], k: number): number[][] {
    const centroids: number[][] = [];
    const n = vectors.length;
    const dims = vectors[0].length;

    // First centroid chosen randomly
    centroids.push([...vectors[Math.floor(Math.random() * n)]]);

    for (let c = 1; c < k; c++) {
        const distances = vectors.map(v => {
            let minDist = Infinity;
            for (const centroid of centroids) {
                minDist = Math.min(minDist, euclideanDistSq(v, centroid));
            }
            return minDist;
        });

        const totalDist = distances.reduce((a, b) => a + b, 0);
        if (totalDist === 0) {
            centroids.push([...vectors[Math.floor(Math.random() * n)]]);
            continue;
        }

        let r = Math.random() * totalDist;
        let picked = n - 1;
        for (let i = 0; i < n; i++) {
            r -= distances[i];
            if (r <= 0) { picked = i; break; }
        }
        centroids.push([...vectors[picked]]);
    }
    return centroids;
}

function runKMeans(vectors: number[][], k: number, maxIter = 100): { centroids: number[][]; assignments: number[] } {
    const n = vectors.length;
    const dims = vectors[0].length;
    const centroids = kMeansPlusPlusInit(vectors, k);
    let assignments = new Array(n).fill(0);

    for (let iter = 0; iter < maxIter; iter++) {
        // Assign to nearest centroid
        const newAssignments = vectors.map(v => {
            let minDist = Infinity;
            let best = 0;
            for (let c = 0; c < k; c++) {
                const d = euclideanDistSq(v, centroids[c]);
                if (d < minDist) { minDist = d; best = c; }
            }
            return best;
        });

        const converged = newAssignments.every((a, i) => a === assignments[i]);
        assignments = newAssignments;
        if (converged) break;

        // Recompute centroids
        for (let c = 0; c < k; c++) {
            const members = vectors.filter((_, i) => assignments[i] === c);
            if (members.length > 0) {
                for (let d = 0; d < dims; d++) {
                    centroids[c][d] = members.reduce((s, m) => s + m[d], 0) / members.length;
                }
            }
        }
    }
    return { centroids, assignments };
}

/** Balanced assignment: respects max cluster size so teams stay even. */
function balancedAssign(vectors: number[][], centroids: number[][], maxPerCluster: number): number[] {
    const n = vectors.length;
    const k = centroids.length;

    // Build (studentIdx, clusterIdx, distance) triples sorted by distance
    const pairs: { si: number; ci: number; dist: number }[] = [];
    for (let si = 0; si < n; si++) {
        for (let ci = 0; ci < k; ci++) {
            pairs.push({ si, ci, dist: euclideanDistSq(vectors[si], centroids[ci]) });
        }
    }
    pairs.sort((a, b) => a.dist - b.dist);

    const assignments = new Array(n).fill(-1);
    const clusterSizes = new Array(k).fill(0);

    for (const { si, ci } of pairs) {
        if (assignments[si] !== -1) continue;          // student already assigned
        if (clusterSizes[ci] >= maxPerCluster) continue; // cluster full
        assignments[si] = ci;
        clusterSizes[ci]++;
    }
    return assignments;
}

export const resolvers = {
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

        getOneStudent: (_: any, args: any) => prisma.students.findUnique({ where: { sid: parseInt(args.sid, 10) } }),
        getOneProfessor: (_: any, args: any) => prisma.professors.findUnique({ where: { pid: parseInt(args.pid, 10) } }),
        getOneAdmin: (_: any, args: any) => prisma.admins.findUnique({ where: { aid: parseInt(args.aid, 10) } }),
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
        addAdmin: (_: any, { input }: any) => {
            return prisma.admins.create({
                data: {
                    aname: input.aname,
                    aemail: input.aemail,
                    apass: input.apass
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
        },
        loginAdmin: async (_: any, { input }: any) => {
            const admin = await prisma.admins.findUnique({
                where: { aemail: input.aemail }
            });

            if (!admin) return {
                success: false,
                message: "Email not found",
                aid: null
            };

            const validPass = await bcrypt.compare(input.apass, admin.apass);
            if (!validPass) return {
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
        formGroups: async (_: any, { input }: any) => {
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

                // Get enrolled students
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

                // Get all skill dimensions to build feature vectors
                const allSkills = await prisma.skillset.findMany();
                const skillIds = allSkills.map(s => s.skid).sort((a, b) => a - b);

                // Build a skill-level vector for every student
                const studentData: { sid: number; vector: number[] }[] = [];
                for (const es of enrolledStudents) {
                    const skills = await prisma.studentskills.findMany({
                        where: { sid: es.sid }
                    });
                    const vector = skillIds.map(skid => {
                        const found = skills.find(s => s.skid === skid);
                        return found?.levels ?? 0;
                    });
                    studentData.push({ sid: es.sid, vector });
                }

                // Determine cluster assignments
                let assignments: number[];
                if (numberOfTeams <= 1 || skillIds.length === 0) {
                    // Trivial case — single team or no skills defined
                    assignments = new Array(totalStudents).fill(0);
                } else {
                    // Run k-means then balance team sizes
                    const vectors = studentData.map(s => s.vector);
                    const { centroids } = runKMeans(vectors, numberOfTeams);
                    const maxPerCluster = Math.ceil(totalStudents / numberOfTeams);
                    assignments = balancedAssign(vectors, centroids, maxPerCluster);
                }

                // Create team rows
                const teamsID: number[] = [];
                for (let i = 0; i < numberOfTeams; i++) {
                    const team = await prisma.teams.create({
                        data: {
                            cid: parseInt(input.cid),
                            tname: `Team ${i + 1}`
                        }
                    });
                    teamsID.push(team.tid);
                }

                // Assign students to teams based on k-means clusters
                const teamMembers: { tid: number; sid: number }[] = [];
                studentData.forEach((s, idx) => {
                    const teamId = teamsID[assignments[idx]];
                    if (teamId !== undefined) {
                        teamMembers.push({ tid: teamId, sid: s.sid });
                    }
                });
                await prisma.teampeople.createMany({ data: teamMembers });

                return {
                    success: true,
                    message: `Successfully created ${numberOfTeams} teams with ${totalStudents} students using k-means clustering`,
                    teamsCreated: numberOfTeams
                };

            } catch (error: any) {
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
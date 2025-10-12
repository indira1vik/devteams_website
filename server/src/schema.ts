import { gql } from 'apollo-server';

export const typeDefs = gql`
    # EACH CLASS
    type Student {
        sid: ID!
        sname: String!
        gender: String!
        semail: String!
        spass: String!
        enrolled: [Enroll!]
        studentskills: [StudentSkill!]!
        teampeople: [TeamPerson!]!
    }
    type Professor {
        pid: ID!
        pname: String!
        pemail: String!
        ppass: String!
        courses: [Course!]
    }
    type Course {
        cid: ID!
        ctitle: String!
        professor: Professor!
        enrolled: [Enroll!]
        teams: [Team!]!
    }
    type Enroll {
        eid: ID!
        student: Student!
        course: Course!
    }
    type SkillSet {
        skid: ID!
        skname: String!
        studentskills: [StudentSkill!]!
    }
    type StudentSkill {
        ssid: ID!
        sid: ID!
        levels: Int!
        skillset: SkillSet!
    }
    type Team {
        tid: ID!
        course: Course!
        teampeople: [TeamPerson!]!
    }
    type TeamPerson {
        tpid: ID!
        student: Student!
        team: Team!
    }

    type StudentAuthResponse {
        success: Boolean!
        message: String!
        sid: ID
    }
    type ProfessorAuthResponse {
        success: Boolean!
        message: String!
        pid: ID
    }

    # INPUT TYPES
    input StudentInput {
        sname: String!
        gender: String!
        semail: String!
        spass: String!
    }
    input ProfessorInput {
        pname: String!
        pemail: String!
        ppass: String!
    }
    input CourseInput {
        ctitle: String!
        pid: ID!
    }
    input EnrollInput {
        sid: ID!
        cid: ID!
    }
    input StudentSkillInput {
        sid: ID!
        skid: ID!
        levels: Int!
    }
    input TeamInput {
        cid: ID!
    }
    input TeamPeopleInput {
        tid: ID!
        sid: ID!
    }
    input updateSkillInput {
        sid: ID!
        skid: ID!
        levels: Int!
    }
    input StudentLogin {
        semail: String!
        spass: String!
    }
    input ProfessorLogin {
        pemail: String!
        ppass: String!
    }


    # QUERY & MUTATION
    type Query {
        getAllStudents: [Student!]!
        getAllProfessors: [Professor!]!
        getAllCourses: [Course!]!
        getAllEnrolled: [Enroll!]!
        getAllSkillSets: [SkillSet!]!
        getAllStudentSkills: [StudentSkill!]!
        getAllTeams: [Team!]!
        getAllTeamPeople: [TeamPerson!]!

        getOneStudent(sid: ID!): Student
        getOneProfessor(pid: ID!): Professor
        getOneCourse(cid: ID!): Course
        getOneEnrolled(eid: ID!): Enroll
        getOneSkillSet(skid: ID!): SkillSet
        getOneStudentSkills(sid: ID!): [StudentSkill!]!
        getOneTeam(tid: ID!): Team!
        getOneTeamPeople(tpid: ID!): TeamPerson!
    }
    type Mutation {
        addStudent(input: StudentInput!): Student!
        addProfessor(input: ProfessorInput!): Professor!
        addCourse(input: CourseInput!): Course!
        enrollStudent(input: EnrollInput): Enroll!
        addOneTeam(input: TeamInput): Team!
        addTeamPeople(input: TeamPeopleInput): TeamPerson!

        updateStudentSkill(input: updateSkillInput): StudentSkill!

        loginStudent(input: StudentLogin!): StudentAuthResponse
        loginProfessor(input: ProfessorLogin): ProfessorAuthResponse
    }
`;
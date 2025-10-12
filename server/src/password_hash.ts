import { PrismaClient } from "../generated/prisma";
import * as bcrypt from "bcryptjs";

// RUN THIS FILE ONLY ONCE

const prisma = new PrismaClient();

async function main() {
    const students = await prisma.students.findMany();
    for (const one of students) {
        if (!one.spass.startsWith("$2")) {
            const hashedVal = await bcrypt.hash(one.spass, 10);
            await prisma.students.update({
                where: {sid: one.sid},
                data: {spass: hashedVal}
            });
            console.log("Updated Passwords");
        }
    }

    const professors = await prisma.professors.findMany();
    for (const one of professors) {
        if (!one.ppass.startsWith("$2")) {
            const hashedVal = await bcrypt.hash(one.ppass, 10);
            await prisma.professors.update({
                where: {pid: one.pid},
                data: {ppass: hashedVal}
            })
        }
    }
}

main().finally(() => prisma.$disconnect());
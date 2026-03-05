import { DEPARTMENTS } from "./index";

export interface Subject {
    id: string;
    code: string;
    name: string;
    department: string;
    description: string;
}

export const mockSubjects: Subject[] = [
    {
        id: "1",
        code: "CS101",
        name: "Introduction to Computer Science",
        department: DEPARTMENTS[0], // CS
        description: "Fundamental concepts of programming and computational thinking using Python."
    },
    {
        id: "2",
        code: "MATH201",
        name: "Linear Algebra",
        department: DEPARTMENTS[1], // Math
        description: "Study of vectors, matrices, systems of linear equations, and vector spaces."
    },
    {
        id: "3",
        code: "PHY101",
        name: "General Physics I",
        department: DEPARTMENTS[3], // Physics
        description: "Introduction to classical mechanics, including motion, force, energy, and momentum."
    }
];

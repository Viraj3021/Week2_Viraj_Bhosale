import { Student } from "./types";

export function filterPassedStudents(students: Student[]): Student[] {
  return students.filter((student) => student.grade >= 50);
}

export function getStudentNames(students: Student[]): string[] {
  return students.map((student) => student.name);
}

export function sortStudentsByGrade(students: Student[]): Student[] {
  return students.slice().sort((a, b) => a.grade - b.grade);
}

export function getAverageAge(students: Student[]): number {
  const totalAge = students.reduce((acc, student) => acc + student.age, 0);
  return totalAge / students.length;
}
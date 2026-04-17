export interface Professor {
  id: string;
  name: string;
  imageUrl?: string;
}

// 교수님 목록 (임시 데이터)
export const PROFESSORS: Professor[] = [
  { id: 'prof-1', name: '교수님 A' },
  { id: 'prof-2', name: '교수님 B' },
  { id: 'prof-3', name: '교수님 C' },
];

// 교수님 ID로 찾기
export const getProfessorById = (id: string): Professor | undefined => {
  return PROFESSORS.find(prof => prof.id === id);
};

// 교수님 이름으로 찾기
export const getProfessorByName = (name: string): Professor | undefined => {
  return PROFESSORS.find(prof => prof.name === name);
};
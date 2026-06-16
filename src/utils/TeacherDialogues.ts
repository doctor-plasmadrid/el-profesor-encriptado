import type { TFunction } from 'i18next';

type GenderType = 'M' | 'F' | 'NB';

export const getTeacherDialogue = (
  t: TFunction,
  index: number,
  gen: GenderType,
  playerName: string,
  studentId: string,
  encryptedGrade: string,
  baremo: string
): string => {
  return t(`dialogues.t${index}`, {
    context: gen,
    playerName,
    studentId,
    encryptedGrade,
    baremo
  });
};
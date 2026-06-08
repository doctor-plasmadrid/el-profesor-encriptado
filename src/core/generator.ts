import type { BaseSymbol, ExponentSymbol, HiddenValues, Student, StudentProfile } from '../types/game';
import { createSeededRNG, seededShuffle, generateRandomSeed } from '../utils/rng';

const BASES: BaseSymbol[] = ['F', 'R', 'O', 'Y', 'S'];
const EXPONENTS: ExponentSymbol[] = ['?', '|', '·', ':', 'none'];

export function generateGameData(seedInput?: string): { hiddenValues: HiddenValues, students: Student[], seed: string } {
  const seed = seedInput ? seedInput.toUpperCase() : generateRandomSeed();
  const rng = createSeededRNG(seed);
  
  let valid = false;
  let hiddenValues: HiddenValues;
  let combinations: { base: BaseSymbol, exp: ExponentSymbol, grade: number }[] = [];

  let safetyCounter = 0; 
  const currentRng = rng;

  while (!valid && safetyCounter < 1000) {
    safetyCounter++;
    
    const highBasesPool = seededShuffle([5, 6, 7, 8, 9, 10], currentRng).slice(0, 4);
    const lowBasesPool = seededShuffle([0, 1, 2, 3, 4], currentRng).slice(0, 1);
    const allBases = seededShuffle([...highBasesPool, ...lowBasesPool], currentRng);
    
    const basesMap: Record<BaseSymbol, number> = {
      F: allBases[0], R: allBases[1], O: allBases[2], Y: allBases[3], S: allBases[4]
    };

    const possibleExps = [];
    for (let i = -15; i <= 15; i++) {
      if (i !== 0) possibleExps.push(i / 10);
    }
    const chosenExps = seededShuffle(possibleExps, currentRng).slice(0, 4);
    
    const expsMap: Record<ExponentSymbol, number> = {
      '?': chosenExps[0], '|': chosenExps[1], '·': chosenExps[2], ':': chosenExps[3], 'none': 0
    };

    combinations = [];
    const gradeSet = new Set<number>();
    let allUnique = true;

    for (const b of BASES) {
      for (const e of EXPONENTS) {
        const grade = Math.round((basesMap[b] + expsMap[e]) * 10) / 10; 
        if (gradeSet.has(grade)) {
          allUnique = false;
          break;
        }
        gradeSet.add(grade);
        combinations.push({ base: b, exp: e, grade });
      }
      if (!allUnique) break;
    }

    if (!allUnique) continue;

    const validNerds = combinations.filter(c => c.grade >= 7.0);
    const validBullies = combinations.filter(c => c.grade <= 6.0);

    if (validNerds.length >= 3 && validBullies.length >= 7) {
      hiddenValues = { bases: basesMap, exponents: expsMap };
      valid = true;
    }
  }

  const nerds = combinations.filter(c => c.grade >= 7.0);
  const bullies = combinations.filter(c => c.grade <= 6.0);
  
  const selectedNerds = seededShuffle(nerds, currentRng).slice(0, 3);
  const selectedBullies = seededShuffle(bullies, currentRng).slice(0, 7);
  
  const assignedSet = new Set([...selectedNerds, ...selectedBullies]);
  const selectedAverages = combinations.filter(c => !assignedSet.has(c));

  const finalStudents: Student[] = [];
  let idCounter = 1;

  const addStudents = (list: typeof combinations, profile: StudentProfile) => {
    list.forEach(c => {
      finalStudents.push({
        id: `Alumno ${idCounter++}`, base: c.base, exponent: c.exp, profile, actualGrade: c.grade, isPassed: c.grade >= 5.0, clueRevealed: null, isFullyDeduced: false
      });
    });
  };

  addStudents(selectedNerds, 'nerd');
  addStudents(selectedBullies, 'bully');
  addStudents(selectedAverages, 'average');

  return { hiddenValues: hiddenValues!, students: seededShuffle(finalStudents, currentRng), seed };
}
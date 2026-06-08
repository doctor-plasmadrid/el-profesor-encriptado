export type BaseSymbol = 'F' | 'R' | 'O' | 'Y' | 'S';
export type ExponentSymbol = '?' | '|' | '·' | ':' | 'none';
export type StudentProfile = 'nerd' | 'average' | 'bully';
export type Month = 'Junio' | 'Julio' | 'Agosto' | 'Septiembre';

export interface HiddenValues {
  bases: Record<BaseSymbol, number>;
  exponents: Record<ExponentSymbol, number>;
}

export interface Student {
  id: string;
  base: BaseSymbol;
  exponent: ExponentSymbol;
  profile: StudentProfile;
  actualGrade: number;
  isPassed: boolean;
  clueRevealed: string | null;
  isFullyDeduced: boolean;
}

export interface GameState {
  month: Month;
  socialBattery: number;
  turnsRemaining: number; 
  students: Student[];
  totalFails: number;
  playerGuesses: {
    bases: Partial<Record<BaseSymbol, number>>;
    exponents: Partial<Record<ExponentSymbol, number>>;
  };
}
import { useState, Fragment, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import type { BaseSymbol, ExponentSymbol, Student, Month } from "../../types/game";
import { generateGameData } from "../../core/generator";
import { getTeacherDialogue } from "../../utils/TeacherDialogues";
import { playSFX, playBGM, stopBGM } from "../../utils/audio";

const shakeAnim = keyframes`
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
`;

const GameContainer = styled.div<{ $isFrozen?: boolean }>`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #1a1a1a; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px; box-sizing: border-box; color: white; overflow: hidden;
  ${(props) => props.$isFrozen && css`
    animation: ${shakeAnim} 0.4s infinite;
    pointer-events: none;
  `}
`;

const TopBar = styled.div`
  width: 100%; max-width: 850px; display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: clamp(5px, 2vh, 20px); border-bottom: 4px dashed #4af626; padding-bottom: clamp(5px, 1vh, 10px);
`;
const MonthTitle = styled.h2`
  font-family: 'DotGothic16', sans-serif; color: #4af626; font-size: clamp(30px, 5vh, 45px); margin: 0; text-shadow: 3px 3px 0px black; text-transform: uppercase; line-height: 1;
`;
const ScoreBoard = styled.div`
  font-family: 'Silkscreen', sans-serif; color: #fff; font-size: clamp(20px, 3vh, 28px); text-shadow: 2px 2px 0px #e74c3c; letter-spacing: 2px; display: flex; align-items: center; gap: 10px;
`;
const PointsLabel = styled.span`
  color: #f1c40f; font-size: clamp(10px, 1.5vh, 14px); text-shadow: none; letter-spacing: 0;
`;
const SeedDisplay = styled.div`
  font-family: 'DotGothic16', sans-serif; color: #bdc3c7; font-size: clamp(12px, 1.8vh, 16px); text-align: left; margin-top: 5px;
`;
const StatusInfo = styled.div`
  font-family: 'Silkscreen', sans-serif; color: #f1c40f; font-size: clamp(10px, 1.5vh, 14px); text-align: right; display: flex; flex-direction: column; gap: clamp(2px, 0.5vh, 5px);
  .prof-name { color: white; font-size: clamp(14px, 2vh, 18px); margin-bottom: 2px; }
  .danger { color: #e74c3c; }
`;
const BoardGrid = styled.div<{ $interactionMode: 'none' | 'student' | 'teacher' }>`
  display: grid; grid-template-columns: clamp(60px, 8vw, 80px) repeat(5, minmax(50px, 1fr)); gap: clamp(4px, 1vh, 8px); width: 100%; max-width: 850px; background: rgba(0, 0, 0, 0.4); padding: clamp(8px, 1.5vh, 15px); 
  border: 4px solid ${(props) => props.$interactionMode === 'student' ? '#f39c12' : props.$interactionMode === 'teacher' ? '#3498db' : '#34495e'}; 
  box-shadow: 6px 6px 0px black; transition: border-color 0.3s;
`;
const CornerCell = styled.div``;
const HeaderCell = styled.div<{ $locked: boolean }>`
  display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vh, 8px); opacity: ${(props) => (props.$locked ? 0.3 : 1)}; transition: opacity 0.2s;
`;
const SymbolText = styled.span`
  font-family: 'DotGothic16', sans-serif; font-size: clamp(20px, 3.5vh, 32px); color: #bdc3c7; text-shadow: 2px 2px 0px black;
`;
const GuessWidget = styled.div<{ $discovered?: boolean }>`
  display: flex; align-items: center; background: #2c3e50; border: 2px solid ${(props) => props.$discovered ? '#4af626' : 'white'}; box-shadow: inset 2px 2px 0px rgba(0,0,0,0.8); overflow: hidden;
`;
const ValueDisplay = styled.div<{ $discovered?: boolean }>`
  width: ${(props) => props.$discovered ? 'clamp(50px, 6vw, 74px)' : 'clamp(35px, 4vw, 50px)'}; text-align: center; font-family: 'Silkscreen', sans-serif; font-size: clamp(10px, 1.5vh, 14px); color: ${(props) => props.$discovered ? '#4af626' : '#f1c40f'};
`;
const ControlsColumn = styled.div`
  display: flex; flex-direction: column; border-left: 2px solid white;
`;
const ArrowBtn = styled.button`
  background: #34495e; border: none; color: white; font-size: 8px; padding: 2px 4px; cursor: pointer; border-bottom: 1px solid white;
  &:last-child { border-bottom: none; }
  &:hover:not(:disabled) { background: #4af626; color: black; }
  &:disabled { cursor: not-allowed; opacity: 0.5; }
`;
const StudentCell = styled.button<{ $passed?: boolean, $interactionMode: 'none' | 'student' | 'teacher' }>`
  background: #8e44ad; 
  border: 3px solid ${(props) => props.$interactionMode === 'student' ? '#f39c12' : props.$interactionMode === 'teacher' ? '#3498db' : (props.$passed ? '#2ecc71' : 'white')}; 
  color: white; font-family: 'DotGothic16', sans-serif; font-size: clamp(16px, 2.5vh, 22px); padding: clamp(4px, 1vh, 10px) 2px; cursor: pointer; box-shadow: 4px 4px 0px black; transition: transform 0.1s, filter 0.2s, border-color 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center;
  &:hover { filter: brightness(1.2); }
  &:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px black; }
  .grade-reveal { color: ${(props) => props.$passed ? '#2ecc71' : '#e74c3c'}; font-family: 'Silkscreen', sans-serif; font-size: clamp(10px, 1.5vh, 14px); margin-top: clamp(2px, 0.5vh, 8px); text-shadow: 1px 1px 0px black; }
`;
const ActionRow = styled.div`
  display: flex; gap: clamp(10px, 2vw, 20px); margin-top: clamp(10px, 2.5vh, 30px); flex-wrap: wrap; justify-content: center;
`;
const RetroButton = styled.button<{ $variant?: 'danger' | 'success' | 'info' | 'warning', $active?: boolean }>`
  background: ${(props) => props.$variant === 'danger' ? '#e74c3c' : props.$variant === 'success' ? '#2ecc71' : props.$variant === 'warning' ? '#f39c12' : '#3498db'}; color: ${(props) => props.$active ? 'black' : 'white'}; border: 3px solid white; padding: clamp(10px, 1.5vh, 15px) clamp(15px, 2vw, 25px); font-family: 'Silkscreen', sans-serif; font-size: clamp(12px, 2vh, 16px); cursor: pointer; box-shadow: ${(props) => props.$active ? 'inset 3px 3px 0px rgba(0,0,0,0.5)' : '3px 3px 0px black'}; text-transform: uppercase; filter: ${(props) => props.$active ? 'brightness(1.2)' : 'none'};
  &:hover { filter: brightness(1.2); }
  &:active { transform: translate(3px, 3px); box-shadow: 0px 0px 0px black; }
`;

const Overlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.85); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100; backdrop-filter: blur(5px);
`;
const ModalContainer = styled.div`
  background: #2c3e50; border: 4px solid white; padding: 30px; color: white; box-shadow: 8px 8px 0px black; width: 90%; max-width: 500px; display: flex; flex-direction: column; gap: 20px;
`;
const EndScreenContainer = styled(ModalContainer)`
  margin-top: 10vh; text-align: center; max-width: 600px; position: relative; z-index: 1; display: flex;
`;
const ModalButtonRow = styled.div`
  display: flex; gap: 15px; margin-top: 10px;
`;

const BASES: BaseSymbol[] = ['F', 'R', 'O', 'Y', 'S'];
const EXPONENTS: ExponentSymbol[] = ['?', '|', '·', ':', 'none'];

const getBracket = (grade: number) => {
  if (grade <= 4.9) return "Suspenso";
  if (grade <= 6.9) return "Aprobado";
  if (grade <= 8.9) return "Notable";
  if (grade <= 10.0) return "Sobresaliente";
  return "Matrícula";
};

type GenderType = 'M' | 'F' | 'NB';

const getRandomIndex = (max: number) => Math.floor(Math.random() * max);
const getRandomChance = () => Math.random();

export default function GameBoard() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoadSave = location.state?.loadSave;
  const inputSeed = location.state?.seed;

  const [playerName] = useState(() => localStorage.getItem("profesorName") || "Novato");
  const [playerGender] = useState<GenderType>(() => (localStorage.getItem("profesorGender") as GenderType) || "M");

  const [gameState, setGameState] = useState(() => {
    if (isLoadSave) {
      const saved = localStorage.getItem("profesor_saveGame");
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.discoveredBases = new Set(parsed.discoveredBases);
        parsed.discoveredExps = new Set(parsed.discoveredExps);
        parsed.revealedPassedIds = new Set(parsed.revealedPassedIds);
        return parsed;
      }
    }

    const data = generateGameData(inputSeed);
    return {
      hiddenData: data,
      gameStatus: 'playing' as 'playing' | 'victory' | 'gameover',
      month: 'Junio' as Month,
      turnsRemaining: 20,
      socialBattery: 100,
      score: 0,
      discoveredBases: new Set<BaseSymbol>(),
      discoveredExps: new Set<ExponentSymbol>(['none']),
      revealedPassedIds: new Set<string>(),
      studentClues: {} as Record<string, string>,
      teacherClues: {} as Record<string, string>,
      availableTeacherDialogues: Array.from({length: 20}, (_, i) => i),
      seed: data.seed
    };
  });

  const {
    hiddenData, gameStatus, month, turnsRemaining, socialBattery, score,
    discoveredBases, discoveredExps, revealedPassedIds,
    studentClues, teacherClues, availableTeacherDialogues, seed
  } = gameState;

  const updateGame = (updates: Partial<typeof gameState>) => {
    setGameState((prev: typeof gameState) => ({ ...prev, ...updates }));
  };

  const totalFailed = hiddenData.students.filter((s: Student) => !s.isPassed).length;
  const totalPassed = hiddenData.students.filter((s: Student) => s.isPassed).length;

  const [activeSymbol, setActiveSymbol] = useState<string | null>(null);
  const [initialActiveValue, setInitialActiveValue] = useState<number | null>(null);
  const [baseGuesses, setBaseGuesses] = useState<Record<BaseSymbol, number | null>>({ F: null, R: null, O: null, Y: null, S: null });
  const [expGuesses, setExpGuesses] = useState<Record<ExponentSymbol, number | null>>({ '?': null, '|': null, '·': null, ':': null, 'none': null });
  
  const [interactionMode, setInteractionMode] = useState<'none' | 'student' | 'teacher'>('none');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalMode, setModalMode] = useState<'stats' | 'student_dialogue' | 'teacher_dialogue' | null>(null);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [isScreenFrozen, setIsScreenFrozen] = useState(false);

  useEffect(() => {
    playBGM('theme');
    return () => stopBGM();
  }, []);

  const saveAndExit = () => {
    playSFX('button');
    const saveData = {
      ...gameState,
      discoveredBases: Array.from(gameState.discoveredBases),
      discoveredExps: Array.from(gameState.discoveredExps),
      revealedPassedIds: Array.from(gameState.revealedPassedIds)
    };
    localStorage.setItem("profesor_saveGame", JSON.stringify(saveData));
    navigate("/main-menu");
  };

  const exitWithoutSaving = () => {
    playSFX('back');
    navigate("/main-menu");
  };

  const toggleInteractionMode = (mode: 'student' | 'teacher') => {
    playSFX('button');
    setInteractionMode(prev => prev === mode ? 'none' : mode);
  };

  const handleBaseChange = (base: BaseSymbol, delta: number) => {
    if (activeSymbol && activeSymbol !== base) return;
    playSFX('button');
    setBaseGuesses(prev => {
      const current = prev[base];
      const nextValue: number | null = current === null ? (delta > 0 ? 0 : null) : (current === 0 && delta < 0 ? null : Math.min(current + delta, 10));
      const isActivating = !activeSymbol;
      const initialVal = isActivating ? current : initialActiveValue;
      if (nextValue === initialVal) { setActiveSymbol(null); setInitialActiveValue(null); }
      else if (isActivating) { setActiveSymbol(base); setInitialActiveValue(current); }
      return { ...prev, [base]: nextValue };
    });
  };

  const handleExpChange = (exp: ExponentSymbol, delta: number) => {
    if (exp === 'none' || (activeSymbol && activeSymbol !== exp)) return;
    playSFX('button');
    setExpGuesses(prev => {
      const current = prev[exp];
      let nextValue: number | null;
      if (current === null) nextValue = delta > 0 ? 0.1 : -0.1;
      else if (current === 0.1 && delta < 0) nextValue = null;
      else if (current === -0.1 && delta > 0) nextValue = null;
      else {
        nextValue = Math.round((current + delta * 0.1) * 10) / 10;
        if (nextValue > 1.5) nextValue = 1.5;
        if (nextValue < -1.5) nextValue = -1.5;
      }
      const isActivating = !activeSymbol;
      const initialVal = isActivating ? current : initialActiveValue;
      if (nextValue === initialVal) { setActiveSymbol(null); setInitialActiveValue(null); }
      else if (isActivating) { setActiveSymbol(exp); setInitialActiveValue(current); }
      return { ...prev, [exp]: nextValue };
    });
  };

  const confirmDeduction = () => {
    if (!activeSymbol) return;
    const newBases = new Set(discoveredBases);
    const newExps = new Set(discoveredExps);
    let isCorrect = false;

    if (BASES.includes(activeSymbol as BaseSymbol) && baseGuesses[activeSymbol as BaseSymbol] === hiddenData.hiddenValues.bases[activeSymbol as BaseSymbol]) {
      newBases.add(activeSymbol as BaseSymbol);
      isCorrect = true;
    } else if (EXPONENTS.includes(activeSymbol as ExponentSymbol) && expGuesses[activeSymbol as ExponentSymbol] === hiddenData.hiddenValues.exponents[activeSymbol as ExponentSymbol]) {
      newExps.add(activeSymbol as ExponentSymbol);
      isCorrect = true;
    }

    if (isCorrect) playSFX('start'); else playSFX('error');

    let nextScore = score;
    const newRevealedIds = new Set(revealedPassedIds);

    hiddenData.students.forEach((student: Student) => {
      if (student.isPassed && !newRevealedIds.has(student.id) && newBases.has(student.base) && newExps.has(student.exponent)) {
        newRevealedIds.add(student.id);
        nextScore += 1000 + (turnsRemaining * 50);
      }
    });

    if (BASES.includes(activeSymbol as BaseSymbol)) {
      setBaseGuesses(prev => ({ ...prev, [activeSymbol as BaseSymbol]: null }));
    } else if (EXPONENTS.includes(activeSymbol as ExponentSymbol)) {
      setExpGuesses(prev => ({ ...prev, [activeSymbol as ExponentSymbol]: null }));
    }

    setActiveSymbol(null);
    setInitialActiveValue(null);

    let nextGameStatus = gameStatus;
    let nextTurns = turnsRemaining - 1;
    let nextBattery = socialBattery;
    let nextMonth = month;

    if (newRevealedIds.size >= totalPassed) {
      nextGameStatus = 'victory';
    } else if (nextTurns <= 0) {
      nextScore += Math.max(0, nextBattery) * 10;
      if (month === 'Junio') {
        nextMonth = 'Julio'; nextTurns = 10; nextBattery = 100; setInteractionMode('none');
      } else if (month === 'Julio') {
        nextMonth = 'Agosto'; nextTurns = 5; nextBattery = 100; setInteractionMode('none');
      } else {
        nextMonth = 'Septiembre'; nextGameStatus = 'gameover';
      }
    }

    updateGame({
      discoveredBases: newBases,
      discoveredExps: newExps,
      revealedPassedIds: newRevealedIds,
      score: nextScore,
      gameStatus: nextGameStatus,
      turnsRemaining: nextTurns,
      socialBattery: nextBattery,
      month: nextMonth
    });
  };

  const handleStudentClick = (student: Student) => {
    playSFX('button');
    setSelectedStudent(student);
    
    if (interactionMode === 'none') {
      setModalMode('stats');
      return;
    }

    let cost = 0;
    let nextScore = score;
    const nextRevealedPassedIds = new Set(revealedPassedIds);
    const newStudentClues = { ...studentClues };
    const newTeacherClues = { ...teacherClues };
    const newAvailableDialogues = [...availableTeacherDialogues];
    let triggerEasterEgg = false;

    if (interactionMode === 'student') {
      if (studentClues[student.id]) {
        setModalMode('student_dialogue');
        return;
      }
      
      cost = 5;
      if (socialBattery < cost) return;
      
      let clue: string;
      const isSixSevenEnabled = localStorage.getItem("sixSevenEnabled") !== "false";

      if (Math.round(student.actualGrade * 10) / 10 === 6.7 && isSixSevenEnabled && getRandomChance() < 0.67) {
          localStorage.setItem("sixSevenDiscovered", "true");
          clue = "¡Six Seven!";
          triggerEasterEgg = true;
          
          if (!nextRevealedPassedIds.has(student.id)) {
              nextRevealedPassedIds.add(student.id);
              nextScore += 1000 + (turnsRemaining * 50); 
          }
      } else {
          if (student.profile === 'nerd') {
            clue = student.actualGrade.toFixed(1).replace('.', ',');
            if (student.isPassed && !nextRevealedPassedIds.has(student.id)) {
              nextRevealedPassedIds.add(student.id);
              nextScore += 1000 + (turnsRemaining * 50);
            }
          } else if (student.profile === 'average') {
            clue = getBracket(student.actualGrade);
          } else {
            clue = "silencio";
          }
      }
      newStudentClues[student.id] = clue;
      setModalMode('student_dialogue');
    }

    if (interactionMode === 'teacher') {
      if (teacherClues[student.id]) {
        setModalMode('teacher_dialogue');
        return;
      }
      
      cost = 10;
      if (socialBattery < cost) return;
      
      const randomIndex = getRandomIndex(newAvailableDialogues.length);
      const dialogueIndex = newAvailableDialogues[randomIndex];
      newAvailableDialogues.splice(randomIndex, 1);

      const encryptedStr = student.exponent === 'none' ? student.base : `${student.base}^${student.exponent}`;
      const dialogue = getTeacherDialogue(dialogueIndex, playerGender, playerName, student.id, encryptedStr, getBracket(student.actualGrade));
      
      newTeacherClues[student.id] = dialogue;
      setModalMode('teacher_dialogue');
    }

    let nextGameStatus = gameStatus;
    let nextTurns = turnsRemaining - 1;
    let nextBattery = socialBattery - cost;
    let nextMonth = month;

    if (nextTurns <= 0 || nextBattery <= 0) {
      nextScore += Math.max(0, nextBattery) * 10;
      if (month === 'Junio') {
        nextMonth = 'Julio'; nextTurns = 10; nextBattery = 100; setInteractionMode('none');
      } else if (month === 'Julio') {
        nextMonth = 'Agosto'; nextTurns = 5; nextBattery = 100; setInteractionMode('none');
      } else {
        nextMonth = 'Septiembre'; nextGameStatus = 'gameover';
      }
    }

    updateGame({
      studentClues: newStudentClues,
      teacherClues: newTeacherClues,
      availableTeacherDialogues: newAvailableDialogues,
      revealedPassedIds: nextRevealedPassedIds,
      score: nextScore,
      gameStatus: nextGameStatus,
      turnsRemaining: nextTurns,
      socialBattery: nextBattery,
      month: nextMonth
    });

    if (triggerEasterEgg) {
        setIsScreenFrozen(true);
        playSFX('sixseven');
        setTimeout(() => setIsScreenFrozen(false), 6000);
    }
  };

  const formatBase = (val: number | null) => val === null ? "???" : val.toString();
  const formatExp = (val: number | null) => val === null ? "±?,?" : (val > 0 ? `+${val.toFixed(1).replace('.', ',')}` : val.toFixed(1).replace('.', ','));

  const isGradeKnown = (student: Student) => {
    return (discoveredBases.has(student.base) && discoveredExps.has(student.exponent)) || 
           (studentClues[student.id]?.includes(',')) ||
           (studentClues[student.id] === '¡Six Seven!');
  };

  const getDecryptedGradeDisplay = (student: Student) => {
    return isGradeKnown(student) ? student.actualGrade.toFixed(1).replace('.', ',') : "???";
  };

  const getKnownBracket = (student: Student) => {
    if (isGradeKnown(student)) return getBracket(student.actualGrade);
    if (teacherClues[student.id]) return getBracket(student.actualGrade);
    const studentClue = studentClues[student.id];
    if (studentClue && !studentClue.includes(',') && studentClue !== 'silencio' && studentClue !== '¡Six Seven!') return studentClue;
    return '???';
  };

  if (gameStatus !== 'playing') {
    return (
      <GameContainer>
        <EndScreenContainer>
          <MonthTitle style={{ color: gameStatus === 'victory' ? '#f1c40f' : '#e74c3c', fontSize: '60px' }}>
            {gameStatus === 'victory' ? '¡MISTERIO RESUELTO!' : 'LLEGÓ SEPTIEMBRE...'}
          </MonthTitle>
          <h3 style={{ fontFamily: "'Silkscreen', sans-serif", color: 'white', marginTop: '30px' }}>PUNTUACIÓN FINAL</h3>
          <ScoreBoard style={{ fontSize: '50px', marginBottom: '30px', justifyContent: 'center' }}>
            {score.toString().padStart(6, '0')}
          </ScoreBoard>
          <p style={{ fontFamily: "'DotGothic16', sans-serif", fontSize: '24px', color: '#bdc3c7' }}>
            Aprobados descubiertos: <span style={{ color: '#2ecc71' }}>{revealedPassedIds.size} / {totalPassed}</span>
            <br />
            <span style={{ fontSize: '18px', color: '#7f8c8d' }}>Semilla: {seed}</span>
          </p>
          <RetroButton $variant="info" style={{ marginTop: '40px' }} onClick={() => { playSFX('button'); navigate("/main-menu"); }}>VOLVER AL MENÚ</RetroButton>
        </EndScreenContainer>
      </GameContainer>
    );
  }

  return (
    <GameContainer $isFrozen={isScreenFrozen}>
      <TopBar>
        <div>
          <MonthTitle>{month}</MonthTitle>
          <ScoreBoard><PointsLabel>PUNTOS</PointsLabel>{score.toString().padStart(6, '0')}</ScoreBoard>
          <SeedDisplay>Semilla: {seed}</SeedDisplay>
        </div>
        <StatusInfo>
          <span className="prof-name">Profe {playerName}</span>
          <span className="danger">⚠ Suspensos Totales: {totalFailed}</span>
          <span>🔋 Batería: {socialBattery}%</span>
          <span>⏳ Turnos: {turnsRemaining}</span>
        </StatusInfo>
      </TopBar>

      <BoardGrid $interactionMode={interactionMode}>
        <CornerCell />
        {EXPONENTS.map((exp, i) => {
          const isDiscovered = discoveredExps.has(exp);
          const isLocked = !isDiscovered && activeSymbol !== null && activeSymbol !== exp;
          return (
            <HeaderCell key={`exp-header-${i}`} $locked={isLocked}>
              <SymbolText>{exp === 'none' ? 'Ø' : exp}</SymbolText>
              {exp !== 'none' && (
                <GuessWidget $discovered={isDiscovered}>
                  {isDiscovered ? (
                    <ValueDisplay $discovered style={{ padding: 'clamp(10px, 1.5vh, 18px) 0' }}>{formatExp(hiddenData.hiddenValues.exponents[exp])}</ValueDisplay>
                  ) : (
                    <>
                      <ValueDisplay>{formatExp(expGuesses[exp])}</ValueDisplay>
                      <ControlsColumn>
                        <ArrowBtn disabled={isLocked} onClick={() => handleExpChange(exp, 1)}>▲</ArrowBtn>
                        <ArrowBtn disabled={isLocked} onClick={() => handleExpChange(exp, -1)}>▼</ArrowBtn>
                      </ControlsColumn>
                    </>
                  )}
                </GuessWidget>
              )}
            </HeaderCell>
          );
        })}

        {BASES.map((base, rowIdx) => {
          const isDiscovered = discoveredBases.has(base);
          const isLocked = !isDiscovered && activeSymbol !== null && activeSymbol !== base;
          return (
            <Fragment key={`row-${rowIdx}`}>
              <HeaderCell $locked={isLocked} style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <SymbolText>{base}</SymbolText>
                <GuessWidget $discovered={isDiscovered} style={{ flexDirection: 'column' }}>
                  {isDiscovered ? (
                    <ValueDisplay $discovered style={{ padding: 'clamp(10px, 1.5vh, 18px) 0' }}>{formatBase(hiddenData.hiddenValues.bases[base])}</ValueDisplay>
                  ) : (
                    <>
                      <ArrowBtn style={{ width: '100%', borderBottom: '2px solid white' }} disabled={isLocked} onClick={() => handleBaseChange(base, 1)}>▲</ArrowBtn>
                      <ValueDisplay style={{ padding: '5px 0' }}>{formatBase(baseGuesses[base])}</ValueDisplay>
                      <ArrowBtn style={{ width: '100%', borderTop: '2px solid white' }} disabled={isLocked} onClick={() => handleBaseChange(base, -1)}>▼</ArrowBtn>
                    </>
                  )}
                </GuessWidget>
              </HeaderCell>

              {EXPONENTS.map((exp, colIdx) => {
                const student = hiddenData.students.find((s: Student) => s.base === base && s.exponent === exp);
                const isGradeRevealed = isDiscovered && discoveredExps.has(exp);
                return (
                  <StudentCell 
                    key={`student-${rowIdx}-${colIdx}`} 
                    $passed={isGradeRevealed && student?.isPassed}
                    $interactionMode={interactionMode}
                    onClick={() => student && handleStudentClick(student)}
                  >
                    <div>{base}{exp !== 'none' && <sup>{exp}</sup>}</div>
                    {isGradeRevealed && student && (
                      <div className="grade-reveal">{student.actualGrade.toFixed(1).replace('.', ',')}</div>
                    )}
                  </StudentCell>
                );
              })}
            </Fragment>
          );
        })}
      </BoardGrid>

      <ActionRow>
        <RetroButton $variant="danger" onClick={() => { playSFX('button'); setShowPauseModal(true); }}>
          HUIR DEL AULA
        </RetroButton>
        
        {month === 'Junio' && (
          <RetroButton $variant="warning" $active={interactionMode === 'student'} onClick={() => toggleInteractionMode('student')}>
            {interactionMode === 'student' ? "CANCELAR" : "ALUMNO (5🔋)"}
          </RetroButton>
        )}

        {['Junio', 'Julio'].includes(month) && (
          <RetroButton $variant="info" $active={interactionMode === 'teacher'} onClick={() => toggleInteractionMode('teacher')}>
            {interactionMode === 'teacher' ? "CANCELAR" : "PROFESOR (10🔋)"}
          </RetroButton>
        )}

        {activeSymbol && (
          <RetroButton $variant="success" onClick={confirmDeduction}>
            FIJAR DEDUCCIÓN
          </RetroButton>
        )}
      </ActionRow>

      {showPauseModal && (
        <Overlay>
          <ModalContainer>
            <h2 style={{ fontFamily: "'Silkscreen', sans-serif", margin: 0, color: "#e74c3c" }}>PAUSA</h2>
            <ModalButtonRow style={{ flexDirection: 'column' }}>
              <RetroButton style={{ backgroundColor: "#2ecc71" }} onClick={() => { playSFX('button'); setShowPauseModal(false); }}>REANUDAR</RetroButton>
              <RetroButton style={{ backgroundColor: "#3498db" }} onClick={saveAndExit}>GUARDAR Y SALIR</RetroButton>
              <RetroButton style={{ backgroundColor: "#e74c3c" }} onClick={exitWithoutSaving}>SALIR SIN GUARDAR</RetroButton>
            </ModalButtonRow>
          </ModalContainer>
        </Overlay>
      )}

      {selectedStudent && modalMode && (
        <Overlay onClick={() => !isScreenFrozen && setModalMode(null)}>
          <ModalContainer onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Silkscreen', sans-serif", margin: 0, color: modalMode === 'student_dialogue' ? '#f39c12' : modalMode === 'teacher_dialogue' ? '#3498db' : 'white', textTransform: 'uppercase' }}>
              {modalMode === 'stats' ? `Expediente: ${selectedStudent.id}` : modalMode === 'student_dialogue' ? `Diálogo: ${selectedStudent.id}` : `Sala de Profesores`}
            </h2>
            
            {modalMode === 'stats' && (
              <div style={{ fontFamily: "'DotGothic16', sans-serif", fontSize: '20px', lineHeight: '1.6', textAlign: 'left', background: 'rgba(0,0,0,0.5)', padding: '20px', border: '2px dashed #7f8c8d' }}>
                <p><strong>Nota encriptada:</strong> {selectedStudent.base}{selectedStudent.exponent !== 'none' ? <sup>{selectedStudent.exponent}</sup> : ''}</p>
                <p><strong>Nota descifrada:</strong> <span style={{ color: '#4af626' }}>{getDecryptedGradeDisplay(selectedStudent)}</span></p>
                <p><strong>Baremo conocido:</strong> {getKnownBracket(selectedStudent)}</p>
              </div>
            )}

            {modalMode === 'student_dialogue' && (
              <div style={{ fontFamily: "'DotGothic16', sans-serif", fontSize: '22px', fontStyle: 'italic', padding: '20px', background: 'rgba(0,0,0,0.3)', borderLeft: '4px solid #f39c12' }}>
                {studentClues[selectedStudent.id] === 'silencio' ? (
                  <span style={{ color: '#e74c3c' }}>"..." (Te mira mal y se da la vuelta ignorándote).</span>
                ) : studentClues[selectedStudent.id] === '¡Six Seven!' ? (
                  <span style={{ 
                    fontFamily: "'Comic Sans MS', 'Comic Sans', cursive", 
                    fontSize: '40px', 
                    fontWeight: 'bold', 
                    backgroundImage: 'linear-gradient(to right, red, orange, yellow, #4af626, blue, indigo, violet)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'block',
                    textAlign: 'center'
                  }}>
                    "¡SIX SEVEN!"
                  </span>
                ) : studentClues[selectedStudent.id].includes(',') ? (
                  <span>"¿Mi nota, Profe {playerName}? Despejé la ecuación de mi media y saqué exactamente un <strong style={{ color: '#4af626' }}>{studentClues[selectedStudent.id]}</strong>, sin duda."</span>
                ) : (
                  <span>"Pues no estoy seguro de la nota numérica, Profe {playerName}, pero en el boletín mi rendimiento marcaba un <strong style={{ color: '#f1c40f' }}>{studentClues[selectedStudent.id]}</strong>."</span>
                )}
              </div>
            )}

            {modalMode === 'teacher_dialogue' && (
              <div style={{ fontFamily: "'DotGothic16', sans-serif", fontSize: '20px', fontStyle: 'italic', padding: '20px', background: 'rgba(0,0,0,0.3)', borderLeft: '4px solid #3498db' }}>
                {teacherClues[selectedStudent.id]}
              </div>
            )}

            {!isScreenFrozen && (
              <RetroButton $variant="info" style={{ marginTop: '10px' }} onClick={() => { playSFX('button'); setModalMode(null); }}>
                CERRAR
              </RetroButton>
            )}
          </ModalContainer>
        </Overlay>
      )}
    </GameContainer>
  );
}
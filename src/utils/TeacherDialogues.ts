type GenderType = 'M' | 'F' | 'NB';

const g = (gen: GenderType, m: string, f: string, nb: string) => {
  if (gen === 'F') return f;
  if (gen === 'NB') return nb;
  return m;
};

export const getTeacherDialogue = (
  index: number,
  gen: GenderType,
  playerName: string,
  studentId: string,
  encryptedGrade: string,
  baremo: string
): string => {
  const el = g(gen, 'el', 'la', 'le');
  const profe = g(gen, 'profesor', 'profesora', 'profesore');
  const nuevo = g(gen, 'nuevo', 'nueva', 'nueve');
  const encantado = g(gen, 'Encantado', 'Encantada', 'Encantade');
  const bienvenido = g(gen, 'Bienvenido', 'Bienvenida', 'Bienvenide');
  const seguro = g(gen, 'seguro', 'segura', 'segure');
  const listo = g(gen, 'listo', 'lista', 'liste');
  const pobre = g(gen, 'pobre', 'pobre', 'pobre');

  const dialogues = [
    `"Eres ${el} ${profe} ${nuevo}. ¡${encantado} de conocerte! ¡Mucha suerte con el acertijo que te dejó el que se marchó, no me imagino tener que descifrar notas ocultas para redactar el acta! Ese hombre estaba loco... Te puedo ayudar respecto al alumno ${studentId}. Dices que sacó un ${encryptedGrade}... Le he dado clase de historia, y te puedo decir por experiencia que su rendimiento es de ${baremo} en mis clases. Cuando termine tu jornada, ¿te apetece venirte conmigo a tomar un café y vamos hablando?"`,
    
    `"¡Ah, eres tú! ${bienvenido} al departamento. No hagas caso a los rumores, este instituto es bastante tranquilo. ¿Ese apunte de ahí es del alumno ${studentId}? Qué símbolo tan raro ese ${encryptedGrade}... En fin, si te sirve de pista, en mi asignatura siempre se mantiene en el rango de ${baremo}."`,
    
    `"Perdona que vaya con prisas, ¡tengo que imprimir 40 exámenes! ¿Me preguntas por el alumno ${studentId}? Buf, con ese ${encryptedGrade} no sé qué decirte de sus mates, pero en literatura es claramente un chaval de ${baremo}. ¡Nos vemos en el recreo!"`,
    
    `"Hola, colega. Tienes mala cara, ¿llevas mucho rato mirando esas combinaciones? Si te atascas con el alumno ${studentId} y su misterioso ${encryptedGrade}, te aconsejo que lo trates como un alumno de ${baremo}. Rara vez me ha demostrado lo contrario."`,
    
    `"¡${bienvenido}! Qué faena te ha caído con las actas encriptadas, ¿eh? Yo le daba clase de plástica al alumno ${studentId}. No entiendo ese ${encryptedGrade}, pero su nivel general de esfuerzo es de ${baremo}. ¡Ánimo con el puzle!"`,
    
    `"Shhh, baja la voz, que estoy corrigiendo. ¿El alumno ${studentId}? Sí, lo conozco. Me da igual que ahí ponga un ${encryptedGrade}, yo estoy ${seguro} de que su nivel real es de ${baremo}. Ahora déjame terminar esto, por favor."`,
    
    `"Vaya, el anterior profesor de tu plaza tenía unas ideas muy de 'mente maravillosa'. Para el alumno ${studentId}, ignora ese ${encryptedGrade}. Su historial académico grita '${baremo}' por los cuatro costados. Un saludo."`,
    
    `"¡Hola, Profe ${playerName}! Estaba en la máquina de café. ¿Necesitas ayuda con el alumno ${studentId}? Ese ${encryptedGrade} confunde a cualquiera. Si me preguntas a mí, diría que es de ${baremo}. ¡Suerte con el resto!"`,
    
    `"¿Tú eres ${el} ${nuevo}, verdad? Te compadezco, ${pobre} colega. ¿Ese garabato de ${encryptedGrade} es del alumno ${studentId}? Qué dolor de cabeza. En educación física tiene un rendimiento de ${baremo}."`,
    
    `"¡Eh, Profe! Si vas a sobrevivir aquí necesitas instinto. Olvida ese ${encryptedGrade}. El alumno ${studentId} es de manual, un caso claro de ${baremo}. Hazme caso, llevo 20 años aquí."`,
    
    `"Encantado de saludarte. Madre mía, ¿aún sigues con la tabla de símbolos? Del alumno ${studentId} te puedo confirmar que, aunque ponga ${encryptedGrade}, se mueve siempre en un baremo de ${baremo}."`,
    
    `"¿Qué tal llevas la jornada, Profe ${playerName}? ¿Atascado con el alumno ${studentId}? Ese ${encryptedGrade} me suena a chino, pero conociendo sus hábitos de estudio, es de ${baremo}. ¡No te rindas!"`,
    
    `"¡Ostras, las famosas notas encriptadas! Yo intenté descifrarlas y me rendí. Menos mal que eres ${listo}. Del alumno ${studentId} te diré que es de ${baremo}, sin importar ese ${encryptedGrade}."`,
    
    `"Te veo agobiado. Ven, siéntate un minuto. ¿Dudas del alumno ${studentId}? Ese ${encryptedGrade} es una locura, pero su expediente real dice que su actitud es de ${baremo}. Respira, que lo sacarás."`,
    
    `"Hola, profe. Acabo de salir de tutoría con los padres del alumno ${studentId}. Te juro que ese ${encryptedGrade} no refleja su realidad, que es puramente de ${baremo}. Me voy a la sala de profesores a descansar."`,
    
    `"¡Eh, colega! Te veo mirando fijamente ese ${encryptedGrade}. No te comas la cabeza con el alumno ${studentId}. Yo le di clase el año pasado y es de ${baremo} fijo. Venga, que invitamos a pastas en conserjería."`,
    
    `"Eres ${el} valiente que ha aceptado la plaza, ¿no? ¡Qué heroicidad! Del alumno ${studentId} solo puedo decirte que ese ${encryptedGrade} encubre un rendimiento de ${baremo}. ¡Suerte con la desencriptación!"`,
    
    `"Disculpa, ¿tienes un bolígrafo rojo que te sobre? Ah, gracias. Por cierto, si ese ${encryptedGrade} es del alumno ${studentId}, te confirmo que es de ${baremo}. Nos vemos en el claustro."`,
    
    `"¡Vaya jeroglífico! El alumno ${studentId} no es tan complicado como ese ${encryptedGrade} aparenta. Trátalo como a un alumno de ${baremo} y acertarás de pleno."`,
    
    `"Hola, ¿eres Profe ${playerName}? Me han dicho que estás descifrando las notas. Para ahorrarte un disgusto con el alumno ${studentId}: olvida el ${encryptedGrade}, evalúalo como ${baremo}. ¡Un abrazo y ánimo!"`
  ];

  return dialogues[index] || dialogues[dialogues.length - 1];
};
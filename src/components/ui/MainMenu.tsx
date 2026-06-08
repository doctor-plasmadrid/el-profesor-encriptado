import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { playSFX, playBGM, stopBGM } from "../../utils/audio";

const MenuContainer = styled.div`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: #2c3e50; box-sizing: border-box; overflow: hidden;
`;
const TitleContainer = styled.div`
  display: flex; flex-direction: column; align-items: center; margin-bottom: 8vh;
`;
const GameTitle = styled.h1`
  font-family: 'DotGothic16', sans-serif; color: #4af626; font-size: clamp(40px, 8vh, 90px); 
  text-shadow: 6px 6px 0px black; text-align: center; margin: 0; letter-spacing: 2px; line-height: 1.1;
`;
const SubTitle = styled.h2`
  font-family: 'Silkscreen', sans-serif; color: #f1c40f; font-size: clamp(14px, 2.5vh, 24px);
  text-shadow: 3px 3px 0px black; margin-top: 2vh; text-transform: uppercase; letter-spacing: 1px;
`;
const ContentWrapper = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center; 
  width: 90%; max-width: 500px; margin-bottom: 10vh; gap: 15px;
`;
const RetroButton = styled.button`
  width: 100%; background: #8e44ad; color: white; font-family: 'Silkscreen', sans-serif;
  font-size: clamp(18px, 3vh, 28px); padding: 20px; border: 4px solid white; box-shadow: 6px 6px 0px black;
  cursor: pointer; text-transform: uppercase; transition: transform 0.1s, box-shadow 0.1s, filter 0.2s;
  &:hover { filter: brightness(1.2); }
  &:active { transform: translate(6px, 6px); box-shadow: 0px 0px 0px black; }
`;
const Footer = styled.div`
  display: flex; flex-direction: row; width: 100%; justify-content: center; 
  background: rgba(0, 0, 0, 0.6); border-top: 4px solid #34495e; padding: 2vh 0;
  position: absolute; bottom: 0;
`;
const FooterLink = styled.button`
  flex: 1; color: #f1c40f; cursor: pointer; background: none; border: none; 
  font-size: clamp(12px, 2vh, 18px); font-family: 'Silkscreen', sans-serif;
  text-shadow: 2px 2px 0px black; text-transform: uppercase; transition: color 0.2s; letter-spacing: 2px; 
  &:hover { color: white; }
`;
const Overlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.85); 
  display: flex; flex-direction: column; justify-content: center; align-items: center; 
  z-index: 100000; backdrop-filter: blur(5px);
`;
const ModalContainer = styled.div`
  background: #2c3e50; border: 4px solid white; padding: 30px; text-align: center; color: white; 
  box-shadow: 8px 8px 0px black; width: 90%; max-width: 450px; display: flex; flex-direction: column; gap: 20px;
`;
const ProfilePreview = styled.h3`
  font-family: 'DotGothic16', sans-serif; color: #4af626; font-size: 28px; 
  margin: 0; text-shadow: 2px 2px 0px black;
`;
const RetroInput = styled.input`
  width: 100%; padding: 15px; box-sizing: border-box; border: 4px solid white; 
  background-color: rgba(0,0,0,0.8); color: white; text-align: center; font-size: 18px; 
  font-family: 'Silkscreen', sans-serif; box-shadow: inset 4px 4px 0px rgba(0,0,0,0.8); outline: none; text-transform: uppercase;
`;
const ModalButtonRow = styled.div`
  display: flex; gap: 15px; margin-top: 10px;
`;
const GenderToggleRow = styled.div`
  display: flex; gap: 10px; width: 100%; justify-content: center;
`;
const GenderButton = styled.button<{ $active: boolean }>`
  flex: 1; background: ${(props) => props.$active ? '#2ecc71' : '#34495e'};
  color: ${(props) => props.$active ? 'black' : 'white'};
  border: 3px solid ${(props) => props.$active ? 'white' : '#7f8c8d'};
  padding: 10px; font-family: 'Silkscreen', sans-serif; font-size: 16px; cursor: pointer;
  box-shadow: ${(props) => props.$active ? 'inset 2px 2px 0px rgba(255,255,255,0.5)' : '2px 2px 0px black'};
  transition: all 0.1s;
  &:hover { filter: brightness(1.2); }
`;
const SeedContainer = styled.div`
  display: flex; width: 100%; gap: 10px; align-items: stretch; margin-top: 10px;
`;

type GenderType = 'M' | 'F' | 'NB';

export default function MainMenu() {
  const navigate = useNavigate();
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  
  const [playerName, setPlayerName] = useState(() => localStorage.getItem("profesorName") || "Novato"); 
  const [tempName, setTempName] = useState(() => localStorage.getItem("profesorName") || "Novato");
  const [playerGender, setPlayerGender] = useState<GenderType>(() => (localStorage.getItem("profesorGender") as GenderType) || "M");
  const [tempGender, setTempGender] = useState<GenderType>(() => (localStorage.getItem("profesorGender") as GenderType) || "M");

  const [bgmEnabled, setBgmEnabled] = useState(() => localStorage.getItem("bgmEnabled") !== "false");
  const [sfxEnabled, setSfxEnabled] = useState(() => localStorage.getItem("sfxEnabled") !== "false");
  const [sixSevenEnabled, setSixSevenEnabled] = useState(() => localStorage.getItem("sixSevenEnabled") !== "false");
  const [sixSevenDiscovered] = useState(() => localStorage.getItem("sixSevenDiscovered") === "true");

  const [hasSave] = useState(() => localStorage.getItem("profesor_saveGame") !== null);
  const [seedInput, setSeedInput] = useState("");
  const [pendingAction, setPendingAction] = useState<'new' | 'seed' | null>(null);

  useEffect(() => {
    playBGM('menu');
    return () => stopBGM();
  }, []);

  const handleSaveProfile = () => {
    playSFX('button');
    const finalName = tempName.trim() === "" ? "Novato" : tempName.trim();
    localStorage.setItem("profesorName", finalName);
    localStorage.setItem("profesorGender", tempGender);
    setPlayerName(finalName);
    setPlayerGender(tempGender);
    setShowProfileModal(false);
  };

  const handleCancelProfile = () => {
    playSFX('button');
    setTempName(playerName);
    setTempGender(playerGender);
    setShowProfileModal(false);
  };

  const toggleBGM = () => {
    playSFX('button');
    const newVal = !bgmEnabled;
    setBgmEnabled(newVal);
    localStorage.setItem("bgmEnabled", newVal ? "true" : "false");
    if (newVal) playBGM('menu');
    else stopBGM();
  };

  const toggleSFX = () => {
    const newVal = !sfxEnabled;
    setSfxEnabled(newVal);
    localStorage.setItem("sfxEnabled", newVal ? "true" : "false");
    if (newVal) {
        localStorage.setItem("sfxEnabled", "true"); 
        playSFX('button'); 
    }
  };

  const toggleSixSeven = () => {
    playSFX('button');
    const newVal = !sixSevenEnabled;
    setSixSevenEnabled(newVal);
    localStorage.setItem("sixSevenEnabled", newVal ? "true" : "false");
  };

  const executeStart = (action: 'new' | 'seed') => {
    localStorage.removeItem("profesor_saveGame");
    if (action === 'seed') {
      navigate("/game", { state: { seed: seedInput } });
    } else {
      navigate("/game");
    }
  };

  const handleStartRequest = (action: 'new' | 'seed') => {
    playSFX('button');
    
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {
        console.warn("Bloqueo de orientación no soportado en este dispositivo.");
      });
    }

    if (hasSave) {
      setPendingAction(action);
      setShowWarningModal(true);
    } else {
      playSFX('start');
      executeStart(action);
    }
  };

  const handleConfirmWarning = () => {
    playSFX('start');
    setShowWarningModal(false);
    if (pendingAction) executeStart(pendingAction);
  };

  const getSeguroText = (gender: GenderType) => {
    if (gender === 'F') return 'segura';
    if (gender === 'NB') return 'segure';
    return 'seguro';
  };

  return (
    <MenuContainer>
      <TitleContainer>
        <GameTitle>EL PROFESOR</GameTitle>
        <GameTitle style={{ color: "#e74c3c" }}>ENCRIPTADO</GameTitle>
        <SubTitle>Descifra las notas</SubTitle>
      </TitleContainer>

      <ContentWrapper>
        {hasSave && (
          <RetroButton style={{ backgroundColor: "#2ecc71" }} onClick={() => { playSFX('start'); navigate("/game", { state: { loadSave: true } }); }}>
            CONTINUAR
          </RetroButton>
        )}
        <RetroButton onClick={() => handleStartRequest('new')}>
          NUEVA PARTIDA
        </RetroButton>
        
        <SeedContainer>
          <RetroInput 
            type="text" maxLength={8} placeholder="SEMILLA..." value={seedInput} 
            onChange={(e) => setSeedInput(e.target.value.replace(/[^a-zA-Z0-9?.:]/g, '').toUpperCase())} 
            style={{ flex: 1, padding: '10px', fontSize: '14px' }}
          />
          <RetroButton style={{ flex: 1, padding: '10px', fontSize: '16px' }} onClick={() => handleStartRequest('seed')}>
            SEMILLA
          </RetroButton>
        </SeedContainer>
      </ContentWrapper>

      <Footer>
        <FooterLink style={{ borderRight: "4px dashed #7f8c8d" }} onClick={() => { playSFX('button'); setShowProfileModal(true); }}>
          PERFIL
        </FooterLink>
        <FooterLink style={{ borderRight: "4px dashed #7f8c8d" }} onClick={() => { playSFX('button'); setShowSettingsModal(true); }}>
          AJUSTES
        </FooterLink>
        <FooterLink onClick={() => { playSFX('button'); setShowCreditsModal(true); }}>
          CRÉDITOS
        </FooterLink>
      </Footer>

      {showWarningModal && (
        <Overlay>
          <ModalContainer>
            <h2 style={{ fontFamily: "'Silkscreen', sans-serif", margin: 0, color: "#e74c3c" }}>¡ATENCIÓN!</h2>
            <p style={{ fontSize: '18px', fontFamily: "'DotGothic16', sans-serif", lineHeight: 1.5 }}>
              Iniciar una nueva partida causará que los datos de la partida anterior se borren. ¿Estás {getSeguroText(playerGender)}?
            </p>
            <ModalButtonRow>
              <RetroButton style={{ backgroundColor: "#7f8c8d", fontSize: "16px", padding: "12px" }} onClick={() => { playSFX('button'); setShowWarningModal(false); }}>VOLVER</RetroButton>
              <RetroButton style={{ backgroundColor: "#e74c3c", fontSize: "16px", padding: "12px" }} onClick={handleConfirmWarning}>INICIAR</RetroButton>
            </ModalButtonRow>
          </ModalContainer>
        </Overlay>
      )}

      {showProfileModal && (
        <Overlay>
          <ModalContainer>
            <h2 style={{ fontFamily: "'Silkscreen', sans-serif", margin: 0, color: "#f1c40f" }}>IDENTIFICACIÓN</h2>
            <ProfilePreview>Profe {tempName || "???"}</ProfilePreview>
            <GenderToggleRow>
              <GenderButton $active={tempGender === 'M'} onClick={() => { playSFX('button'); setTempGender('M'); }}>Hombre</GenderButton>
              <GenderButton $active={tempGender === 'F'} onClick={() => { playSFX('button'); setTempGender('F'); }}>Mujer</GenderButton>
              <GenderButton $active={tempGender === 'NB'} onClick={() => { playSFX('button'); setTempGender('NB'); }}>No Binario</GenderButton>
            </GenderToggleRow>
            <RetroInput type="text" maxLength={12} placeholder="Tu apellido..." value={tempName} onChange={(e) => setTempName(e.target.value)} />
            <ModalButtonRow>
              <RetroButton style={{ backgroundColor: "#7f8c8d", fontSize: "16px", padding: "12px" }} onClick={handleCancelProfile}>CANCELAR</RetroButton>
              <RetroButton style={{ backgroundColor: "#2ecc71", fontSize: "16px", padding: "12px" }} onClick={handleSaveProfile}>GUARDAR</RetroButton>
            </ModalButtonRow>
          </ModalContainer>
        </Overlay>
      )}

      {showSettingsModal && (
        <Overlay>
          <ModalContainer>
            <h2 style={{ fontFamily: "'Silkscreen', sans-serif", margin: 0, color: "#3498db" }}>AJUSTES</h2>
            
            <GenderToggleRow style={{ marginTop: '20px' }}>
              <GenderButton $active={bgmEnabled} onClick={toggleBGM}>
                Música: {bgmEnabled ? "ON" : "OFF"}
              </GenderButton>
              <GenderButton $active={sfxEnabled} onClick={toggleSFX}>
                Efectos: {sfxEnabled ? "ON" : "OFF"}
              </GenderButton>
            </GenderToggleRow>

            {sixSevenDiscovered && (
              <GenderToggleRow>
                <GenderButton $active={sixSevenEnabled} onClick={toggleSixSeven}>
                  67: {sixSevenEnabled ? "ON" : "OFF"}
                </GenderButton>
              </GenderToggleRow>
            )}

            <RetroButton style={{ backgroundColor: "#7f8c8d", fontSize: "16px", padding: "12px", marginTop: "10px" }} onClick={() => { playSFX('button'); setShowSettingsModal(false); }}>
              CERRAR
            </RetroButton>
          </ModalContainer>
        </Overlay>
      )}

      {showCreditsModal && (
        <Overlay>
          <ModalContainer>
            <h2 style={{ fontFamily: "'Silkscreen', sans-serif", margin: 0, color: "#9b59b6" }}>CRÉDITOS</h2>
            
            <div style={{ fontFamily: "'DotGothic16', sans-serif", fontSize: '18px', lineHeight: '1.6', textAlign: 'left', color: '#bdc3c7', background: 'rgba(0,0,0,0.4)', padding: '15px', border: '2px solid #7f8c8d', marginTop: '10px' }}>
              <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#4af626' }}>Lead Development:</strong><br/>Dr. Plasmadrid</p>
              <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#f1c40f' }}>Background Music:</strong><br/>Scheming Weasel Faster, Investigations / Kevin Macleod (incompetech.com)</p>
              <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#f1c40f' }}>Sound Effects:</strong><br/>Interface SFX Pack 1 (CC0) / ObsydianX</p>
              <p style={{ margin: '0' }}><strong style={{ color: '#3498db' }}>Thanks:</strong><br/>To all students who discovered their encrypted grades and passed.</p>
            </div>

            <RetroButton style={{ backgroundColor: "#7f8c8d", fontSize: "16px", padding: "12px", marginTop: "10px" }} onClick={() => { playSFX('button'); setShowCreditsModal(false); }}>
              CERRAR
            </RetroButton>
          </ModalContainer>
        </Overlay>
      )}

    </MenuContainer>
  );
}
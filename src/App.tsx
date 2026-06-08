import { HashRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import StartPage from "./components/ui/StartPage";
import MainMenu from "./components/ui/MainMenu";
import GameBoard from "./components/game/GameBoard";

export default function App() {
  return (
    <HashRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/main-menu" element={<MainMenu />} />
          <Route path="/game" element={<GameBoard />} />
        </Routes>
      </AnimatePresence>
    </HashRouter>
  );
}
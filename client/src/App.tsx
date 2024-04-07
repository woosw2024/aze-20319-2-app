//import React from 'react';
import './css/App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import GameTitle from './pages/game/GameTitle';
import AzeUser from './pages/user/AzeUser';
import GameTeam from './pages/game/GameTeam';
import 'bootstrap/dist/css/bootstrap.min.css';
import GamePlay from './pages/game/GamePlay';
import GameRs from './pages/game/GameRs';


//function App() {
const App = () => {
  return (
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/user/azeuser" Component={AzeUser} />
      <Route path="/game/gameTitle" Component={GameTitle} />
      <Route path="/game/gameTeam" Component={GameTeam} />
      <Route path="/game/gamePlay" Component={GamePlay} />
      <Route path="/game/gameRs" Component={GameRs} />
    </Routes>
  );
}

export default App;

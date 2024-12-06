import React, { useEffect, useState } from 'react';
import { ArrowCounterclockwise, GearFill } from 'react-bootstrap-icons';
import GameOverModal from './GameOverModal';
import SettingsModal from './SettingsModal';

interface Settings {
  chambers: number;
  gameMode: string;
  partyMode: boolean;
}

const Game: React.FC = () => {
  const getInitialSettings = (): Settings => ({
    chambers: Number(localStorage.getItem('Chambers') || 6),
    gameMode: localStorage.getItem('GameMode') || 'standard',
    partyMode: localStorage.getItem('PartyMode') === 'false',
  });

  const [chamber, setChamber] = useState<number>(Number(localStorage.getItem('Chamber') || 0));
  const [bulletInChamber, setBulletInChamber] = useState<number>(Number(localStorage.getItem('BulletInChamber') || Math.floor(Math.random() * 6) + 1));
  const [alive, setAlive] = useState<boolean>(localStorage.getItem('Alive') !== 'false');
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>(getInitialSettings);

  const gunshotSFX = new Audio(require('../sfx/gunshotSFX.mp3'));
  const emptyChamberSFX = new Audio(require('../sfx/emptyChamberSFX.mp3'));

  useEffect(() => {
    localStorage.setItem('Chamber', chamber.toString());
    localStorage.setItem('BulletInChamber', bulletInChamber.toString());
    localStorage.setItem('Alive', alive.toString());
    localStorage.setItem('Chambers', settings.chambers.toString());
    localStorage.setItem('GameMode', settings.gameMode);
    localStorage.setItem('PartyMode', settings.partyMode.toString());
  }, [chamber, bulletInChamber, alive, settings]);

  const newGame = (newSettings: Settings = settings) => {
    let newBulletInChamber: number = 0;
    switch (newSettings.gameMode) {
      case 'standard':
        newBulletInChamber = Math.floor(Math.random() * newSettings.chambers) + 1;
        break;
      case 'lastChamber':
        newBulletInChamber = newSettings.chambers;
        break;
      default:
        break;
    }

    setBulletInChamber(newBulletInChamber);
    setChamber(0);
    setAlive(true);

    localStorage.setItem('Chamber', '0');
    localStorage.setItem('BulletInChamber', newBulletInChamber.toString());
    localStorage.setItem('Alive', 'true');
  };

  const handleTrigger = async () => {
    if (chamber + 1 === bulletInChamber) {
      setAlive(false);
      await gunshotSFX.play();
    } else {
      await emptyChamberSFX.play();
    }
    setChamber(chamber + 1);
  };

  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    setOpenSettings(false);
    newGame(newSettings);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className='settings'>
        <button className='settings-button' onClick={() => setOpenSettings(true)}>
        <GearFill />
        </button>
        <button className='restart-button' onClick={() => newGame(settings)}>
          <ArrowCounterclockwise />
        </button>
      </div>
      <div className='game-flex'>
        <h1 className={`neon-sign ${settings.gameMode === 'lastChamber' ? 'last-chamber' : ''}`}>Liars Bar IRL</h1>
        <div className='d-flex flex-column align-items-center'>
          <div className='trigger-container'>
            <button className='trigger' onClick={alive ? handleTrigger : undefined} disabled={!alive}>FIRE</button>
          </div>
          <div style={{ paddingBottom: '15px' }}>
            {chamber} / {settings.chambers}
          </div>
          <div className='chambers'>
            {[...Array(settings.chambers)].map((_, index) => (
              <i key={index} className={`bullet ${chamber > index ? 'bullet-fill' : ''}`}></i>
            ))}
          </div>
        </div>
        <GameOverModal show={!alive} onRestart={() => newGame(settings)} onClose={() => newGame(settings)} chamber={chamber} />
        <SettingsModal
          show={openSettings}
          onClose={() => setOpenSettings(false)}
          onSave={handleSaveSettings}
          currentSettings={settings}
        />
      </div>
    </div>
  );
};

export default Game;
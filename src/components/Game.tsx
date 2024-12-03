import React, { useEffect, useState } from 'react';
import { Circle, CircleFill, ArrowCounterclockwise} from 'react-bootstrap-icons';

import GameOverModal from './GameOverModal';


const Game: React.FC = () => {

    const getInitialChamber = () => Number(localStorage.getItem('Chamber') || 0);
    const getInitialBullet = () => Number(localStorage.getItem('BulletInChamber') || Math.floor(Math.random() * 6) + 1);
    const getInitialAlive = () => localStorage.getItem('Alive') !== 'false';

    const [chamber, setChamber] = useState<number>(getInitialChamber);
    const [bulletInChamber, setBulletInChamber] = useState<number>(getInitialBullet);
    const [alive, setAlive] = useState<boolean>(getInitialAlive);

    const gunshotSFX = new Audio(require('../sfx/gunshotSFX.mp3'));
    const emptyChamberSFX = new Audio(require('../sfx/emptyChamberSFX.mp3'));

    useEffect(() => {
        localStorage.setItem('Chamber', chamber.toString());
        localStorage.setItem('BulletInChamber', bulletInChamber.toString());
        localStorage.setItem('Alive', alive.toString());
    }, [chamber, bulletInChamber, alive]);


    const newGame = () => {
        const newBulletInChamber = Math.floor(Math.random() * 6) + 1;
        setBulletInChamber(newBulletInChamber);
        setChamber(0);
        setAlive(true);

        localStorage.setItem('Chamber', '0');
        localStorage.setItem('BulletInChamber', newBulletInChamber.toString());
        localStorage.setItem('Alive', 'true');
    };

    const handleTrigger = () => {
        if (chamber + 1 === bulletInChamber) {
            setAlive(false);
            
            gunshotSFX.play();

        }
        else
        {
            emptyChamberSFX.play();
        }
        setChamber(chamber + 1);
    };

    
    return (
        <div className='game-flex'>
            <h1 className='neon-sign'>Liars Bar IRL</h1>
            <div className='d-flex flex-column align-items-center'>
                <div className='trigger-container'>
                    <button className='trigger' onClick={alive ? handleTrigger : undefined} disabled={!alive}>FIRE</button>
                </div>
                <div style={{ paddingBottom: '15px' }}>
                    {chamber} / 6
                </div>
                <div className='chamber'>
                    {[...Array(6)].map((_, index) => (
                        <i key={index} className={`bullet ${chamber > index ? 'bullet-fill' : ''}`}></i>
                    ))}
                </div>
            </div>

        <GameOverModal show={!alive} onRestart={newGame} onClose={newGame} chamber={chamber} />
        </div>
    );
    
};

export default Game;
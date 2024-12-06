import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import partyModeMessages from '../data/partyModeMessages.json';



interface GameOverModalProps {
    show: boolean;
    onRestart: () => void;
    onClose: () => void;
    chamber: number;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ show, onRestart, onClose, chamber }) => {
    const partyMode = localStorage.getItem('PartyMode') === 'true';
    const [randomMessage, setRandomMessage] = useState<string>('');
    
    useEffect(() => {
        if (show) {
          setRandomMessage(partyModeMessages[Math.floor(Math.random() * partyModeMessages.length)]);
        }
      }, [show]);
    return (
        <Modal show={show} onHide={onClose} centered className="modal-dark-red">
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body className="text-center">
            <Modal.Title className="text-center w-100">DEAD</Modal.Title>
            <p>Killed by chamber number {chamber}</p>
            {partyMode && (
                <p>{randomMessage}</p>
            )}
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
            <Button variant="outline-dark" onClick={onRestart}>
                Restart
            </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GameOverModal;
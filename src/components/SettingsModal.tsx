import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface Settings {
  chambers: number;
  gameMode: string;
}

interface SettingsModalProps {
  onClose: () => void;
  onSave: (newSettings: Settings) => void;
  show: boolean;
  currentSettings: Settings;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSave, show, currentSettings }) => {
  const [settings, setSettings] = useState<Settings>(currentSettings);

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered className="modal-dark-brown">
      <Modal.Header closeButton>
        <Modal.Title >Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {/* Add your settings components here */}
        <div>
          <label>
            Chambers:
            <div style={{ marginTop: '0.2em' }}>
              <button className="btn btn-outline-dark" onClick={() => setSettings(prev => ({ ...prev, chambers: Math.max(prev.chambers - 1, 1) }))}>-</button>
              <span style={{ marginLeft: '0.5em', marginRight: '0.5em' }}>{settings.chambers}</span>
              <button className="btn btn-outline-dark" onClick={() => setSettings(prev => ({ ...prev, chambers: Math.min(prev.chambers + 1, 12) }))}>+</button>
            </div>
          </label>
        </div>
        <div style={{ marginTop: '1em' }}>
          <label>
            Game Mode:
            <select 
              className="form-select mt-2" 
              value={settings.gameMode} 
              onChange={(e) => setSettings({ ...settings, gameMode: e.target.value })}
            >
              <option value="standard">Standard</option>
              <option value="lastChamber">Last Chamber</option>
            </select>
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="outline-dark" onClick={onClose}>
          Close
        </Button>
        <Button variant="outline-dark" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SettingsModal;
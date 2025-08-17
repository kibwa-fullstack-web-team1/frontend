import React from 'react';
import './ModelViewerModal.css';

const ModelViewerModal = ({ model, onClose }) => {
  if (!model) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <div className="modal-model-viewer-container">
          {model.imageUrl.endsWith('.glb') ? (
            <model-viewer
              src={model.imageUrl}
              alt={model.name}
              ar
              ar-modes="webxr scene-viewer quick-look"
              camera-controls
              auto-rotate
              rotation-per-second="54deg"
              shadow-intensity="1"
              style={{ width: '100%', height: '100%', display: 'block' }}
            ></model-viewer>
          ) : (
            <img
              src={model.imageUrl}
              alt={model.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          )}
        </div>
        <div className="modal-model-details">
          <h3>{model.name}</h3>
          <p>{model.description || 'No description available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default ModelViewerModal;
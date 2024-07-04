import React from 'react';

function Modal({ children, onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {children}
        <button style={styles.closeButton} onClick={onClose}>X</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    position: 'relative',
    width: '80%',
    maxHeight: '90%',
    overflowY: 'auto',
  },
  closeButton: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    backgroundColor:'#ff0000',
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingLeft: '10px',
    paddingRight: '10px'
  }
};

export default Modal;

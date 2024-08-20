import React, { useState } from 'react';
import NewIncomeTransactionModal from '../modals/NewIncomeTransactionModal';
import NewBankTransferModal from '../modals/NewBankTransferModal';
import Modal from '../modals/AddModal';
import CreatableSelect from 'react-select/creatable';
import NewTransactionModal from '../modals/NewTransactionModal';
import '../styles/IncomeModalSelectionMenu.css';

function IncomeModalSelectionMenu({transactions, handleUpdateTransactions, isModalOpen, setIsModalOpen}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedModal, setSelectedModal] = useState({ value: {}, label: '' });
    const [modalOptions] = useState([
        { value: 'newTransaction', label: 'New Transaction' },
        { value: 'newIncome', label: 'New Income Transaction' },
        { value: 'accountTransfer', label: 'New Account Transfer' }
    ])

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleOpenModal = (selection) => {
        console.log(selection)
        setSelectedModal(selection);
        setIsModalOpen(true);
        setIsDropdownOpen(false);
    };

    const handleCloseModal = () => {
        setSelectedModal({ value: {}, label: '' });
        setIsModalOpen(false);
        setIsDropdownOpen(false);
    };

    const handleChangeModal = (event) => {
        setSelectedModal(event);
    };

    const getModalStyle = () => {
        switch (selectedModal.value) {
            case 'newTransaction':
                return { 
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    position: 'relative',
                    maxHeight: '90%',
                    overflowY: 'auto',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems: 'center',
                };
            case 'newIncome':
            case 'accountTransfer':
                return { 
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    position: 'relative',
                    maxHeight: '90%',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems: 'center',
                };
            default:
                return {
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    position: 'relative',
                    width: '35%',
                    maxHeight: '90%',
                };
        }
    };    

    const renderModal = () => {
        console.log(selectedModal)
        switch (selectedModal.value) {
          case 'newTransaction':
            return (
                <NewTransactionModal transactions={transactions}/>
            );
          case 'newIncome':
            return (
                <NewIncomeTransactionModal transactions={transactions}/>
            );
          case 'accountTransfer':
            return (
                <NewBankTransferModal transactions={transactions}/>
            );
          default:
            return <p>Please select an option to see the content.</p>;
        }
    };

    return (
        <div>
            {isModalOpen && (
                <Modal 
                    modalStyle={getModalStyle()}
                    onClose={handleCloseModal}
                    onUpdateItems={handleUpdateTransactions}
                >
                    <CreatableSelect
                        className="transaction-dropdown"
                        value={selectedModal}
                        onChange={handleChangeModal}
                        options={modalOptions}
                    />
                    {renderModal()}
                </Modal>
            )}
            <div className="income-modal-selection-menu">
                <button className="new-item" onClick={handleDropdownToggle}>+</button>
                {isDropdownOpen && (
                    <div className={isModalOpen ? "" : "dropdown-menu"}>
                        {modalOptions.map((option, index) => (
                            <button key={index} onClick={() => handleOpenModal(option)}>{option.label}</button>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

export default IncomeModalSelectionMenu;
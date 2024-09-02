import React, { useRef, useState, useEffect } from 'react';
import '../styles/ZipcodeAndTaxRatesUpdater.css';
import { fetchStatesAndTaxCategories, fetchStateTaxCategoryTypes, updateTaxRates, upsertStateTaxCategoryType } from '../api';
import Modal from '../modals/AddModal';
import CreatableSelect from 'react-select/creatable';
import { StatePlaceholder, TaxCategoryTypePlaceholder } from '../constants/Placeholders';
import { convertStringObjectsToOptions } from '../utils/ConvertToOptions';

function ZipcodeAndTaxRatesUpdater() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatedTaxes, setUpdateTaxes] = useState([]);
    const [statesAndTaxCategories, setStatesAndTaxCategories] = useState([]);
    const fileInputRef = useRef(null);
    const [selectableTaxCategoryTypes, setSelectableTaxCategoryTypes] = useState([]);
    const [selectedRestaurantTaxType, setSelectedRestaurantTaxType] = useState('');
    const [restaurantTaxRate, setRestaurantTaxRate] = useState(0.0);
    const [selectedFoodTaxType, setSelectedFoodTaxType] = useState('');
    const [foodTaxRate, setFoodTaxRate] = useState(0.0);
    const [showFoodTaxRate, setShowFoodTaxRate] = useState(false);
    const [showRestaurantTaxRate, setShowRestaurantTaxRate] = useState(false);
    const [selectedState, setSelectedState] = useState('');
    const [allStates, setAllStates] = useState([
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
        ]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    useEffect(() => {
        const loadStatesAndTaxCategories = async () => {
            try {
                const response = await fetchStatesAndTaxCategories();
                setStatesAndTaxCategories(response);
            } catch (error) {
                console.error('Error fetching states and tax categories:', error);
            }
        };
        const getStateTaxCategoryTypes = async () => {
            try {
                const response = await fetchStateTaxCategoryTypes();
                const cleanedItems = response.map(item => item.replace(/'/g, ""));
                setSelectableTaxCategoryTypes(convertStringObjectsToOptions(cleanedItems));
            } catch (error) {
                console.error('Error fetching state tax category types:', error);
            }
        };

        loadStatesAndTaxCategories();
        getStateTaxCategoryTypes();
    }, []);

    const handleFileUpload = async() => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        if (selectedFile) {
            try {
                const response = await updateTaxRates(formData);
                console.log('Response:', response);
                setUpdateTaxes(response);

                setSelectedFile('');
                fileInputRef.current.value = null;
            } catch (error) {
            console.error('Error updating tax rates:', error);
            }
        } else {
            console.log('No file selected');
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFoodTaxRate(0.0);
        setRestaurantTaxRate(0.0);
        setSelectedState('');
        setSelectedRestaurantTaxType(TaxCategoryTypePlaceholder);
        setSelectedFoodTaxType(TaxCategoryTypePlaceholder);
    };

    const handleRestaurantTaxTypeChange = (selectedOption) => {
        setSelectedRestaurantTaxType(selectedOption);
        if(selectedOption.value === 'RATE_ADDITION' || selectedOption.value === 'STATE_FIXED') {
            setShowRestaurantTaxRate(true);
        } else {
            setShowRestaurantTaxRate(false);
        }
    };

    const handleFoodTaxTypeChange = (selectedOption) => {
        setSelectedFoodTaxType(selectedOption);
        if(selectedOption.value === 'RATE_ADDITION' || selectedOption.value === 'STATE_FIXED') {
            setShowFoodTaxRate(true);
        } else {
            setShowFoodTaxRate(false);
        }
    };

    const handleStateChange = (selectedOption) => {
        setSelectedState(selectedOption);
    };

    const handleRestaurantTaxRateChange = (event) => {
        setRestaurantTaxRate(event.target.value);
    };

    const handleFoodTaxRateChange = (event) => {
        setFoodTaxRate(event.target.value);
    };

    const getModalStyle = () => {
        return { 
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            position: 'relative',
            maxHeight: '90%',
            display:'flex',
            flexDirection:'column',
            alignItems: 'space-between',
        };
    };    

    const customStyles = {
            container: (provided) => ({
            ...provided,
            width: 275, // Set your desired static width here
            fontWeight: "normal",
            fontSize: ".7em",
        }),
    };

    const addStateTaxTypes = async () => {
        if(selectedState && selectedRestaurantTaxType && selectedFoodTaxType) {
            const newTaxType = {
                state: selectedState.value,
                restaurantTaxType: selectedRestaurantTaxType.value,
                restaurantTaxRate: parseFloat(restaurantTaxRate),
                foodTaxType: selectedFoodTaxType.value,
                foodTaxRate: parseFloat(foodTaxRate),
            };
            try {
                const response = await upsertStateTaxCategoryType(newTaxType);
                console.log('Response:', response);
                handleCloseModal();
            } catch (error) {
                console.error('Error adding state tax types:', error);
            }
        } else {
            console.log('Please fill out all fields');
        }
    }


    return (
        <div>
            {isModalOpen && (
                <Modal 
                    modalStyle={getModalStyle()}
                    onClose={handleCloseModal}
                >
                    <h2>New State</h2>
                    <div className="form-group">
                        <label htmlFor="state">State:</label>
                        <CreatableSelect
                            id="state"
                            value={selectedState}
                            onChange={handleStateChange}
                            options={allStates.map(state => ({value: state, label: state}))}
                            placeholder={StatePlaceholder.label}
                            isSearchable
                            styles={customStyles}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="restaurantTaxType">Restaurant Tax Type:</label>
                        <CreatableSelect
                            id="restaurantTaxType"
                            value={selectedRestaurantTaxType}
                            onChange={handleRestaurantTaxTypeChange}
                            options={selectableTaxCategoryTypes}
                            placeholder={TaxCategoryTypePlaceholder.label}
                            isSearchable
                            styles={customStyles}
                        />
                    </div>
                    <div className={showRestaurantTaxRate ? 'form-group' : 'hide'}>
                        <label htmlFor="restaurantTaxRate">Restaurant Tax Rate:</label>
                        <input type="number" onChange={handleRestaurantTaxRateChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="foodTaxType">Food Tax Type:</label>
                        <CreatableSelect
                            id="foodTaxType"
                            value={selectedFoodTaxType}
                            onChange={handleFoodTaxTypeChange}
                            options={selectableTaxCategoryTypes}
                            placeholder={TaxCategoryTypePlaceholder.label}
                            isSearchable
                            styles={customStyles}
                        />
                    </div>
                    <div className={showFoodTaxRate ? 'form-group' : 'hide'}>
                        <label htmlFor="foodTaxRate">Food Tax Rate:</label>
                        <input type="number" onChange={handleFoodTaxRateChange}/>
                    </div>
                    <button className='add-state-button' onClick={addStateTaxTypes}>Add State</button>
                </Modal>
            )}
            <div className={isModalOpen ? "hide-parent-modal" : ""}>
                <div className='states-and-tax-categories-container'>
                    <div className='states-and-tax-categories'>
                        <h1 className='states-header'>States and Tax Categories</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>State</th>
                                    <th>Restaurant Tax Type</th>
                                    <th>Restaurant Tax Rate</th>
                                    <th>Food Tax Type</th>
                                    <th>Food Tax Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statesAndTaxCategories.map((st, index) => (
                                    <tr key={index}>
                                        <td>{st.id}</td>
                                        <td>{st.state}</td>
                                        <td>{st.restaurantTaxType}</td>
                                        <td>{st.restaurantTaxRate}</td>
                                        <td>{st.foodTaxType}</td>
                                        <td>{st.foodTaxRate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className='states-and-tax-categories-add-button' onClick={handleOpenModal}>Add</button>
                    </div>
                </div>
                <div>
                    <h1 className='zipcode-header'>Zipcode and Tax Rates Updater</h1>
                    <input className='zipcode-file-input' type="file" onChange={handleFileChange} ref={fileInputRef}/>
                    <button className='zipcode-upload-button' onClick={handleFileUpload}>Upload</button>

                    <div style={{display: updatedTaxes.length > 0 ? 'block' : 'none'}}>
                        <h2>Updated and New Tax Rates</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>State</th>
                                    <th>Zipcode</th>
                                    <th>Region Name</th>
                                    <th>Estimated Combined Rate</th>
                                    <th>State Rate</th>
                                    <th>County Rate</th>
                                    <th>City Rate</th>
                                    <th>Special Rate</th>
                                    <th>Restaurant Rate</th>
                                    <th>Food Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {updatedTaxes.map((tax, index) => (
                                    <tr key={index}>
                                        <td>{tax.id}</td>
                                        <td>{tax.state}</td>
                                        <td>{tax.zipcode}</td>
                                        <td>{tax.taxRegionName}</td>
                                        <td>{tax.estimatedCombinedRate}</td>
                                        <td>{tax.stateRate}</td>
                                        <td>{tax.estimatedCountyRate}</td>
                                        <td>{tax.estimatedCityRate}</td>
                                        <td>{tax.estimatedSpecialRate}</td>
                                        <td>{tax.restaurantTaxRate}</td>
                                        <td>{tax.foodTaxRate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ZipcodeAndTaxRatesUpdater;
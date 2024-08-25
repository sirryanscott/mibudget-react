import React, { useRef, useState } from 'react';
import '../styles/ZipcodeAndTaxRatesUpdater.css';
import { updateTaxRates } from '../api';

function ZipcodeAndTaxRatesUpdater() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [updatedTaxes, setUpdateTaxes] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async(event) => {
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

    return (
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ZipcodeAndTaxRatesUpdater;
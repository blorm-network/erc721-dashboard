import React from 'react';

const ContractDropdown = ({ contracts, selectedContract, setSelectedContract }) => {
    return (
        <div>
            <label>Select Contract:</label>
            <select value={selectedContract} onChange={e => setSelectedContract(e.target.value)}>
                <option value="">Select a contract</option>
                {contracts.map((contract, index) => (
                    <option key={index} value={contract.address}>
                        {contract.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ContractDropdown;

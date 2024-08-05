import React, { useState } from 'react';
import ContractDropdown from './components/ContractDropdown';
import Dashboard from './components/Dashboard';

const App = () => {
    const [selectedContract, setSelectedContract] = useState('');

    const contracts = [
        { name: 'POLYPEPEN', address: '0x4982ac90C1cA9044633448B9b347B506F4ebb55a' },
        { name: 'BLORMQUAZA', address: '0xA95E208FD6cEa184e70CCE77CFB125989A008BCE' },
        { name: 'BLOUNS', address: '0x98e4E5CBb8C7394f1a95559e1A1d1B14332F8678' },
        { name: 'BLOP', address: '0x0A52E83AE87406bC5171e5fc1e057996e43b274C' }
        // Add more contracts here
    ];

    return (
        <div>
            <h1>NFT Dashboard</h1>
            <ContractDropdown
                contracts={contracts}
                selectedContract={selectedContract}
                setSelectedContract={setSelectedContract}
            />
            {selectedContract && <Dashboard contractAddress={selectedContract} />}
        </div>
    );
};

export default App;

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import ABI from '../Blop9.json';
import styles from './Dashboard.module.css';

const Dashboard = ({ contractAddress }) => {
    const [contractData, setContractData] = useState({});
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [uniqueHolders, setUniqueHolders] = useState([]);

    useEffect(() => {
        const switchToPolygonNetwork = async () => {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x89' }], // Chain ID for Polygon Mainnet
                });
            } catch (error) {
                console.error('Failed to switch to the Polygon network', error);
            }
        };

        const fetchContractData = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, ABI.abi, provider);

            const name = await contract.name();
            const symbol = await contract.symbol();

            // Fetch all transfer events
            const filter = contract.filters.Transfer();
            const logs = await provider.getLogs({
                ...filter,
                fromBlock: 0,
                toBlock: 'latest',
            });

            // Fetch the block timestamps for each log
            const blocks = await Promise.all(logs.map(log => provider.getBlock(log.blockNumber)));
            const events = logs.map(log => contract.interface.parseLog(log));

            // Extract unique holders and transaction history
            const holdersMap = new Map();
            const transactions = logs.map((log, index) => {
                const event = contract.interface.parseLog(log);
                const from = event.args.from;
                const to = event.args.to;
                const tokenId = event.args.tokenId.toString();
                const date = new Date(blocks[index].timestamp * 1000).toLocaleDateString();
                const transactionHash = log.transactionHash;

                if (to !== ethers.constants.AddressZero) {
                    if (holdersMap.has(to)) {
                        holdersMap.set(to, holdersMap.get(to) + 1);
                    } else {
                        holdersMap.set(to, 1);
                    }
                }

                if (from !== ethers.constants.AddressZero) {
                    if (holdersMap.has(from)) {
                        holdersMap.set(from, holdersMap.get(from) - 1);
                    } else {
                        holdersMap.set(from, 0);
                    }
                }

                return {
                    from,
                    to,
                    tokenId,
                    date,
                    transactionHash,
                };
            });

            const uniqueHolders = Array.from(holdersMap, ([address, balance]) => ({ address, balance })).filter(holder => holder.balance > 0);

            setContractData({ name, symbol });
            setTransactionHistory(transactions);
            setUniqueHolders(uniqueHolders);
        };

        if (contractAddress) {
            switchToPolygonNetwork().then(fetchContractData);
        }
    }, [contractAddress]);

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Dashboard for {contractData.name}</h1>

            <h2 className={styles.title}>Transaction History</h2>
            <div className={`${styles.tableContainer} ${styles.scrollable}`}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>From</th>
                            <th>To</th>
                            <th>Token ID</th>
                            <th>Date</th>
                            <th>Transaction Hash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionHistory.map((tx, index) => (
                            <tr key={index}>
                                <td>{tx.from}</td>
                                <td>{tx.to}</td>
                                <td>{tx.tokenId}</td>
                                <td>{tx.date}</td>
                                <td><a href={`https://polygonscan.com/tx/${tx.transactionHash}`} target="_blank" rel="noopener noreferrer">{tx.transactionHash}</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h2 className={styles.title}>Unique Holders</h2>
            <div className={`${styles.tableContainer} ${styles.scrollable}`}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Address</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uniqueHolders.map((holder, index) => (
                            <tr key={index}>
                                <td>{holder.address}</td>
                                <td>{holder.balance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;

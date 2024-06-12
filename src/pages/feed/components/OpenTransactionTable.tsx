import { useEffect, useState, useRef } from "react";
import api from "@/utilities/api";
import TransactionRow from "./TransactionRow";

const OpenTransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState<string>('400px'); // Default height

    useEffect(() => {
        const getTransactions = async () => {
            try {
                const response = await api.fetch("/api/transactions/active", {
                    method: "GET",
                });
                const json = await response.json();
                setTransactions(json.data);
            } catch (error) {
                alert(error);
            }
        };

        getTransactions();
    }, []);

    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current) {
                const height = window.innerHeight - 200; 
                setContainerHeight(`${height}px`);
            }
        };

        updateHeight();

        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    // Inline styles for the scrollable container
    const scrollableContainerStyle: React.CSSProperties = {
        width: '100%',
        height: containerHeight, 
        overflowY: 'scroll',
        backgroundColor: '#d1d5db', 
        fontWeight: 600, 
        color: '#00000', 
        padding: '0.5rem', 
        marginTop: '1.25rem', 
        borderRadius: '0.375rem', 
        boxSizing: 'border-box', 
    };

    return (
        <>
            <div className="text-xl font-bold text-gray-800 mt-4 flex justify-between">
                <div>All Open Transactions</div>
            </div>
            <div ref={containerRef} style={scrollableContainerStyle}>
                {transactions.map((transaction) => (
                    <TransactionRow key={transaction.id} transactionDetails={transaction} />
                ))}
            </div>
        </>
    );
};

export default OpenTransactionTable;

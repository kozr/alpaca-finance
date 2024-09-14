import { useEffect, useState, useRef } from "react";
import api from "@/utilities/api";
import TransactionRow from "./TransactionRow";
import { TransactionDetails } from "@/serializers/transactions/transaction-details-serializer";

const OpenTransactionTable = () => {
    const [transactions, setTransactions] = useState<TransactionDetails[]>([]);
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

    // Group and sort transactions
    const groupedTransactions = groupTransactionsByDate(transactions);
    const sortedGroupedTransactions = Object.keys(groupedTransactions).map(date => {
        return {
            date,
            transactions: sortTransactions(groupedTransactions[date])
        };
    });

    // Inline styles for the scrollable container
    const scrollableContainerStyle: React.CSSProperties = {
        width: '100%',
        height: containerHeight,
        overflowY: 'scroll',
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
                {sortedGroupedTransactions.map(({ date, transactions }) => (
                    <div key={date} className="mb-4">
                        <div className="font-bold text-lg mb-2">{date}</div>
                        {transactions.map((transaction) => (
                            <TransactionRow key={transaction.id} transactionDetails={transaction} />
                        ))}
                    </div>
                )).reverse()}
            </div>
        </>
    );
};

export default OpenTransactionTable;

const groupTransactionsByDate = (transactions: TransactionDetails[]): { [key: string]: TransactionDetails[] } => {
    return transactions.reduce((groups, transaction) => {
        const date = new Date(transaction.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {});
};

const sortTransactions = (transactions: TransactionDetails[]): TransactionDetails[] => {
    return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
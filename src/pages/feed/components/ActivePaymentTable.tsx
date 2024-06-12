import { useEffect, useState, useRef } from "react";
import api from "@/utilities/api";
import { useAuth } from "@/components/AuthProvider";
import PaymentRow from "./PaymentRow";

const ActivePaymentTable = () => {
    const authContext = useAuth();
    const currentUser = authContext.user;
    const containerRef = useRef<HTMLDivElement>(null);

    const [payments, setPayments] = useState([]);
    const [containerHeight, setContainerHeight] = useState<string>('400px'); // Default height

    useEffect(() => {
        const getPayments = async () => {
            try {
                const response = await api.fetch(`/api/payments/${currentUser.id}`, {
                    method: "GET",
                });
                const json = await response.json();
                setPayments(json.data);
            } catch (error) {
                console.error(`error: ${JSON.stringify(error)}`);
                alert(error);
            }
        };

        getPayments();
    }, [currentUser]);

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
        width: 'flex-col',
        height: containerHeight, 
        overflowY: 'scroll',
        backgroundColor: '#d1d5db', 
        fontWeight: 600, 
        color: '#000000', 
        padding: '0.5rem', 
        marginTop: '1.25rem', 
        borderRadius: '0.375rem', 
    };

    const pendingPayments = payments.filter(payment => payment.state === 'pending');

    return (
        <>
            <div className="text-xl font-bold text-gray-800 mt-4">Active Payments</div>
            <div ref={containerRef} style={scrollableContainerStyle}>
                {pendingPayments.length > 0 ? (
                    pendingPayments.map(payment => (
                        <PaymentRow key={payment.id} paymentDetails={payment} />
                    ))
                ) : (
                    <div className="text-center text-gray-600">You have no active payments.</div>
                )}
            </div>
        </>
    );
};

export default ActivePaymentTable;

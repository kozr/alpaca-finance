import paymentDetailsSerializer from "@/serializers/payments/payment-details-serializer";
import authMiddleware from "@/utilities/auth-middleware";
import supabase from "@/utilities/supabase/backend";

async function handler(req, res) {
    const id = req.query.id;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = (page - 1) * limit;

    if (id !== req.user.id) {
        console.log(
            "Unauthorized payment get: requested user id does not match session user id"
        );
        return res.status(403).json({ error: "Unauthorized" });
    }

    const { data: payeePayment, error: payeePaymentError } = await supabase
        .from("payment")
        .select("*")
        .eq('payee_user_id', req.user.id)
        .range(offset, offset + limit - 1);

    if (payeePaymentError) {
        console.log("payeePaymentError: ", payeePaymentError);
        return res.status(500).json({ payeePaymentError });
    }

    const { data: payerPayment, error: payerPaymentError } = await supabase
        .from("payment")
        .select("*")
        .eq('payer_user_id', req.user.id)
        .range(offset, offset + limit - 1);

    if (payerPaymentError) {
        console.log("payerPaymentError: ", payerPaymentError);
        return res.status(500).json({ payerPaymentError });
    }

    const data = [...payeePayment, ...payerPayment].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    const { data: currentUser, error: currentUserError } = await supabase
        .from("user")
        .select("*")
        .eq("id", req.user.id)
        .single();

    if (currentUserError) {
        return res.status(500).json({ currentUserError });
    }

    const ret = data.map(async (payment) => {
        if (payment.payee_user_id === req.user.id) {
            const { data: user, error: userError } = await supabase
                .from("user")
                .select("*")
                .eq("id", payment.payer_user_id)
                .single();

            if (userError) {
                return res.status(500).json({ userError });
            }
            payment.source_user_id = payment.payee_user_id;
            return paymentDetailsSerializer(payment, currentUser, user);
        } else {
            const { data: user, error: userError } = await supabase
                .from("user")
                .select("*")
                .eq("id", payment.payee_user_id)
                .single();

            if (userError) {
                return res.status(500).json({ userError });
            }
            payment.source_user_id = payment.payer_user_id;
            return paymentDetailsSerializer(payment, user, currentUser);
        }
    });

    return res.status(200).json({ data: await Promise.all(ret) });
}

export default authMiddleware(handler);

import { sendEmail } from "@/utilities/nodemailer";
import supabase from "@/utilities/supabase/backend";

interface SendWithdrawDepositNoticeProps {
    userId: string;
    amount: number;
    transactionType: string;
}
 
const sendWithdrawDepositNotice = async ({
    userId, amount, transactionType
}: SendWithdrawDepositNoticeProps) => {

    const { data: userData, error: userError } = await supabase.from("user").select("first_name, last_name").eq("id", userId);
    if (userError) {
        console.log("SendWithdrawDepositNoticeProps; Error getting User info: ", userError);
        return { error: userError };
    }

    if (!userData || userData.length === 0) {
        const error = new Error('User not found');
        console.log("SendWithdrawDepositNoticeProps; Error: ", error);
        return { error };
    }

    const userName = `${userData[0].first_name} ${userData[0].last_name}`;

    try {
        if (transactionType === "deposit") {
            await sendEmail({
                to: process.env.BANK_EMAIL,
                subject: `NOTICE: Request to deposit $${amount} by ${userName}`,
                html: `
                    <h1>Deposit Notice</h1>
                    <p>
                        The request to deposit <strong>$${amount}</strong> by <strong>${userName}</strong> has been made.
                    </p>
                    <p>Please confirm that they have sent the appropriate amount.</p>
                `,
            });
        }

        if (transactionType === "withdrawal") {
            await sendEmail({
                to: process.env.BANK_EMAIL,
                subject: `NOTICE: Request to withdraw $${amount} by ${userName}`,
                html: `
                    <h1>Withdrawal Notice</h1>
                    <p>
                        The request to withdraw <strong>$${amount}</strong> by <strong>${userName}</strong> has been made.
                    </p>
                    <p>Please kindly transfer them the appropriate amount.</p>
                `,
            });
        }
        return { success: true };
    } catch (emailError) {
        console.log("SendWithdrawDepositNoticeProps; Error sending email: ", emailError);
        return { error: emailError };
    }
};

export default sendWithdrawDepositNotice;
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import supabase from "@/utilities/supabase/backend";

export default async function handler(_req, res) {
  const { data } = await supabase.from("user").select("*");

  /*
  * `deposits` is a hardcoded object represents the net financial position for each user in the MVP of a record-keeping system using Git.
  * Each key is a string formed by concatenating the user's first and last names.
  * Each value represents the net amount in their account:
  *    - Positive values denote net deposits.
  *    - Negative values denote net withdrawals.
  * 
  * Example Usage:
  *    deposits["JohnDoe"] // 5250  => John Doe has a net deposit of 5250.
  *    deposits["JaneDoe"] // -12400 => Jane Doe has a net withdrawal of 12400.
  */
  const deposits = {
    AndyMa: 129.02,         // Original 0 - (-129.02) = 129.02
    LeonLin: -1823.71,      // Original 0 - 1823.71 = -1823.71
    HenryShang: -181.27,    // Original 0 - 181.27 = -181.27
    NicholasWong: 35.52,    // Original 0 - (-35.52) = 35.52
    MatthewArinanta: -36.72, // Original 0 - 36.72 = -36.72
    KevinZhu: 825.22,       // Original 0 - (-825.22) = 825.22
    AdrianLam: -243.07,     // Original 0 - 243.07 = -243.07
    VivianXu: 20.56,        // Original 0 - (-20.56) = 20.56
    AndyKwan: 225.18,       // Original 0 - (-225.18) = 225.18
    PhillipLiu: 536.12,     // Original 0 - (-536.12) = 536.12
    Charlesnull: 1.63       // Original 0 - (-1.63) = 1.63
  }

  // consolidate payee amount of each user
  const payeeAmount = {};
  await Promise.all(
    data.map(async (user) => {
      const { data: payeeData, error: payeeError } = await supabase
        .from("payment")
        .select("amount")
        .eq("payee_user_id", user.id)
        .eq("state", "successful");

      if (payeeError) {
        console.error(`error: ${JSON.stringify(payeeError)}`);
        return res.status(500).json({ error: payeeError });
      }

      payeeAmount[user.first_name + user.last_name] = payeeData.reduce(
        (acc, curr) => acc + curr.amount,
        deposits[user.first_name + user.last_name]
      );
    })
  );

  // consolidate payer amount of each user
  const payerAmount = {};
  await Promise.all(
    data.map(async (user) => {
      const { data: payerData, error: payerError } = await supabase
        .from("payment")
        .select("amount")
        .eq("payer_user_id", user.id)
        .eq("state", "successful");

      if (payerError) {
        console.error(`error: ${JSON.stringify(payerError)}`);
        return res.status(500).json({ error: payerError });
      }

      payerAmount[user.first_name + user.last_name] = payerData.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
    })
  );

  // compare payee amount and payer amount
  const reconcileData = {};
  Object.keys(payeeAmount).forEach((key) => {
    const u = data.find((user) => user.first_name + user.last_name === key);
    const payee = payeeAmount[key];
    const payer = payerAmount[key];
    const total = payee - payer - u.balance
    if (Math.abs(total) > 0.01) {
      reconcileData[key] = total;
    } else {
      reconcileData[key] = 0;
    }
  });

  res.status(200).json({ data: reconcileData });
}

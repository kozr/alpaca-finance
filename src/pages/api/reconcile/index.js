// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import supabase from "@/utilities/supabase/backend";

export default async function handler(req, res) {
  const { data, _error } = await supabase.from("user").select("*");

  const deposits = {
    AndyMa: 3500,
    LeonLin: -3850,
    HenryShang: 1500,
    NicholasWong: 1450,
    MatthewArinanta: 2600,
    KevinZhu: 2000,
    AdrianLam: 0,
    VivianXu: 200,
    AndyKwan: 0,
    PhillipLiu: 2000,
  };

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

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import supabase from "@/utilities/supabase/backend";

export default async function handler(req, res) {
  const { cancel_token } = req.query;

  if (!cancel_token) {
    const errorMessage = `No cancel_token provided.`;
    console.error(errorMessage);
    return res.status(400).json({ data: null, error: errorMessage });
  }

  const { data, error } = await supabase
    .from("payment")
    .select()
    .eq("cancel_token", cancel_token)
    .eq("state", "pending");

  if (error) {
    console.error(`error: ${JSON.stringify(error)}`);
    return res.status(500).json({ error: error });
  }

  if (data.length == 0) {
    let errorMessage = `Cannot find pending payment with cancel_token: ${cancel_token}`;
    // see if payment was successful
    const { data: searchData, error: searchError } = await supabase
      .from("payment")
      .select()
      .eq("cancel_token", cancel_token);

    if (searchError) {
      console.error(`searchError: ${JSON.stringify(searchError)}`);
      return res.status(500).json({ error: searchError });
    }

    if (searchData.length > 0) {
      const { state } = searchData[0];
      if (state == "successful") {
        errorMessage = `Payment already went through.`;
      } else if (state == "rejected") {
        errorMessage = `Payment was already rejected.`;
      }
      console.error(errorMessage);

      return res.status(400).json({ data: null, error: errorMessage });
    }

    console.error(errorMessage);
    return res.status(404).json({ data: null, error: errorMessage });
  }

  // update payment state to cancelled
  const { data: updatedData, error: updateError } = await supabase
    .from("payment")
    .update({ state: "rejected" })
    .eq("cancel_token", cancel_token)
    .eq("state", "pending");

  console.log(updateError, updatedData);
  if (updateError) {
    console.error(`updateError: ${JSON.stringify(updateError)}`);
    return res.status(500).json({ error: updateError });
  }

  console.log(`Successfully cancelled payment: ${cancel_token}`);

  res.status(200).json(true);
}

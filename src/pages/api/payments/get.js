import supabase from "@utility/supabase/backend";

export default async function handler(req, res) {
  const user = req.params.user;

  if (user !== req.user.id) {
    console.log(
      "Unauthorized payment get: requested user id does not match session user id"
    );
    return res.status(403).json({ error: "Unauthorized" });
  }

  const { data, error } = await supabase
    .from("payment")
    .select("*")
    .or(`payee_user_id.eq.${req.user.id},payer_user_id.eq.${req.user.id}`);

  if (error) {
    return res.status(500).json({ error });
  }
  return res.status(200).json({ data });
}

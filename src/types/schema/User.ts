export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  balance: number;
  avatar_url: string;
}

export default User;
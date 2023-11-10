export interface UserModel {
  _id: string
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  last_signed_in: Date
  created_at: Date
  updated_at: Date
}

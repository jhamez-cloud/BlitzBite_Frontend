export interface AuthAccount {
  name: string
  email: string
  password: string
}

export interface AuthUser {
  name: string
  email: string
}

export interface AdminAccount {
  name: string
  email: string
  password: string
  restaurantName: string
}

export interface AdminUser {
  name: string
  email: string
  restaurantName: string
}

export interface User {
  name: string,
  password: string,
  email: string,
  role: string,
  accountUser: string
}

export interface Login {
  password: string,
  email: string,
}


// manager, admin, user

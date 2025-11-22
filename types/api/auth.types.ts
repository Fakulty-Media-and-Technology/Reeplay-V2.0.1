export interface IGeneric {
  status: number;
  message: string;
}

export interface IPagination {
  page: number;
  limit: number;
}

export interface ISignUpData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  cpassword: string;
  country_code: string;
  mobile: string;
  gender:string;
  dob:string
}

export interface ISignUpDataResponse extends IGeneric {
  data: null;
}

export interface IVerifyAcc {
  email: string;
  token: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface ILoginDataResponse extends IGeneric {
  data: LoginData;
}

export interface LoginData extends User {
token:string
}

export interface User {
  _id: string;
  email: string;
  role: string;
}

export interface IResetPasswordData {
  email: string;
  pin: string;
  password: string;
  cpassword: string;
}

export interface ICreatePIN {
  email: string;
  pin: string;
  cpin: string;
}

export interface IValideTokenResponse extends IGeneric {
  data: {
    valid: boolean;
    accessToken: string;
  };
}

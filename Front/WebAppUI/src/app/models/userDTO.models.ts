import { Status } from "./enum.model";

export interface UserDTO{
    id: string,
    name: string;
    email: string;
    password: string;
    username: string;
    cpf: string;
    motherName: string;
    phoneNumber: string;
    birthDate: string;
    status: Status;
}
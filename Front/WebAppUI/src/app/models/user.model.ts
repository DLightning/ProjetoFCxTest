import { Status } from "./enum.model";

export interface User{
    id: string;
    name: string;
    email: string;
    password: string;
    username: string;
    cpf: string;
    motherName: string;
    phoneNumber: string;
    birthDate: Date;
    inclusionDate: string;
    alterationDate: string;
    status: Status;
}
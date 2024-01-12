import { TeaModel } from "../teas/TeaModel";

export interface UserModel {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    favourite_teas?: Array<TeaModel>;
    owned_teas?: Array<TeaModel>;
}
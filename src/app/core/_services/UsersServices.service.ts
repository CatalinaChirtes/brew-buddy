import { HttpParameterCodec, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, Optional, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { UserModel } from "../_models/users/UserModel";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(protected http: HttpClient){}

    private baseUsersPath = environment.apiUrlUsers;
    private baseUserPath = environment.apiUrlUser;

    public ApiUsersGetAll(): Observable<UserModel[]>{
        return this.http.get<UserModel[]>(this.baseUsersPath);
    }

    public ApiUserGet(id: string): Observable<UserModel[]>{
        return this.http.get<UserModel[]>(
            `${this.baseUserPath}/${id}`
        );
    }

    public ApiUserPut(user: UserModel, id: string): Observable<UserModel[]>{
        return this.http.put<UserModel[]>(
            `${this.baseUserPath}/${id}`,
            user
        );
    }

    public ApiUserDelete(id: string): Observable<UserModel[]>{
        return this.http.delete<UserModel[]>(
            `${this.baseUserPath}/${id}`
        );
    }
}
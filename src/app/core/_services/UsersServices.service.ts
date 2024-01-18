import { HttpParameterCodec, HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
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
    private baseUpdateUserPath = environment.apiUrlUpdateUser;

    public ApiUsersGetAll(): Observable<UserModel[]>{
        return this.http.get<UserModel[]>(this.baseUsersPath);
    }

    // public ApiUserGet(id: string): Observable<UserModel[]>{
    //     return this.http.get<UserModel[]>(
    //         `${this.baseUserPath}/${id}`
    //     );
    // }

    public ApiUserGet(user_id: string): Observable<UserModel[]>{
        const params = new HttpParams().set('user_id', user_id);

        return this.http.get<UserModel[]>(
            `${this.baseUserPath}`,
            { params: params }
        );
    }

    // public ApiUserPut(user: UserModel, id: string): Observable<UserModel[]>{
    //     return this.http.put<UserModel[]>(
    //         `${this.baseUserPath}/${id}`,
    //         user
    //     );
    // }

    public ApiUserPut(user: UserModel): Observable<UserModel[]>{
        return this.http.put<UserModel[]>(
            `${this.baseUpdateUserPath}`,
            user
        );
    }
}
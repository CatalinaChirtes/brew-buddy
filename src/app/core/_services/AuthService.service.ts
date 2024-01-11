import { HttpParameterCodec, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, Optional, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { UserModel } from "../_models/users/UserModel";
import { UserLoginModel } from "../_models/auth/UserLoginModel";
import { UserInputModel } from "../_models/auth/UserInputModel";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(protected http: HttpClient){}

    private baseLoginPath = environment.apiUrlLogin;
    private baseLogoutPath = environment.apiUrlLogout;
    private baseSignupPath = environment.apiUrlSignup;

    public ApiLoginPost(user_login: UserLoginModel): Observable<UserLoginModel[]>{
        return this.http.post<UserLoginModel[]>(
            this.baseLoginPath,
            user_login
        );
    }

    public ApiLogoutGet() {
        return this.http.get(this.baseLogoutPath);
    }

    public ApiSignupPost(user_signup: UserInputModel): Observable<UserInputModel[]>{
        return this.http.post<UserInputModel[]>(
            this.baseSignupPath,
            user_signup
        );
    }
}
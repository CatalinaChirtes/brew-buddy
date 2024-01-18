import { HttpParameterCodec, HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, Optional, Inject } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { TeaModel } from "../_models/teas/TeaModel";

@Injectable({
    providedIn: 'root'
})
export class TeasService {
    constructor(protected http: HttpClient){}

    private baseTeasPath = environment.apiUrlTeas;
    private baseTeaPath = environment.apiUrlTea;
    private baseFavouritesTeaPath = environment.apiUrlFavouritesTea;
    private baseEditFavouritesTeaPath = environment.apiUrlEditFavouritesTea;
    private baseOwnedTeaPath = environment.apiUrlOwnedTea;
    private baseEditOwnedTeaPath = environment.apiUrlEditOwnedTea;
    private baseOwnedFavouritesTeaPath = environment.apiUrlOwnedFavouritesTea;

    public ApiTeasGetAll(): Observable<TeaModel[]>{
        return this.http.get<TeaModel[]>(this.baseTeasPath);
    }

    public ApiTeaGet(tea_id: string): Observable<TeaModel>{
        const params = new HttpParams().set('tea_id', tea_id);

        return this.http.get<TeaModel>(
            `${this.baseTeaPath}`,
            { params: params }
        );
    }

    public ApiTeaFavouritesGet(user_id: string): Observable<TeaModel[]>{
        const params = new HttpParams().set('user_id', user_id);

        return this.http.get<TeaModel[]>(
            `${this.baseFavouritesTeaPath}`,
            { params: params }
        );
    }

    public ApiTeaFavouritesDelete(tea_id: string, user_id: string): Observable<TeaModel>{
        const params = new HttpParams().set('tea_id', tea_id).set('user_id', user_id);

        return this.http.delete<TeaModel>(
            `${this.baseEditFavouritesTeaPath}`,
            { params: params }
        );
    }

    public ApiTeaFavouritesPost(tea_id: string, user_id: string): Observable<TeaModel> {
        const params = new HttpParams().set('tea_id', tea_id).set('user_id', user_id);
      
        return this.http.post<TeaModel>(
          `${this.baseEditFavouritesTeaPath}`,
          null,
          { params: params }
        );
      }

    public ApiTeaOwnedGet(user_id: string): Observable<TeaModel[]>{
        const params = new HttpParams().set('user_id', user_id);

        return this.http.get<TeaModel[]>(
            `${this.baseOwnedTeaPath}`,
            { params: params }
        );
    }

    public ApiTeaOwnedDelete(tea_id: string, user_id: string): Observable<TeaModel>{
        const params = new HttpParams().set('tea_id', tea_id).set('user_id', user_id);

        return this.http.delete<TeaModel>(
            `${this.baseEditOwnedTeaPath}`,
            { params: params }
        );
    }

    public ApiTeaOwnedPost(tea_id: string, user_id: string): Observable<TeaModel> {
        const params = new HttpParams().set('tea_id', tea_id).set('user_id', user_id);
      
        return this.http.post<TeaModel>(
          `${this.baseEditOwnedTeaPath}`,
          null,
          { params: params }
        );
      }

    public ApiTeaOwnedFavouritesGet(user_id: string): Observable<TeaModel[]>{
        const params = new HttpParams().set('user_id', user_id);

        return this.http.get<TeaModel[]>(
            `${this.baseOwnedFavouritesTeaPath}`,
            { params: params }
        );
    }
}
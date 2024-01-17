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

    public ApiTeasGetAll(): Observable<TeaModel[]>{
        return this.http.get<TeaModel[]>(this.baseTeasPath);
    }

    public ApiTeaGet(id: string): Observable<TeaModel>{
        const params = new HttpParams().set('tea_id', id);

        return this.http.get<TeaModel>(
            `${this.baseTeaPath}`,
            { params: params }
        );
    }
}
import { HttpParameterCodec, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, Optional, Inject } from "@angular/core";
import { Observable } from "rxjs";
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

    public ApiTeaGet(id: string): Observable<TeaModel[]>{
        return this.http.get<TeaModel[]>(
            `${this.baseTeaPath}/${id}`
        );
    }
}
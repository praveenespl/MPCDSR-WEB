import { Injectable } from "@angular/core";
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs";
import { UsermasterService } from "../../services/usermaster/usermaster.service";

@Injectable({
	providedIn: "root"
})
export class AuthTokenInterceptor implements HttpInterceptor {
	constructor(private userService: UsermasterService) {}
	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		let access_token = this.userService.token;

		if (access_token) {
			request = request.clone({
				setHeaders: { access_token }
			});
		}

		return next.handle(request);
	}
}

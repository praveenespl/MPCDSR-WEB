
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	isMockEnabled: true, // You have to switch this, when your real back-end is done
	authTokenKey: "authce9d77b308c149d5992a80073637e4d5",
	// apiEndPoint: 'http://localhost:3000/api/',
	// localizationApiEndPoint: 'http://localhost:3000/api/ihipaccesses/getIhipData',
	//apiEndPoint: "https://demoapi.mpdsrdemo.com/api/",
	//localizationApiEndPoint:"https://demoapi.mpdsrdemo.com/api/ihipaccesses/getIhipData",
	//apiEndPoint: 'http://ihiptraining.in/api/',
	apiEndPoint:'https://prod-api.mpcdsrindia.in/api/', //Production server 141 server
	localizationApiEndPoint: 'https://prod-api.mpcdsrindia.in/api/ihipaccesses/getIhipData'
	///apiEndPoint:'https://stg-api.mpcdsrindia.in/api/',//Staging 141 server
	//localizationApiEndPoint: 'https://stg-api.mpcdsrindia.in/api/ihipaccesses/getIhipData'
	//  apiEndPoint:'https://trng-api.mpcdsrindia.in/api/',//training 141 server
	//  localizationApiEndPoint: 'https://trng-api.mpcdsrindia.in/api/ihipaccesses/getIhipData'
	//localizationApiEndPoint: 'https://mcdsrpilotapi.mcdsrindia.com/api/ihipaccesses/getIhipData';
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */

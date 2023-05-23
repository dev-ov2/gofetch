import axios, { AxiosResponse } from 'axios';
import querystring from 'querystring';

const baseUrl = 'https://frontend-take-home-service.fetch.com';

export interface Location {
    zip_code: string
    latitude: number
    longitude: number
    city: string
    state: string
    county: string
}

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

/**
 * Helper method to determine whether a request was successful.
 * 
 * @param status :: the status of the request
 * @returns true if successful, false otherwise
 */
const successfulRequest = (status: number) => {
    return status >= 200 && status < 299;
}

const makeAuthRequest = async (tag: string, axiosRequest: Promise<AxiosResponse<any, any>> | undefined) => {
    if (!axiosRequest) {
        return 'Not Implemented';
    }
    try {
        const response = await axiosRequest;
        return successfulRequest(response.status);
    } catch (error) {
        console.error(`[${tag}] Something went wrong:`, error);
        throw error;
    }

}

enum AxiosMethod {
 GET,
 PUT,
 POST,
 DELETE
}

const axiosRequest = (method: AxiosMethod, url: string, body?: any, config?: any): Promise<AxiosResponse<any, any>> | undefined => {
    const axiosConfig = {withCredentials: true, ...config};
    switch (method) {
        case AxiosMethod.GET: 
            return axios.get(url, axiosConfig);
        case AxiosMethod.PUT:
            return axios.put(url, body, axiosConfig);
        case AxiosMethod.POST:
            return axios.post(url, body, axiosConfig)
        case AxiosMethod.DELETE:
            return axios.delete(url, axiosConfig);
        default: // Not implemented.
        return undefined;
    }
}


/**
 * Logs the user in when name and email is supplied.
 * 
 * @param name  :: the name of the user
 * @param email :: the email of the user
 * @returns whether the request was successful
 */
export const loginUser = async (name: string, email: string) => 
    makeAuthRequest('Login User', axiosRequest(AxiosMethod.POST, `${baseUrl}/auth/login`, {name, email}))


/**
 * Logs out the currently logged in user.
 */
export const logoutUser = async () => makeAuthRequest('Logout User', axiosRequest(AxiosMethod.POST, `${baseUrl}/auth/logout`))

export type SearchParamProps = {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: string;
    ageMax?: string;
    size?: number;
    from?: number;
    sort?: string;
    ids?: string[];
}

/**
 * Fetches an array of dogs from the API, given an array of Dog IDs
 * @param dogs :: the IDs of the dogs to fetch
 * @returns an array of Dogs.
 */
const getDogs = async (dogs: string[]) => {
    const dogResponse = await fetch(`${baseUrl}/dogs`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dogs),
    });

    return await dogResponse.json();
}


/**
 * First fetches a list of Dog IDs from the API based on the provided params
 * Then, fetches an array of Dogs and returns the total as well as the dogs.
 * @param params :: the params to search/filter the database results
 * @returns the total amount of Dogs, as well as the fetched Dogs
 */
export const fetchDogs = async (params?: SearchParamProps) => {
    // Filter any undefined values.
    const filteredParams = Object.fromEntries(Object.entries((params ?? {})).filter(([_, value]) => value !== undefined));

    // We don't already have ids, let's fetch them.
    if (!filteredParams.ids) {
    const idResponse = await fetch(`${baseUrl}/dogs/search?${querystring.stringify(filteredParams)}`, { method: 'GET', credentials: 'include'});
    const data = await idResponse.json();
    // Now, fetch the dog objects.

    const dogs = await getDogs(data.resultIds)

    return {...data, dogs}
    } else {
    const dogResponse = await fetch(`${baseUrl}/dogs`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredParams.ids),
    });

    const dogs = await dogResponse.json();

    // Attach dog objects to the response.
    return {total: (filteredParams.ids as string[]).length, dogs };    
    }
    
}

/**
 * Fetches the breeds we are able to filter by
 * @returns an array of strings (referring to Breeds)
 */
export const fetchBreeds = async () => {
    const response = await fetch(`${baseUrl}/dogs/breeds`, { method: 'GET', credentials: 'include'});
    const data = await response.json();

   return data;
}

/**
 * Given an array of IDs, submit to the API for match finding.
 * Once a match is found, determine its location based on the zip
 * code. Finally, return the determined match and the location
 * @param favorites :: Dog IDs to submit for match finding
 * @returns the API's match as well as the location of the Dog
 */
export const fetchMatch = async (favorites: string[]) => {
    const response = await fetch(`${baseUrl}/dogs/match`, { 
        method: 'POST', 
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(favorites)});
    const data = await response.json();
    // We have a match. Let's fetch this dog.

    const match = (await getDogs([data.match]) as Dog[])[0];

    // Now get the location of the dog.

    const locationResponse = await fetch(`${baseUrl}/locations`, { 
        method: 'POST', 
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([match.zip_code])});
    const location = ((await locationResponse.json()) as Location[])[0];

    return { match, location};
}


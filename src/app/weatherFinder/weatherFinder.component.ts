import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

interface CityWeather {
  name: string;
  weather: string;
  status: string[];
}

interface ApiResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: CityWeather[];
}

@Component({
  selector: "weather-finder",
  templateUrl: "./weatherFinder.component.html",
  styleUrls: ["./weatherFinder.component.scss"],
})
export class WeatherFinder implements OnInit {
  data = [];
  cold = false;
  sunny = false;
  cityName = "";

  constructor(private http: HttpClient) {}
  ngOnInit(): void {}
  async getWeatherData(): Promise<ApiResponse> | null {
    this.cold = false;
    this.sunny = false;
    // let queryParams = new HttpParams();
    // queryParams = queryParams.append("name", this.cityName);
    return this.http
      .get(`https://jsonmock.hackerrank.com/api/weather?name=${this.cityName}`)
      .pipe(map((res) => res as ApiResponse))
      .toPromise();
  }

  async getWeather() {
    this.data = [];
    if(this.cityName !== '') {
      await this.getWeatherData().then((res) => {
        this.data = res ? res.data : [];
      });
      if (this.data.length > 0) {
        this.data[0].weather.split(" ").forEach((element) => {
          if (!isNaN(element)) {
            if (element < 20) {
              this.cold = true;
            }
            if (element > 20) {
              this.sunny = true;
            }
          }
        });
      }
    }
  }
}

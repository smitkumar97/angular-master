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
  resObj;
  cold = false;
  sunny = false;
  search = false;
  emptyData = false;
  cityName = "";

  constructor(private http: HttpClient) {}
  ngOnInit(): void {}
  async getWeatherData(): Promise<ApiResponse> | null {
    this.cold = false;
    this.sunny = false;
    return this.http
      .get(`https://jsonmock.hackerrank.com/api/weather?name=${this.cityName}`)
      .pipe(map((res) => res as ApiResponse))
      .toPromise();
  }

  async getWeather() {
    this.search = true;
    if(this.cityName !== '') {
      this.resObj = {};
      await this.getWeatherData().then((res) => {
        this.resObj = res && res.data.length === 1 ? res : {};
      });
      if (Object.keys(this.resObj).length !== 0) {
        if(this.resObj.data[0].name.toUpperCase() === this.cityName.toUpperCase()){
        this.resObj.data[0].weather.split(" ").forEach((element) => {
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
    } else {
      this.resObj = {};
      this.emptyData = true;
    }
  }
}

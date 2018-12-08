import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TopicService {

  constructor(private httpClient: HttpClient) {

  }

  getTopics() {
    return this.httpClient.get('http://172.23.238.164:7000/questiongenerator/topics');
  }
}

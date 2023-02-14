import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  poem: string = "Klikni tlačidlo a ja sa inšpirujem tvojou krásou";
  poemLoaded: boolean = true;

  getPoem(){
    this.poemLoaded = false;
    const endpoint = 'https://api.openai.com/v1/completions';
    const apiKey = '${API_KEY}';

    const response = fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: 'Napíš báseň o mojej láske Janulke a naše dcére Lilianke.',
        model: 'text-davinci-003',
        max_tokens: 180,
        temperature: 0.5
      })
    }).then(response => {
      response.json().then(_ => {
        console.log(_)
        this.poem = _.choices[0].text;
        this.poemLoaded = true;
      })
    });
  }
}

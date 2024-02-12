import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  poem: string = "Klikni tlačidlo a ja sa inšpirujem tvojou krásou";
  poemLoaded: boolean = true;
  imageLoading: boolean = false;
  imageLoaded: boolean = false;
  apiKey: string = '${API_KEY}';
  imageUrl: string = ""

  getPoem() {
    this.poemLoaded = false;
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const response = fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        messages: [
          {
            'role': 'user',
            'content': 'Napíš báseň o mojej láske Janulke. Je to najkrajšia žena akú som kedy videl. Má ohnivo ryšavé vlasy a oči modré ako obloha. Spomeň našu dcéru, ktorá sa volá Lilianka a má 14 mesiacov. Daj dôraz na fakt, že ju milujem najviac na celom svete. Báseň sa musí rýmovať!'
          }],
        model: 'gpt-4',
        max_tokens: 200,
        temperature: 0.5
      })
    }).then(response => {
      response.json().then(_ => {
        try {
          this.poem = this.sanitizePoem(_.choices[0].message.content);
          this.getImage();
        }
        catch (e) {
          this.poem = `Došlo k chybe pri skladaní básne. Umelá inteligencia môže byť práve príliš vyťažená, skús to prosím o chvíľku neskôr.`;
          console.log(_);
        }
        this.poemLoaded = true;
      });
    });
  }

  getImage() {
    this.imageLoading = true;
    const endpoint = 'https://api.openai.com/v1/images/generations';
    const response = fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: "Nepíš na obrázok žiaden text a maľuj v renesančnom štýle! " + this.poem,
        n: 1,
        size: "1024x1024"
      })
    }).then(response => {
      response.json().then(_ => {
        try {
          this.imageUrl = _.data[0].url;
          this.imageLoading = false;
          this.imageLoaded = true;
        }
        catch (e) {
          console.log(_);
        }
      });
    });
  }

  private sanitizePoem(poem: string): string {
    return poem.substr(0, poem.lastIndexOf(".") + 1);
  }
}

import * as FormData from 'form-data';
import * as sharp from 'sharp';
const fetch = require('node-fetch');


export class Waifu2x {
  private baseUrl: string = ' https://mng.waifu2x.me/api';
  private uploadUrl: string = "/file/convert";
  private instanceId: string = "1657";
  private apiKey = "8b71029f931a42d907db8055821f83ff00a8a382f8681b9598d2c6db4e1738a9a401287fa3903e0233d5c9b91f0ed04c";

  constructor(instanceId:string = '') {
    if (instanceId !== '') {
        this.instanceId = instanceId;
    }
  }

  async scale(buffer: Buffer, metadata: sharp.Metadata): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      let form = new FormData();

      form.append('file', buffer, {
        filename: 'upload.' + metadata.format,
        contentType: 'image/' + metadata.format,
        knownLength: buffer.length
      });
      form.append('id',this.instanceId);
      form.append('style','art');
      form.append('noise', '3');
      form.append('scale', '10');
      form.append('apikey',this.apiKey);
      form.append('comp',8);

      fetch(this.baseUrl + this.uploadUrl, {method: 'POST', body: form})
          .then((response) => response.json())
          .then(restext => resolve(this.download(restext)))
          .catch(err => reject('cannot scale\n' + err));
    });
    }

    private download(json: object): string {
      console.log(json);
      return json["src"];
    }

    async getFiles():Promise<Array<string>> {
        return new Promise<Array<string>>((resolve, reject) => {
            fetch(this.baseUrl + `/file/list?apikey=${this.apiKey}&id=${this.instanceId}`)
                .then(response => response.json())
                .then(json => {
                    let files = new Array<string>();
                    for (let file of json["files"]) {
                        files.push(file["src"]);
                    }
                    resolve(files);
                })
                .catch(err => reject(err));
        });
    }
}

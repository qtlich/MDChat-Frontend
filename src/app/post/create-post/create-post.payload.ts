export class CreatePostPayload {

  constructor(public channelId?:number,
              public postName?: string,
              public description?:string,
              public url?:string)
  {
  }
}

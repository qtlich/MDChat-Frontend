import {AppConfigService} from './common/services/app.config.service';

export function initializer(cs: AppConfigService): () => Promise<any>
{
  return (): Promise<any> =>
  {
    return new Promise(async (resolve, reject) =>
                       {
                         try
                         {
                           await cs.load();
                           resolve();
                         } catch (error)
                         {
                           reject(error);
                         }
                       });
  }
}

import { WebContainer } from '@webcontainer/api';

let webContainerInstance;

export async function getWebContainerInstance() {
  if(!webContainerInstance) {
    webContainerInstance = await WebContainer.boot();
  }


  return webContainerInstance;
}
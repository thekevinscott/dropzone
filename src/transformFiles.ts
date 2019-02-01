import * as React from 'react';
import traverseFileTree from './traverseFileTree';

type IParsedFile = {
  file: File;
  path: string;
  src: string;
};
export type IParsedFiles = {
  [index: string]: IParsedFile | IParsedFiles;
};

const transformFiles = async (e: React.DragEvent): Promise<IParsedFiles> => {
  const d: DataTransfer = e.dataTransfer || {};
  const items: DataTransferItemList = d.items || [];
  let images: any = [];
  for (let i=0; i<items.length; i++) {
    // webkitGetAsEntry is where the magic happens
    const item: any = items[i].webkitGetAsEntry();
    if (item) {
      const folder = await traverseFileTree(item);
      images = images.concat(folder);
    }
  }

  const orig: IParsedFiles = {};

  return images.reduce((allImages: any, image: any) => {
    if (image.path) {
      return {
        ...allImages,
        [image.path]: (allImages[image.path] || []).concat(image),
      };
    }

    return allImages;
  }, orig);
};

export default transformFiles;

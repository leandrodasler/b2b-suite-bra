import { changeImageUrlSize } from './generateUrl'
import type { Image } from '../typings'

const thumbnailSize = 160

export default function generateImageConfig(image: Image) {
  return {
    imageId: image.imageId,
    imageTag: image.imageTag,
    imageUrl: image.imageUrl,
    thumbnailUrl: changeImageUrlSize(image.imageUrl, thumbnailSize),
    imageText: image.imageText,
    imageLabel: image.imageLabel,
  }
}

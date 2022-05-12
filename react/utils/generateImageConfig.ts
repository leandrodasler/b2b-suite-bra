import { changeImageUrlSize } from './generateUrl'
import { Image } from '../typings'

const thumbnailSize = 160

export default function generateImageConfig(image: Image) {
  return {
    imageUrl: image.imageUrl,
    thumbnailUrl: changeImageUrlSize(image.imageUrl, thumbnailSize),
    imageText: image.imageText,
    imageLabel: image.imageLabel,
  }
}

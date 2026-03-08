import { CLOUDINARY_CLOUD_NAME } from '@/constants'
import { Cloudinary } from '@cloudinary/url-gen'
import { dpr, format, quality } from '@cloudinary/url-gen/actions/delivery'
import { source } from '@cloudinary/url-gen/actions/overlay'
import { fill } from '@cloudinary/url-gen/actions/resize'
import { Position } from '@cloudinary/url-gen/qualifiers'
import { compass } from '@cloudinary/url-gen/qualifiers/gravity'
import { text } from '@cloudinary/url-gen/qualifiers/source'
import { TextStyle } from '@cloudinary/url-gen/qualifiers/textStyle'

const cld = new Cloudinary({
    cloud: {
        cloudName: CLOUDINARY_CLOUD_NAME
    }
})

export const bannerPhoto = (
    imageCldPubId: string,
    name: string
) => cld.image(imageCldPubId)
    .resize(fill().width(1200).height(400))
    .delivery(format('auto'))
    .delivery(quality('auto'))
    .delivery(dpr('auto'))
    .overlay(source(text(name, new TextStyle('Roboto', 50).fontWeight('bold'))
        .textColor('white'))
        .position(new Position()
            .gravity(
                compass('south_west')).offsetX(40).offsetY(180)))
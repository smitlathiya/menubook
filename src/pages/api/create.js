import connectDB from '../../lib/db';
import Product from '../../models/Product.JS';
import {IncomingForm} from 'formidable';
import fs from 'fs';


connectDB();

export const config = {
    api: {
      bodyParser: false,
    },
  };

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
          let form = new IncomingForm();
          form.keepExtensions = true;
          form.parse(req, async (err, fields, files) => {
            if (err) {
              console.error('Error parsing form:', err);
              return res.status(500).json({ success: false, error: 'Server Error' });
            }
            const { title, price, code, size } = fields;

            console.log(title, price, code, size);
            // Handle image upload
    
            // Save product with image data as buffer
            const product = new Product({
              title: title[0],
              price: Number(price[0]),
              code: code[0], 
              size: size[0]
            });

            
            if(files?.image?.length > 0){
              const imageFile = files.image[0]; // Assuming the field name for the image is "image"
              const imageBuffer = fs.readFileSync(imageFile.filepath);
              product.image.data = imageBuffer;
              product.image.contentType = imageFile.mimetype;

            }
    
            await product.save();
    
            res.status(201).json({ success: true, data: product });
          });
        } catch (error) {
          console.log(error);
          res.status(500).json({ success: false, error: 'Server Error' });
        }
      } else {
        res.status(405).json({ success: false, error: 'Method Not Allowed' });
      }
}

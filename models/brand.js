import { Schema, model } from 'mongoose';

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'brand must have a name'],
      unique: [true, 'brand name must be unique'],
      minlength: [3, 'Too short name'],
      maxlength: [32, 'Too long name'],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

const setImageUrl = doc => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/${doc.image}`;
    doc.image = imageUrl;
  }
};
brandSchema.post('init', doc => {
  setImageUrl(doc);
});

brandSchema.post('save', doc => {
  setImageUrl(doc);
});

export const BrandModel = model('brand', brandSchema);

const setProductImageUrl = doc => {
  if (doc.mainImage) {
    const imageUrl = `${process.env.BASE_URL}/${doc.mainImage}`;
    doc.mainImage = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];

    doc.images.forEach(image => {
      imagesList.push(`${process.env.BASE_URL}/${image}`);
    });

    doc.images = imagesList;
  }
};

const setImageUrl = doc => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/${doc.image}`;
    doc.image = imageUrl;
  }
};

export const renameImage = (Schema, schemaType) => {
  // add url link to our images when getting them from database
  // init doesn't work with create req

  Schema.post('init', doc => {
    if (schemaType === 'product') return setProductImageUrl(doc);
    setImageUrl(doc);
  });

  Schema.post('save', doc => {
    if (schemaType === 'product') return setProductImageUrl(doc);
    setImageUrl(doc);
  });
};

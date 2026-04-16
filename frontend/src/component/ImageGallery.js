function ImageGallery({ images }) {

  const getImageSrc = (img) => {
  if (!img) return "/fallback.jpg";

  // ✅ if already full URL
  if (img.startsWith("http")) {
    return img;
  }

  // ✅ if local image
  return `${process.env.REACT_APP_API_URL}${img}`;
};
  return (
    <div className="flex gap-2 w-full h-full   scrollbar-hide rounded-lg ">
      {images?.map((img, i) => (
      <img
       key={i}
       src={getImageSrc(img)}
       className="rounded-lg  W-full h-full object-cover"
      />
  ))}
    </div>
  );
}

export default ImageGallery;
import { getImageUrl } from "../config/apiBase.js";

function ImageGallery({ images }) {
  const getImageSrc = (img) => getImageUrl(img);

  const list = Array.isArray(images) ? images : [];

  return (
    <div className="flex gap-2 w-full h-full   scrollbar-hide rounded-lg ">
      {list.map((img, i) => (
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
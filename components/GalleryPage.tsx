import React, { useState } from 'react';
import ReactPullToRefresh from 'react-pull-to-refresh';
import InfiniteScroll from 'react-infinite-scroll-component';
import ImageCard from './ImageCard';
import FloatingActionButton from './FloatingActionButton';

const initialImages = [
  { src: 'https://picsum.photos/400/300', alt: 'Cosplay Image 1' },
  { src: 'https://picsum.photos/400/500', alt: 'Cosplay Image 2' },
  { src: 'https://picsum.photos/400/400', alt: 'Cosplay Image 3' },
  { src: 'https://picsum.photos/400/600', alt: 'Cosplay Image 4' },
  { src: 'https://picsum.photos/400/350', alt: 'Cosplay Image 5' },
  { src: 'https://picsum.photos/400/450', alt: 'Cosplay Image 6' },
  { src: 'https://picsum.photos/400/550', alt: 'Cosplay Image 7' },
  { src: 'https://picsum.photos/400/320', alt: 'Cosplay Image 8' },
];

const GalleryPage: React.FC = () => {
  const [images, setImages] = useState(initialImages);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    if (images.length >= 50) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setImages(images.concat(initialImages));
    }, 1500);
  };

  const handleRefresh = () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setImages([...initialImages].reverse());
        resolve();
      }, 2000);
    });
  };


  return (
    <ReactPullToRefresh onRefresh={handleRefresh}>
      <div className="bg-background-light dark:bg-background-dark min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {images.length > 0 ? (
            <InfiniteScroll
              dataLength={images.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <ImageCard key={index} src={image.src} alt={image.alt} />
                ))}
              </div>
            </InfiniteScroll>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark mb-4">
                Your gallery is empty
              </h2>
              <p className="text-muted-foreground-light dark:text-muted-foreground-dark">
                Upload your cosplay transformations to see them here!
              </p>
            </div>
          )}
        </div>
        <FloatingActionButton />
      </div>
    </ReactPullToRefresh>
  );
};

export default GalleryPage;
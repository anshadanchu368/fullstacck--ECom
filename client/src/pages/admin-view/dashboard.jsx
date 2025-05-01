import React, { useEffect, useState } from 'react';
import ProductImageUpload from './image-upload';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  addFeatureImage,
  getFeatureImage,
  deleteFeatureImage, // Uncomment this if you add delete functionality
} from '@/store/common-slice';

const AdminDashboard = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const { featureImageList, isLoading } = useSelector(state => state.commonFeature);
  const dispatch = useDispatch();

  const handleUploadFeatureImage = () => {
    if (!uploadedImageUrl) return;

    dispatch(addFeatureImage({ image: uploadedImageUrl })).then(data => {
      if (data?.payload?.success) {
        setUploadedImageUrl('');
        setImageFile(null);
        dispatch(getFeatureImage());
      }
    });
  };

  
  const handleDeleteBanner = (id) => {
    dispatch(deleteFeatureImage(id)).then(() => {
      dispatch(getFeatureImage());
    });
  };


  useEffect(() => {
    dispatch(getFeatureImage());
  }, [dispatch]);

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Banner Management</h2>
        <p className="text-gray-600">Upload and manage homepage banner images.</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
        />

        {/* Preview */}
        {uploadedImageUrl && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">Preview:</p>
            <img
              src={uploadedImageUrl}
              alt="Banner preview"
              className="w-full h-40 object-cover rounded-md border"
            />
          </div>
        )}

        <Button
          className="mt-4"
          onClick={handleUploadFeatureImage}
          disabled={imageLoadingState || !uploadedImageUrl}
        >
          {imageLoadingState ? 'Uploading...' : 'Upload Banner'}
        </Button>
      </div>

      {/* Banner List */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Current Banners</h3>
        {isLoading ? (
          <p className="text-gray-500">Loading banners...</p>
        ) : featureImageList?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featureImageList.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md border p-2 flex flex-col items-center"
              >
                <img
                  src={item.image}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-40 object-cover rounded-md"
                />
                
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => handleDeleteBanner(item._id)}
                >
                  Delete
                </Button> 
               
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No banners uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

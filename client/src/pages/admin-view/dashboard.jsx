
import { useEffect, useState } from "react"
import ProductImageUpload from "./image-upload"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { addFeatureImage, getFeatureImage, deleteFeatureImage } from "@/store/common-slice"
import { motion } from "framer-motion"
import { ImagePlus, Trash2, ImageIcon, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

const AdminDashboard = () => {
  const [imageFile, setImageFile] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState("")
  const [imageLoadingState, setImageLoadingState] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const { featureImageList, isLoading } = useSelector((state) => state.commonFeature)
  const dispatch = useDispatch()

  const handleUploadFeatureImage = () => {
    if (!uploadedImageUrl) return

    toast.promise(
      dispatch(addFeatureImage({ image: uploadedImageUrl })).then((data) => {
        if (data?.payload?.success) {
          setUploadedImageUrl("")
          setImageFile(null)
          dispatch(getFeatureImage())
          return true
        }
        return Promise.reject()
      }),
      {
        loading: "Uploading banner...",
        success: "Banner uploaded successfully!",
        error: "Failed to upload banner",
      },
    )
  }

  const handleDeleteBanner = (id) => {
    setDeletingId(id)
    toast.promise(
      dispatch(deleteFeatureImage(id))
        .then(() => {
          dispatch(getFeatureImage())
          return true
        })
        .finally(() => {
          setDeletingId(null)
        }),
      {
        loading: "Deleting banner...",
        success: "Banner deleted successfully!",
        error: "Failed to delete banner",
      },
    )
  }

  useEffect(() => {
    dispatch(getFeatureImage())
  }, [dispatch])

  return (
    <div className="p-4 md:p-6 space-y-8 bg-gray-50 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-gray-700" />
          Banner Management
        </h2>
        <p className="text-gray-600 mt-1">Upload and manage homepage banner images.</p>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <ImagePlus className="w-5 h-5 text-gray-600" />
              Upload New Banner
            </h3>

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
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={uploadedImageUrl || "/placeholder.svg"}
                    alt="Banner preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </motion.div>
            )}

            <Button
              className="mt-4 gap-2"
              onClick={handleUploadFeatureImage}
              disabled={imageLoadingState || !uploadedImageUrl}
            >
              {imageLoadingState ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ImagePlus className="w-4 h-4" />
                  Upload Banner
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Banner List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-gray-600" />
          Current Banners
        </h3>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : featureImageList?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {featureImageList.map((item, index) => (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group"
              >
                <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-3">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full gap-1.5"
                      onClick={() => handleDeleteBanner(item._id)}
                      disabled={deletingId === item._id}
                    >
                      {deletingId === item._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      {deletingId === item._id ? "Deleting..." : "Delete Banner"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No banners uploaded yet.</p>
            <p className="text-gray-400 text-sm mt-1">Upload your first banner to get started.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AdminDashboard

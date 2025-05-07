
import { useEffect, useState } from "react"
import ProductImageUpload from "./image-upload"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { addFeatureImage, getFeatureImage, deleteFeatureImage } from "@/store/common-slice"
import { motion } from "framer-motion"
import {
  ImagePlus,
  Trash2,
  ImageIcon,
  Loader2,
  BarChart3,
  Users,
  ShoppingBag,
  DollarSign,
  Calendar,
  ArrowUpRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data for charts
const visitData = [
  { name: "Jan", visits: 4000 },
  { name: "Feb", visits: 3000 },
  { name: "Mar", visits: 5000 },
  { name: "Apr", visits: 4500 },
  { name: "May", visits: 6000 },
  { name: "Jun", visits: 5500 },
  { name: "Jul", visits: 7000 },
  { name: "Aug", visits: 8000 },
  { name: "Sep", visits: 7500 },
  { name: "Oct", visits: 9000 },
  { name: "Nov", visits: 8500 },
  { name: "Dec", visits: 10000 },
]

const salesData = [
  { name: "Jan", sales: 2400, profit: 1800 },
  { name: "Feb", sales: 1398, profit: 1000 },
  { name: "Mar", sales: 9800, profit: 7200 },
  { name: "Apr", sales: 3908, profit: 2800 },
  { name: "May", sales: 4800, profit: 3600 },
  { name: "Jun", sales: 3800, profit: 2800 },
]

const productCategoryData = [
  { name: "Men", value: 400 },
  { name: "Women", value: 350 },
  { name: "Kids", value: 200 },
  { name: "Accessories", value: 150 },
  { name: "Footwear", value: 300 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const AdminDashboard = () => {
  const [imageFile, setImageFile] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState("")
  const [imageLoadingState, setImageLoadingState] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

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
    <div className="p-4 md:p-6 space-y-8 bg-gray-50 min-h-screen text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Admin Dashboard
          </h2>
          <p className="text-gray-600 mt-1">Manage your store and monitor performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white border-gray-200 text-gray-800 hover:bg-gray-100">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 days
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-100">
            Overview
          </TabsTrigger>
          <TabsTrigger value="banners" className="data-[state=active]:bg-gray-100">
            Banner Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Total Visitors</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">64,389</h3>
                    <div className="flex items-center mt-1 text-emerald-400 text-sm">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      <span>12.5%</span>
                      <span className="text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Products Sold</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">1,483</h3>
                    <div className="flex items-center mt-1 text-emerald-400 text-sm">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      <span>8.2%</span>
                      <span className="text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">₹10,000</h3>
                    <div className="flex items-center mt-1 text-emerald-400 text-sm">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      <span>16.8%</span>
                      <span className="text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="pb-2 mt-4">
                  <CardTitle className="text-gray-900">User Visits</CardTitle>
                  <CardDescription className="text-gray-500">Monthly visitor traffic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={visitData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb", color: "#111827" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="visits"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorVisits)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="pb-2 mt-4">
                  <CardTitle className="text-gray-900">Sales & Profit</CardTitle>
                  <CardDescription className="text-gray-500">Monthly sales and profit data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb", color: "#111827" }}
                        />
                        <Legend />
                        <Bar dataKey="sales" fill="#10b981" name="Sales" />
                        <Bar dataKey="profit" fill="#8884d8" name="Profit" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="pb-2 mt-4">
                  <CardTitle className="text-gray-900">Product Categories</CardTitle>
                  <CardDescription className="text-gray-500">Sales by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {productCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb", color: "#111827" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="pb-2 mt-4">
                  <CardTitle className="text-gray-900">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-500">Latest store activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="flex items-center gap-4 border-b border-gray-200 pb-3 last:border-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            item % 3 === 0
                              ? "bg-indigo-500/20"
                              : item % 3 === 1
                                ? "bg-emerald-500/20"
                                : "bg-amber-500/20"
                          }`}
                        >
                          {item % 3 === 0 ? (
                            <Users className="w-5 h-5 text-indigo-400" />
                          ) : item % 3 === 1 ? (
                            <ShoppingBag className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <DollarSign className="w-5 h-5 text-amber-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-200 text-sm font-medium">
                            {item % 3 === 0
                              ? "New user registered"
                              : item % 3 === 1
                                ? "New order placed #ORD-" + (2300 + item)
                                : "Payment received #PAY-" + (1200 + item)}
                          </p>
                          <p className="text-gray-400 text-xs">{item * 10} minutes ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="banners" className="space-y-6">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2 mt-4">
                  <ImagePlus className="w-5 h-5 text-indigo-600" />
                  Upload New Banner
                </CardTitle>
                <CardDescription className="text-gray-500">Add new banners to display on your homepage</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
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
                    <p className="text-sm text-gray-400 mb-2">Preview:</p>
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
                  className="mt-4 gap-2 bg-indigo-600 hover:bg-indigo-700"
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-400" />
                Current Banners
              </h3>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-40 bg-gray-800 rounded-lg border border-gray-700">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
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
                    <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md bg-white border-gray-200">
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
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-700">No banners uploaded yet.</p>
                <p className="text-gray-500 text-sm mt-1">Upload your first banner to get started.</p>
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard

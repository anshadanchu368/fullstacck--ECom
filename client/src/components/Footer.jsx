"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail } from "lucide-react"
import { motion } from "framer-motion"

// Assuming you have categories defined somewhere in your app
// If not, you'll need to define them
const categories = [
  { id: 1, label: "New Arrivals" },
  { id: 2, label: "Women" },
  { id: 3, label: "Men" },
  { id: 4, label: "Accessories" },
  { id: 5, label: "Sale" },
]

export default function Footer() {
  // Function to handle navigation to listing page
  const handleNaviagteToListingPage = (category, type) => {
    // Implement your navigation logic here
    console.log(`Navigating to ${type}: ${category.label}`)
  }

  return (
    <footer className="bg-muted/30 pt-12 pb-6 border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="ClapStudio Logo" className="h-6 w-auto" />
              <span className="text-xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Clap</span>
                <span className="text-muted-foreground">Studio</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Elevate your style with our curated collection of fashion essentials. Quality meets affordability.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-muted-foreground hover:text-primary"
                    onClick={() => handleNaviagteToListingPage(category, "category")}
                  >
                    {category.label}
                  </Button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">123 Fashion Street, Design District, City, 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">support@clapstudio.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <Separator className="mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} ClapStudio. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground hover:text-primary">
              Privacy Policy
            </Button>
            <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground hover:text-primary">
              Terms of Service
            </Button>
            <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground hover:text-primary">
              Cookies
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

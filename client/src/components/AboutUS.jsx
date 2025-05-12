"use client"

import { motion } from "framer-motion"
import { Factory, TruckIcon, IndianRupee, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutSection() {
  const features = [
    {
      icon: Factory,
      title: "Indian Manufacturing",
      description: "Quality garments produced in our Delhi-based facilities with local craftsmanship.",
    },
    {
      icon: TruckIcon,
      title: "Pan-India Delivery",
      description: "Fast shipping to all major Indian cities with bulk order discounts.",
    },
    {
      icon: IndianRupee,
      title: "Competitive Pricing",
      description: "Factory-direct rates that help your business maximize profits.",
    },
    {
      icon: ShieldAlert,
      title: "No-Refund Policy",
      description: "All sales are final. We ensure quality before dispatch.",
    },
  ]

  return (
    <section className="py-10 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* About Us Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">About Us</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Your trusted Indian wholesale apparel partner since 2020
          </p>
        </motion.div>

        {/* Main Content - Simplified */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-muted-foreground mb-6">
              Based in the textile hub of Tamilnadu, we supply premium wholesale apparel to retailers across India. With 4
              years of industry experience, our team delivers quality garments at competitive prices with minimum order
              quantities suitable for businesses of all sizes.
            </p>
        
          </motion.div>
        </div>

        {/* Features Grid - Simplified */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-muted/50 hover:shadow-md transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full flex items-center justify-center mr-4">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base mb-1">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 text-center"
        >
       
        </motion.div>
      </div>
    </section>
  )
}

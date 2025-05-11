

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { subscribeNewsletter } from '@/store/shop/Newsletter'
import { toast } from 'sonner'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()

  const handleSubscribe = () => {
    if (!email) return
    dispatch(subscribeNewsletter(email))
    toast.success("success",{
        title:"You have been subscribed"
    })
    setEmail('')
  }

  return (
    <section className="py-12 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter for exclusive offers and the latest fashion trends
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button className="group" onClick={handleSubscribe}>
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

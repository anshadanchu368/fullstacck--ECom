import { Button } from "@/components/button";
import imageOne from "../../assets/banner/bannerImage.png";
import imageTwo from "../../assets/banner/image6.png";
import imageThree from "../../assets/banner/image7.png";
import { BabyIcon, ChevronLeftIcon, ChevronRightIcon, CloudLightning, ShirtIcon, UmbrellaIcon, WatchIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

const ShoppingHome = () => {

  const [currentSlide,setCurrentSlide]=useState(0)

  const slides=[imageOne,imageTwo,imageThree]

    
  useEffect(()=>{

    const timer = setInterval(()=>{
      setCurrentSlide(prevSlide=>(prevSlide +1) % slides.length)
    },5000)
   
     return ()=> clearInterval(timer)

  },[])

  const categories =  [
    { id: "men", label: "Men" ,icon:ShirtIcon},
    { id: "women", label: "Women" ,icon:CloudLightning},
    { id: "kids", label: "Kids" ,icon:BabyIcon},
    { id: "accessories", label: "Accessories",icon:WatchIcon },
    { id: "footwear", label: "Footwear", icon:UmbrellaIcon},
  ];

  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            className={`${index === currentSlide ? "opacity-100" :"opacity-0"} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
          />
        ))}
        <Button onClick={()=>setCurrentSlide(prevSlide =>(prevSlide-1 + slides.length) % slides.length)} variant ="outline" size="icon" className="absolute top-1/2 left-4 transform  -transform-translate-y-1/2 bg-white/80">
             <ChevronLeftIcon className="w-4 h-4"/>
        </Button>
        <Button onClick={()=>setCurrentSlide(prevSlide =>(prevSlide+1 + slides.length) % slides.length)}variant ="outline" size="icon" className="absolute top-1/2 right-4 transform  -transform-translate-y-1/2 bg-white/80">
             <ChevronRightIcon className="w-4 h-4"/>
        </Button>
      </div>
      <section className="py-12 b-gray-50">
        <div className="container mx-auto p-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {
              categories.map(categoryItem=><Card className="cursor-pointer hover:shadow-lg transition-shadow" >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <categoryItem.icon className="w-12 h-12 mb-4 text-primary "/>
                    <span className="font-bold">{categoryItem.label}</span>
                  </CardContent>
              </Card>)
            }
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShoppingHome;

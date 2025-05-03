
import { StarIcon } from "lucide-react"
import { Button } from "../ui/button"

function StarRatingComponent({ rating, handleRatingChange, size = "default" }) {
  const isSmall = size === "small"

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          className={`${isSmall ? "p-0.5" : "p-2"} rounded-full transition-colors ${
            star <= rating
              ? "text-yellow-500 hover:bg-black"
              : "text-black hover:bg-primary hover:text-primary-foreground"
          }`}
          variant="outline"
          size={isSmall ? "sm" : "icon"}
          onClick={handleRatingChange ? () => handleRatingChange(star) : null}
        >
          <StarIcon
            className={`${isSmall ? "w-3 h-3" : "w-6 h-6"} ${star <= rating ? "fill-yellow-500" : "fill-black"}`}
          />
        </Button>
      ))}
    </div>
  )
}

export default StarRatingComponent

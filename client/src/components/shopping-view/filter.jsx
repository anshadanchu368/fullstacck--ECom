import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp } from "lucide-react"

const ProductFilter = ({ filters, handleFilter }) => {
  const [expandedSections, setExpandedSections] = useState(["category", "apparel"])

  const localFilterOptions = {
    category: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
    apparel: [
      { id: "full-sleeve", label: "Full Sleeve T-shirts" },
      { id: "five-sleeve", label: "Five Sleeve T-shirts" },
      { id: "hoodies", label: "Hoodies" },
      { id: "jogger", label: "Jogger Jeans" },
      { id: "jersey", label: "Jersey" },
      { id: "casual", label: "Casual Wear" },
    ],
  }

  const toggleSection = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  const clearAllFilters = () => {
    Object.keys(localFilterOptions).forEach((section) => {
      localFilterOptions[section].forEach((option) => {
        if (filters[section]?.includes(option.id)) {
          handleFilter(section, option.id)
        }
      })
    })
  }

  return (
    <div className="border border-border/40 rounded-md p-4 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="flex justify-end pb-4 border-b border-border/30">
        <button onClick={clearAllFilters} className="text-sm underline underline-offset-4">
          Clear All
        </button>
      </div>

      {Object.keys(localFilterOptions).map((keyItem) => (
        <div key={keyItem} className="pb-3 border-b border-border/30 last:border-0">
          <button
            className="w-full text-left flex justify-between items-center py-1"
            onClick={() => toggleSection(keyItem)}
            aria-expanded={expandedSections.includes(keyItem)}
          >
            <h3 className="text-base font-bold capitalize">
              {keyItem === "apparel" ? "Apparel Types" : keyItem}
            </h3>
            {expandedSections.includes(keyItem) ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {expandedSections.includes(keyItem) && (
            <div className="grid gap-2 mt-3">
              {localFilterOptions[keyItem].map((option) => (
                <Label
                  key={option.id}
                  className="flex items-center gap-2 font-medium text-sm cursor-pointer hover:text-primary transition-colors"
                >
                  <Checkbox
                    checked={filters[keyItem]?.includes(option.id) || false}
                    onCheckedChange={() => handleFilter(keyItem, option.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="truncate">{option.label}</span>
                  {option.count && (
                    <span className="ml-auto text-xs text-muted-foreground">({option.count})</span>
                  )}
                </Label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ProductFilter


import { filterOptions } from "@/config"
import { useState } from "react"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { Button } from "../button"
import { ChevronDown, ChevronUp, FilterIcon, X } from "lucide-react"

const ProductFilter = ({ filters, handleFilter }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState(Object.keys(filterOptions))

  const toggleSection = (section) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const clearAllFilters = () => {
    Object.keys(filterOptions).forEach((section) => {
      filterOptions[section].forEach((option) => {
        if (filters[section]?.includes(option.id)) {
          handleFilter(section, option.id)
        }
      })
    })
  }

  const hasActiveFilters = Object.values(filters).some((arr) => arr && arr.length > 0)

  return (
    <div className="bg-background rounded-lg shadow-sm border border-border/40">
      {/* Mobile filter toggle */}
      <div className="md:hidden p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-extrabold flex items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          Filters
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="filter-panel"
        >
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Desktop filter header */}
      <div className="hidden md:flex p-4 border-b justify-between items-center">
        <h2 className="text-lg font-extrabold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Filter content - hidden on mobile when collapsed */}
      <div
        id="filter-panel"
        className={`${isOpen ? "block" : "hidden"} md:block p-4 space-y-5 max-h-[calc(100vh-200px)] md:overflow-y-auto`}
      >
        {Object.keys(filterOptions).map((keyItem) => (
          <div key={keyItem} className="pb-3 border-b border-border/30 last:border-0">
            <button
              className="w-full text-left flex justify-between items-center py-1"
              onClick={() => toggleSection(keyItem)}
              aria-expanded={expandedSections.includes(keyItem)}
            >
              <h3 className="text-base font-bold capitalize">{keyItem}</h3>
              {expandedSections.includes(keyItem) ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {expandedSections.includes(keyItem) && (
              <div className="grid gap-2 mt-3">
                {filterOptions[keyItem].map((option) => (
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
                    {option.count && <span className="ml-auto text-xs text-muted-foreground">({option.count})</span>}
                  </Label>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Mobile clear filters button */}
        <div className="md:hidden pt-2">
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters} className="w-full">
              <X className="h-4 w-4 mr-2" />
              Clear all filters
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductFilter

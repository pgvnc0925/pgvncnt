"use client"

import { useState } from "react"
import { ChevronDown, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BookSearchProps {
  allAuthors: string[]
  onFilterChange: (topic: string | null, author: string | null) => void
}

const TOPICS = [
  "Marketing",
  "Comportamento del Consumatore",
  "Organizzazione Aziendale",
]

export function BookSearch({ allAuthors, onFilterChange }: BookSearchProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)

  const handleTopicClick = (topic: string) => {
    const newTopic = selectedTopic === topic ? null : topic
    setSelectedTopic(newTopic)
    onFilterChange(newTopic, selectedAuthor)
  }

  const handleAuthorClick = (author: string) => {
    const newAuthor = selectedAuthor === author ? null : author
    setSelectedAuthor(newAuthor)
    onFilterChange(selectedTopic, newAuthor)
  }

  const hasActiveFilters = selectedTopic !== null || selectedAuthor !== null

  const handleClearAll = () => {
    setSelectedTopic(null)
    setSelectedAuthor(null)
    onFilterChange(null, null)
  }

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Topic Filters */}
        {TOPICS.map((topic) => {
          const isSelected = selectedTopic === topic
          return (
            <Badge
              key={topic}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                isSelected
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  : "hover:bg-secondary/10 hover:border-secondary/40"
              }`}
              onClick={() => handleTopicClick(topic)}
            >
              {topic}
            </Badge>
          )
        })}

        {/* Author Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-full border ${
                selectedAuthor
                  ? "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/90"
                  : "bg-background border-input hover:bg-secondary/10 hover:border-secondary/40"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              {selectedAuthor || "Filtra per Autore"}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto w-56">
            {allAuthors.map((author) => (
              <DropdownMenuItem
                key={author}
                onClick={() => handleAuthorClick(author)}
                className={`cursor-pointer ${
                  selectedAuthor === author ? "bg-secondary/20 font-medium" : ""
                }`}
              >
                {author}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Pulisci filtri
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          Filtri attivi:
          {selectedTopic && (
            <span className="ml-2 font-medium text-foreground">{selectedTopic}</span>
          )}
          {selectedTopic && selectedAuthor && <span className="mx-1">•</span>}
          {selectedAuthor && (
            <span className="font-medium text-foreground">{selectedAuthor}</span>
          )}
        </div>
      )}
    </div>
  )
}

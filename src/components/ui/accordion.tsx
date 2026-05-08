"use client"

import * as React from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

interface AccordionProps {
  type?: "single" | "multiple"
  children: React.ReactNode
  className?: string
}

function Accordion({ children, className }: AccordionProps) {
  return (
    <div data-slot="accordion" className={cn("space-y-2", className)}>
      {children}
    </div>
  )
}

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
  defaultOpen?: boolean
}

const AccordionItemContext = React.createContext<{
  isOpen: boolean
  toggle: () => void
}>({
  isOpen: false,
  toggle: () => {},
})

function AccordionItem({ children, className, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <AccordionItemContext.Provider value={{ isOpen, toggle: () => setIsOpen(!isOpen) }}>
      <Collapsible.Root
        data-slot="accordion-item"
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn("border-b", className)}
      >
        {children}
      </Collapsible.Root>
    </AccordionItemContext.Provider>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const { isOpen, toggle } = React.useContext(AccordionItemContext)

  return (
    <Collapsible.Trigger
      data-slot="accordion-trigger"
      onClick={toggle}
      className={cn(
        "flex w-full flex-1 items-center justify-between py-4 font-medium transition-all",
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </Collapsible.Trigger>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

function AccordionContent({ children, className }: AccordionContentProps) {
  return (
    <Collapsible.Panel
      data-slot="accordion-content"
      className={cn("overflow-hidden text-sm", className)}
    >
      <div className="pb-4 pt-0">{children}</div>
    </Collapsible.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

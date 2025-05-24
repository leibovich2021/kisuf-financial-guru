
import { useState, useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { 
  Plus, 
  Calculator, 
  PieChart, 
  FileText, 
  Target, 
  TrendingUp,
  Wallet,
  CreditCard
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddTransaction?: () => void;
}

const CommandPalette = ({ open, setOpen, onAddTransaction }: CommandPaletteProps) => {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const handleAction = (action: string) => {
    setOpen(false);
    
    switch (action) {
      case "add-transaction":
        onAddTransaction?.();
        break;
      case "set-budget":
        // Navigate to budget page or open budget modal
        console.log("Navigate to budget page");
        break;
      case "view-reports":
        // Navigate to reports or show analytics
        console.log("Navigate to reports");
        break;
      case "export-data":
        // Trigger data export
        console.log("Export data");
        break;
      case "investment-tracker":
        // Navigate to investments
        console.log("Navigate to investments");
        break;
      case "savings-goals":
        // Open savings goals modal
        console.log("Open savings goals");
        break;
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="חפש פעולות..." />
      <CommandList>
        <CommandEmpty>לא נמצאו תוצאות.</CommandEmpty>
        <CommandGroup heading="פעולות מהירות">
          <CommandItem onSelect={() => handleAction("add-transaction")}>
            <Plus className="mr-2 h-4 w-4" />
            <span>הוסף עסקה</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction("set-budget")}>
            <Target className="mr-2 h-4 w-4" />
            <span>קבע תקציב</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction("view-reports")}>
            <PieChart className="mr-2 h-4 w-4" />
            <span>דוחות פיננסיים</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction("export-data")}>
            <FileText className="mr-2 h-4 w-4" />
            <span>ייצא נתונים</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction("investment-tracker")}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>מעקב השקעות</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction("savings-goals")}>
            <Wallet className="mr-2 h-4 w-4" />
            <span>יעדי חיסכון</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;

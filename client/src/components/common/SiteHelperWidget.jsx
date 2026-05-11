import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BotMessageSquare, X } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import GeminiHelper from "./GeminiHelper";

export default function SiteHelperWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={100}>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="group relative h-16 w-16 rounded-full bg-black p-5 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-800 hover:shadow-2xl"
                  onClick={() => setIsOpen(true)}
                  aria-label="Open RaiseIt Assistant"
                >
                  <BotMessageSquare className="h-8 w-8 transition-transform duration-300 group-hover:rotate-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Need help?</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-[29rem] sm:bottom-6 sm:right-6"
          >
            <Card className="flex max-h-[min(680px,calc(100vh-3rem))] min-h-[560px] flex-col overflow-hidden rounded-[1.75rem] border border-gray-200/80 bg-white shadow-2xl shadow-black/15">
              <header className="flex items-center justify-between border-b border-gray-100 bg-[#fbfaf8] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-2.5 shadow-sm ring-1 ring-gray-200">
                    <BotMessageSquare className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <div className="font-semibold text-black">RaiseIt Guide</div>
                    <div className="text-xs text-gray-500">Here to help you move faster</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-9 w-9 rounded-full text-gray-500 hover:bg-white hover:text-black"
                  aria-label="Close Chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </header>

              <GeminiHelper />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}

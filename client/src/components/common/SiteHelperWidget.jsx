import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X, Minimize2, Maximize2 } from "lucide-react";
import clsx from "clsx";
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
  const [isMinimized, setIsMinimized] = useState(false);

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
                  aria-label="Open Chatbot Helper"
                >
                  <MessageSquare className="h-15 w-15 transition-transform duration-300 group-hover:rotate-12" />
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
            className="fixed bottom-8 right-8 z-50 w-[26rem]"
          >
            <Card className="flex h-full flex-col overflow-hidden border-gray-200/80 shadow-2xl">
              {/* Chat Header */}
              <header className="flex items-center justify-between border-b border-gray-200 bg-white p-3">
                <div className="flex items-center gap-3 pl-2">
                  <div className="relative">
                    <MessageSquare className="h-5 w-5 text-black" />
                    <span className="absolute -top-1 -right-1.5 flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                    </span>
                  </div>
                  <span className="font-semibold text-black"></span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-black"
                    aria-label={
                      isMinimized ? "Maximize Chat" : "Minimize Chat"
                    }
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-4 w-4" />
                    ) : (
                      <Minimize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-black"
                    aria-label="Close Chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </header>

              {/* Chat Content */}
              <div
                className={clsx(
                  "grid transition-all duration-500 ease-in-out",
                  {
                    "grid-rows-[1fr]": !isMinimized,
                    "grid-rows-[0fr]": isMinimized,
                  }
                )}
              >
                <div className="h-[430px] overflow-hidden">
                  <GeminiHelper />
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}
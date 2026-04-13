import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Skills from "./pages/Skills.tsx";
import Plugins from "./pages/Plugins.tsx";
import MCPServers from "./pages/MCPServers.tsx";
import Templates from "./pages/Templates.tsx";
import Jobs from "./pages/Jobs.tsx";
import Detail from "./pages/Detail.tsx";
import Submit from "./pages/Submit.tsx";
import Login from "./pages/Login.tsx";
import Admin from "./pages/Admin.tsx";
import About from "./pages/About.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mcp-servers" element={<MCPServers />} />
            <Route path="/mcp-servers/:id" element={<Detail />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/skills/:id" element={<Detail />} />
            <Route path="/plugins" element={<Plugins />} />
            <Route path="/plugins/:id" element={<Detail />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/templates/:id" element={<Detail />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<Detail />} />
            <Route path="/about" element={<About />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;

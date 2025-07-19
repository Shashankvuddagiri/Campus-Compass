'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { PlusCircle, Search, Compass } from 'lucide-react';

import type { Item, ItemCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportItemDialog } from '@/components/report-item-dialog';
import { ItemGrid } from '@/components/item-grid';
import { getItems, getFoundItemsForMatching } from '@/lib/data';
import { matchItems } from '@/ai/flows/match-items';
import { MatchingResultsDialog } from '@/components/matching-results-dialog';
import { ChatAssistant } from '@/components/chat-assistant';

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<Item[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'all'>('all');
  const [isReportDialogOpen, setReportDialogOpen] = useState(false);
  const [matchedItems, setMatchedItems] = useState<Item[]>([]);
  const [isMatchDialogOpen, setMatchDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchItems = async () => {
      const allItems = await getItems();
      setItems(allItems);
    };
    fetchItems();
  }, []);

  const handleReportSuccess = (newItem: Item) => {
    setItems((prevItems) => [newItem, ...prevItems]);
    setReportDialogOpen(false);

    if (newItem.status === 'Lost') {
      startTransition(async () => {
        const foundItems = await getFoundItemsForMatching();
        if (foundItems.length > 0) {
          const result = await matchItems({
            lostItemDescription: newItem.description,
            foundItemDescriptions: foundItems.map(
              (item) => `ID:${item.id} - ${item.description}`
            ),
          });
          
          if (result.potentialMatches && result.potentialMatches.length > 0) {
            const matchedIds = result.potentialMatches.map(pm => pm.split(' - ')[0].replace('ID:', ''));
            const fullMatchedItems = foundItems.filter(item => matchedIds.includes(item.id));
            setMatchedItems(fullMatchedItems);
            setMatchDialogOpen(true);
          }
        }
      });
    }
  };

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => item.status.toLowerCase() === activeTab)
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((item) =>
        categoryFilter === 'all' ? true : item.category === categoryFilter
      );
  }, [items, activeTab, searchTerm, categoryFilter]);

  const categories: ItemCategory[] = ['Electronics', 'Books', 'Clothing', 'ID Cards', 'Other'];

  if (!isClient) {
    return null; 
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Compass className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Campus Compass</h1>
            </div>
            <Button onClick={() => setReportDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Report Item
            </Button>
          </div>
        </header>

        <main className="flex-1">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Lost Something? Found Something?
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Your one-stop platform for reuniting lost items with their owners on campus.
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'lost' | 'found')} className="w-full">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <TabsList className="grid grid-cols-2 w-full sm:w-auto">
                  <TabsTrigger value="lost">Lost Items</TabsTrigger>
                  <TabsTrigger value="found">Found Items</TabsTrigger>
                </TabsList>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search for items..." 
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ItemCategory | 'all')}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <TabsContent value="lost">
                <ItemGrid items={filteredItems} isLoading={isPending} />
              </TabsContent>
              <TabsContent value="found">
                <ItemGrid items={filteredItems} isLoading={isPending} />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <footer className="bg-background/80 border-t mt-auto">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Campus Compass. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <ChatAssistant />

      <ReportItemDialog
        isOpen={isReportDialogOpen}
        setIsOpen={setReportDialogOpen}
        onReportSuccess={handleReportSuccess}
      />
      <MatchingResultsDialog
        isOpen={isMatchDialogOpen}
        setIsOpen={setMatchDialogOpen}
        items={matchedItems}
        isLoading={isPending}
      />
    </>
  );
}

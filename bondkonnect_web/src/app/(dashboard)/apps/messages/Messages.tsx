"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ConversationList from "../../components/apps/messages/conversation-list";
import ChatWindow from "../../components/apps/messages/chat-window";
import { Plus, Search, Users, Shield, MessageSquare, ArrowRight, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getMessageParticipants } from "@/lib/actions/api.actions";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { submitMessage } from "@/lib/actions/api.actions";
import { Card } from "@/components/ui/card";

interface Participant {
  Id: number;
  details: {
    Id: number;
    Email: string;
    FirstName: string;
    OtherNames: string;
  };
}

export default function Messages({ userDetails }: { userDetails: any }) {
  const searchParams = useSearchParams();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [participants, setParticipants] = useState<{ data: Participant[], admins: Participant[] }>({ data: [], admins: [] });
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Handle chatId from URL
  useEffect(() => {
    const chatId = searchParams.get('chatId');
    if (chatId) {
      setSelectedChat(Number(chatId));
    }
  }, [searchParams]);

  const handleStartNewChat = async () => {
    try {
      const result = await getMessageParticipants(userDetails.email);
      if (result?.success) {
        setParticipants({
          data: result.data || [],
          admins: result.admins || []
        });
        setIsNewChatOpen(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch participants",
        variant: "destructive"
      });
    }
  };

  const handleSelectParticipant = (participant: any) => {
    // Just set the selected chat to the participant's ID and close the dialog
    setSelectedChat(participant.Id);
    setIsNewChatOpen(false);
  };

  const filterParticipants = (items: Participant[]) => {
    return items.filter(item => 
      `${item.details.FirstName} ${item.details.OtherNames}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 sm:p-6 gap-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Messages</h2>
          <p className="text-neutral-500 mt-1">
             Connect and collaborate with your team and administrators.
          </p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden bg-neutral-50/50 rounded-xl border border-neutral-200 shadow-sm p-1">
        
        {/* Sidebar - Conversation List */}
        <div className="w-80 flex flex-col bg-white rounded-lg border-r border-neutral-200 h-full overflow-hidden">
          <div className="p-4 border-b border-neutral-100 bg-white sticky top-0 z-10">
            <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-black text-white hover:bg-neutral-800 transition-all shadow-md hover:shadow-lg" onClick={handleStartNewChat}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Conversation
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] p-0 gap-0 border-neutral-200 overflow-hidden shadow-2xl bg-white">
                <DialogHeader className="px-6 pt-6 pb-2 bg-white">
                  <DialogTitle className="text-2xl font-bold text-black">New Conversation</DialogTitle>
                </DialogHeader>
                
                <div className="border-b border-neutral-100 px-6 pb-4 bg-white">
                  <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-neutral-500" />
                    <Input
                      placeholder="Search people..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-none shadow-none focus-visible:ring-0 text-lg px-0 h-auto placeholder:text-neutral-500 font-medium text-black"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="px-6 pt-2">
                  <Tabs defaultValue="participants" className="w-full">
                    <TabsList className="w-full justify-start gap-6 bg-transparent p-0 h-auto border-b border-neutral-100 rounded-none mb-4">
                      <TabsTrigger 
                        value="participants" 
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black text-neutral-600 rounded-none px-0 py-2 text-sm font-semibold transition-all hover:text-black"
                      >
                        Participants
                      </TabsTrigger>
                      <TabsTrigger 
                        value="admins" 
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black text-neutral-600 rounded-none px-0 py-2 text-sm font-semibold transition-all hover:text-black"
                      >
                        Administrators
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="participants" className="mt-0 outline-none">
                      <ScrollArea className="h-[350px] -mr-4 pr-4 pb-6">
                        {filterParticipants(participants.data).length > 0 ? (
                          <div className="grid gap-1">
                            {filterParticipants(participants.data).map((participant) => (
                              <div
                                key={participant.Id}
                                className="group flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 cursor-pointer transition-all"
                                onClick={() => handleSelectParticipant(participant.details)}
                              >
                                <Avatar className="h-12 w-12 border border-neutral-200 shadow-sm group-hover:scale-105 transition-transform">
                                  <AvatarFallback className="bg-white text-black font-bold text-base border border-neutral-100">
                                    {participant.details.FirstName.charAt(0)}
                                    {participant.details.OtherNames.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-black text-base truncate">
                                    {participant.details.FirstName} {participant.details.OtherNames}
                                  </div>
                                  <div className="text-sm text-neutral-600 truncate font-medium">{participant.details.Email}</div>
                                </div>
                                <div className="h-8 w-8 rounded-full border border-neutral-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm">
                                   <ArrowRight className="h-4 w-4 text-black" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[200px] text-neutral-500">
                             <div className="h-16 w-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-neutral-400" />
                             </div>
                            <p className="text-base font-semibold text-black">No one found</p>
                            <p className="text-sm text-neutral-600 mt-1 font-medium">We couldn't find anyone matching "{searchQuery}"</p>
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="admins" className="mt-0 outline-none">
                      <ScrollArea className="h-[350px] -mr-4 pr-4 pb-6">
                        {filterParticipants(participants.admins).length > 0 ? (
                          <div className="grid gap-1">
                            {filterParticipants(participants.admins).map((admin) => (
                              <div
                                key={admin.Id}
                                className="group flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 cursor-pointer transition-all"
                                onClick={() => handleSelectParticipant(admin.details)}
                              >
                                <Avatar className="h-12 w-12 border border-neutral-200 shadow-sm group-hover:scale-105 transition-transform">
                                  <AvatarFallback className="bg-black text-white font-bold text-base">
                                    {admin.details.FirstName.charAt(0)}
                                    {admin.details.OtherNames.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-black text-base truncate">
                                      {admin.details.FirstName} {admin.details.OtherNames}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-black border border-neutral-200">Admin</span>
                                  </div>
                                  <div className="text-sm text-neutral-600 truncate font-medium">{admin.details.Email}</div>
                                </div>
                                <div className="h-8 w-8 rounded-full border border-neutral-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm">
                                   <ArrowRight className="h-4 w-4 text-black" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[200px] text-neutral-500">
                             <div className="h-16 w-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                                <Shield className="h-6 w-6 text-neutral-400" />
                             </div>
                            <p className="text-base font-semibold text-black">No admins</p>
                            <p className="text-sm text-neutral-600 mt-1 font-medium">There are no administrators available.</p>
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex-1 overflow-hidden">
             <ConversationList
              userDetails={userDetails}
              selectedChat={selectedChat}
              onSelectChat={setSelectedChat}
            />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 bg-white rounded-lg h-full overflow-hidden flex flex-col relative">
          {selectedChat ? (
            <ChatWindow
              userDetails={userDetails}
              chatId={selectedChat}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white animate-in fade-in duration-700">
              <div className="bg-neutral-50 p-8 rounded-full mb-6 animate-pulse">
                <MessageSquare className="h-12 w-12 text-neutral-300" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">Your Messages</h3>
              <p className="text-neutral-500 max-w-xs leading-relaxed">
                Select a conversation from the sidebar or start a new one to begin collaborating.
              </p>
              <Button onClick={handleStartNewChat} variant="outline" className="mt-8 border-neutral-200 bg-white text-black hover:bg-neutral-50 hover:border-neutral-300 shadow-sm transition-all active:scale-95 px-8 h-11 rounded-xl">
                 Start a new chat
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
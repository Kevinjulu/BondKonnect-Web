"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ConversationList from "../../components/apps/messages/conversation-list";
import ChatWindow from "../../components/apps/messages/chat-window";
import { Plus, Search, Users, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getMessageParticipants } from "@/lib/actions/api.actions";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { submitMessage } from "@/lib/actions/api.actions";

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
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      <div className="w-80 flex flex-col bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" onClick={handleStartNewChat}>
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Start New Conversation</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search participants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Tabs defaultValue="participants" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="participants" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Participants
                  </TabsTrigger>
                  <TabsTrigger value="admins" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admins
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="participants">
                  <ScrollArea className="h-[400px] pr-4 mt-4">
                    {filterParticipants(participants.data).length > 0 ? (
                      <div className="space-y-2">
                        {filterParticipants(participants.data).map((participant) => (
                          <Button
                            key={participant.Id}
                            variant="ghost"
                            className="w-full justify-start p-3 h-auto"
                            onClick={() => handleSelectParticipant(participant.details)}
                          >
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {participant.details.FirstName}
                                {participant.details.OtherNames}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <div className="font-medium">
                                {participant.details.FirstName} {participant.details.OtherNames}
                              </div>
                              <div className="text-xs text-gray-500">{participant.details.Email}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                        <Users className="h-12 w-12 mb-2" />
                        <p>No participants found</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="admins">
                  <ScrollArea className="h-[400px] pr-4 mt-4">
                    {filterParticipants(participants.admins).length > 0 ? (
                      <div className="space-y-2">
                        {filterParticipants(participants.admins).map((admin) => (
                          <Button
                            key={admin.Id}
                            variant="ghost"
                            className="w-full justify-start p-3 h-auto"
                            onClick={() => handleSelectParticipant(admin.details)}
                          >
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {admin.details.FirstName}
                                {admin.details.OtherNames}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <div className="font-medium">
                                {admin.details.FirstName} {admin.details.OtherNames}
                              </div>
                              <div className="text-xs text-gray-500">{admin.details.Email}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                        <Shield className="h-12 w-12 mb-2" />
                        <p>No admins found</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
        <ConversationList
          userDetails={userDetails}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
      </div>
      <div className="flex-1 bg-white rounded-lg shadow">
        {selectedChat ? (
          <ChatWindow
            userDetails={userDetails}
            chatId={selectedChat}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a conversation or start a new one
          </div>
        )}
      </div>
    </div>
  );
}

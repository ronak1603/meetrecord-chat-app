import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { firestore } from "@/services/firebase";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

const fetchMessages = async (linkId: string): Promise<Message[]> => {
  const messagesQuery = query(
    collection(firestore, "chatRooms", linkId, "messages"),
    orderBy("timestamp")
  );
  const querySnapshot = await getDocs(messagesQuery);
  return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    senderId: doc.data().senderId,
    text: doc.data().text,
    timestamp: doc.data().timestamp.toDate(),
  }));
};

const useChatMessages = (linkId: string) => {
  const queryClient = useQueryClient();
  const messagesQuery = useQuery<Message[], Error>(
    ["messages", linkId],
    () => fetchMessages(linkId),
    {
      enabled: !!linkId,
    }
  );

  const { mutate: sendMessage, isLoading: isSending } = useMutation<
    void,
    Error,
    { senderId: string; text: string }
  >({
    mutationFn: async ({
      senderId,
      text,
    }: {
      senderId: string;
      text: string;
    }) => {
      await addDoc(collection(firestore, "chatRooms", linkId, "messages"), {
        senderId,
        text,
        timestamp: new Date(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", linkId]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    dbmessages: messagesQuery.data,
    sendMessage,
    isLoading: messagesQuery.isLoading,
    isSending,
  };
};

export default useChatMessages;

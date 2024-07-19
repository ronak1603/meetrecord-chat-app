import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  writeBatch,
  DocumentData,
  QueryDocumentSnapshot,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/services/firebase";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  senderId: string;
  text: string;
  avatarUrl: string;
  timestamp: Date;
  name: string;
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
    avatarUrl: doc.data().avatarUrl,
    name: doc.data().name,
    timestamp: doc.data().timestamp.toDate(),
  }));
};

const deleteChatRoom = async (linkId: string) => {
  try {
    const batch = writeBatch(firestore);
    const messagesCollection = collection(
      firestore,
      "chatRooms",
      linkId,
      "messages"
    );
    const messagesQuerySnapshot = await getDocs(messagesCollection);
    messagesQuerySnapshot.forEach((messageDoc) => {
      batch.delete(messageDoc.ref);
    });
    const chatRoomDoc = doc(firestore, "chatRooms", linkId);
    batch.delete(chatRoomDoc);
    await batch.commit();
  } catch (error) {
    console.error("Error deleting chat room:", error);
    throw new Error("Failed to delete chat room");
  }
};

const createChatRoom = async (linkId: string) => {
  const newRoomRef = doc(firestore, "chatRooms", linkId);
  await setDoc(newRoomRef, {
    createdAt: new Date(),
  });
  return newRoomRef.id;
};

const useChatMessages = (linkId: string | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const messagesQuery = useQuery<Message[], Error>(
    ["messages", linkId],
    () => fetchMessages(linkId as string),
    {
      enabled: !!linkId,
    }
  );

  const { mutate: sendMessage, isLoading: isSending } = useMutation({
    mutationFn: async ({
      senderId,
      text,
      avatarUrl,
      name,
    }: {
      senderId: string;
      text: string;
      avatarUrl: string;
      name: string;
    }) => {
      await addDoc(
        collection(firestore, "chatRooms", linkId as string, "messages"),
        {
          senderId,
          text,
          avatarUrl,
          name,
          timestamp: new Date(),
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", linkId]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: deleteRoom } = useMutation<void, Error, string>({
    mutationFn: deleteChatRoom,
    onSuccess: () => {
      router.push("/dashboard");
      queryClient.invalidateQueries(["messages", linkId]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: createRoom } = useMutation<string, Error, string>({
    mutationFn: (linkid: string) => createChatRoom(linkid),
    onSuccess: (data) => {
      // queryClient.invalidateQueries(["messages", data]);
      router.push(`/chats/${data}`);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const checkRoomIdExists = async (roomId: string): Promise<boolean> => {
    try {
      const roomDoc = await getDoc(doc(firestore, "chatRooms", roomId));
      return roomDoc.exists();
    } catch (error) {
      return false;
    }
  };

  return {
    dbmessages: messagesQuery.data,
    sendMessage,
    isLoading: messagesQuery.isLoading,
    isSending,
    deleteRoom,
    createRoom,
    checkRoomIdExists,
  };
};

export default useChatMessages;

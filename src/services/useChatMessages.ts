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
import { getAuth } from "firebase/auth";
import { firestore } from "@/services/firebase";
import { useRouter } from "next/navigation";
import { Message } from "@/types/message";
import { useState } from "react";

interface CreateChatRoomResponse {
  roomId: string;
  creatorId: string;
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

const endChatRoomSession = async (linkId: string) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  try {
    const chatRoomDoc = await getDoc(doc(firestore, "chatRooms", linkId));
    if (!chatRoomDoc.exists()) {
      throw new Error("Chat room does not exist");
    }
    const creatorId = chatRoomDoc.data().creatorId;
    if (currentUser.uid !== creatorId) {
      throw new Error("Only the creator can end the chat room session");
    }
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
    batch.delete(chatRoomDoc.ref);
    await batch.commit();
  } catch (error) {
    throw new Error("Failed to end chat room session");
  }
};

const createChatRoom = async (linkId: string) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const newRoomRef = doc(firestore, "chatRooms", linkId);
  const roomData = {
    createdAt: new Date(),
    creatorId: currentUser.uid,
  };

  await setDoc(newRoomRef, roomData);

  return {
    roomId: newRoomRef.id,
    creatorId: currentUser.uid,
  };
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
    mutationFn: endChatRoomSession,
    onSuccess: () => {
      router.push("/login");
      queryClient.invalidateQueries(["messages", linkId]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: leaveChatRoom, isLoading: isleavingRoom } = useMutation<
    void,
    Error,
    string
  >({
    mutationFn: endChatRoomSession,
    onSuccess: () => {
      router.push("/dashboard");
      queryClient.invalidateQueries(["messages", linkId]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: createRoom } = useMutation<
    { roomId: string; creatorId: string },
    Error,
    string
  >({
    mutationFn: (linkid: string) => createChatRoom(linkid),
    onSuccess: (data: CreateChatRoomResponse) => {
      router.push(`/chats/${data.roomId}`);
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
  const getCreatorId = async (roomId: string): Promise<string | null> => {
    try {
      const roomDoc = await getDoc(doc(firestore, "chatRooms", roomId));
      if (roomDoc.exists()) {
        return roomDoc.data().creatorId || null;
      }
      return null;
    } catch (error) {
      console.error("Error fetching creator ID:", error);
      return null;
    }
  };

  return {
    dbmessages: messagesQuery.data,
    sendMessage,
    isLoading: messagesQuery.isLoading,
    isSending,
    deleteRoom,
    createRoom,
    leaveChatRoom,
    isleavingRoom,
    checkRoomIdExists,
    getCreatorId,
  };
};

export default useChatMessages;

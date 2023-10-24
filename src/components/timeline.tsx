import { useEffect, useState } from "react";
import { styled } from "styled-components";
import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string; //not required
  challengeTitle: string;
  content: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
  width: 100%;
`;

export default function Timeline() {
  const [contents, setContent] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      // 데이터베이스 및 쿼리와 실시간 연결하는 함수
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const contents = snapshot.docs.map((doc) => {
          const {
            challengeTitle,
            content,
            createdAt,
            userId,
            username,
            photo,
          } = doc.data();
          return {
            challengeTitle,
            content,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setContent(contents);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {contents.map((content) => (
        <Tweet
          key={content.id}
          {...content}
        />
      ))}
    </Wrapper>
  );
}

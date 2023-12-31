import { useState, useEffect } from "react";
import { auth, db, storage, updateProfile } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { styled } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 100vh;
  padding: 30px 20px;
  overflow-y: scroll;
  background-color: white;
`;
const PageTitle = styled.h2`
  padding: 0;
  margin: 50px 0 30px 0;
  font-size: 2rem;
`;
const AvatarContainer = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-end;
`;
const AvatarUpload = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10rem;
  height: 10rem;
  overflow: hidden;
  border-radius: 50%;
  cursor: pointer;
  background-color: #605f5e;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;

const UsernameWrapper = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 20rem;
`;
const Name = styled.span`
  font-size: 22px;
  font-weight: 600;
`;
const AvatarInput = styled.input`
  display: none;
`;

const Challenges = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: 0;
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
  background-color: #605f5e;
`;

export default function Profile({
  username,
  photo,
  content,
  challengeTitle,
  userId,
  id,
}: ITweet) {
  const user = auth.currentUser;
  // const [userName, setUserName] = useState(username);
  const [userName, setUserName] = useState(user?.displayName);
  const [editUsername, setEditUsername] = useState(false);
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [challenges, setChallenges] = useState<ITweet[]>([]);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };
  const fetchTweets = async () => {
    const challegeQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(challegeQuery);
    const challenges = snapshot.docs.map((doc) => {
      const { challengeTitle, content, createdAt, userId, username, photo } =
        doc.data();
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
    setChallenges(challenges);
  };
  useEffect(() => {
    fetchTweets();
  }, []);
  const toggleEditing = () => {
    setEditUsername((prevEditing) => !prevEditing);
  };

  return (
    <Wrapper>
      <PageTitle>마이 페이지</PageTitle>
      <AvatarContainer>
        <AvatarUpload htmlFor="avatar">
          {Boolean(avatar) ? (
            <AvatarImg src={avatar} />
          ) : (
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
            </svg>
          )}
        </AvatarUpload>
        <AvatarInput
          id="avatar"
          type="file"
          accept="image/*"
          onChange={onAvatarChange}
        />
        <UsernameWrapper>
          <Name>{userName}</Name>
        </UsernameWrapper>
      </AvatarContainer>
      <Challenges>
        {challenges.map((challenge) => (
          <Tweet
            key={challenge.id}
            {...challenge}
          />
        ))}
      </Challenges>
    </Wrapper>
  );
}

import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  getDocs,
  addDoc,
  collection,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const Wrapper = styled.div`
  width: inherit;
  padding: 15px;
  margin-bottom: 50px;
  border: 1px solid #605f5e;
`;

const ChallengeTitle = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: center;
  h3 {
    margin: 0;
    color: #605f5e;
    font-size: 1.3rem;
  }
  h4 {
    margin: 0;
    font-size: 1.6rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 5px 0;
  border: none;
  resize: none;
  color: black;
  font-size: 1.6rem;
  font-family: system-ui, -apple-system, BlickMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: white;
  &::placeholder {
    font-size: 1.6rem;
  }
  &:focus {
    outline: none;
  }
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: space-between;
`;

const AttachFileButton = styled.label`
  width: 5rem;
  color: #605f5e;
  cursor: pointer;
  background-image: url("../public/gallery.png");
  background-position: center;
  background-size: 60%;
  background-repeat: no-repeat;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  width: 12rem;
  padding: 1rem 0px;
  border: none;
  border-radius: 1rem;
  font-size: 1.6rem;
  cursor: pointer;
  color: white;
  background-color: #605f5e;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostCustomChallengeForm() {
  // 컬렉션에 저장된 현재 로그인한 사용자가 생성한 챌린지를 불러와서 사용하고자 한다.
  const [challenges, setChallenges] = useState([]);
  const day = new Date().getDate();
  const [isLoading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fetchChallenges = async () => {
    // Firestore에서 사용자의 챌린지 불러오기
    const user = auth.currentUser;
    const challengesQuery = query(
      collection(db, "challenges"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(challengesQuery);
    const challengeData = [];
    querySnapshot.forEach((doc) => {
      challengeData.push({ id: doc.id, ...doc.data() });
    });
    setChallenges(challengeData);
    console.log(">> challengeData: ", challengeData);
  };
  // 페이지가 로드될 때 사용자의 챌린지 불러오기
  useEffect(() => {
    fetchChallenges();
  }, []);
  console.log("😀 challengeData : ", challenges);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || content === "" || content.length > 180) return;

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        challengeTitle: challenges.contents[day % 30],
        content,
        createdAt: new Date(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, { photo: url });
      }
      setContent("");
      setFile(null);
      //
      fetchChallenges(); // 새로운 챌린지 추가 후, 업데이트된 챌린지 목록 불러오기
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <ChallengeTitle>
        <h4>
          day {day % 30} - {challenges.contents[day % 30]}
        </h4>
        <h3>[ {challenges.title} ]</h3>
      </ChallengeTitle>
      <hr />
      <Form onSubmit={onSubmit}>
        <TextArea
          required
          rows={5}
          maxLength={180}
          value={content}
          onChange={onChange}
          placeholder="오늘의 챌린지, 어땠나요?"
        />
        <ButtonArea>
          <AttachFileButton htmlFor="file">
            {file ? "✅" : " "}
          </AttachFileButton>
          <AttachFileInput
            type="file"
            id="file"
            onChange={onFileChange}
            accept="image/*"
          />
          <SubmitBtn
            type="submit"
            value={isLoading ? "업로딩..." : "업로드"}
          />
        </ButtonArea>
      </Form>
      <div>
        <h2>나의 챌린지 목록</h2>
        {challenges.map((challenge) => (
          <div key={challenge.id}>
            <h3>{challenge.challengeTitle}</h3>
            <p>{challenge.content}</p>
            {challenge.photo && (
              <img
                src={challenge.photo}
                alt="Challenge"
              />
            )}
          </div>
        ))}
      </div>
    </Wrapper>
  );
}

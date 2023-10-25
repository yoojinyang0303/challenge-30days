import { styled } from "styled-components";
import { useState } from "react";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  ref,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { ChallengeSample } from "./post-tweet-form";
import * as React from "react";

const Wrapper = styled.div`
  width: inherit;
  padding: 1rem 2rem 2rem 2rem;
  border: 1px solid #605f5e;
  h3 {
    font-size: 1.6rem;
  }
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
  border: 0.2rem solid orange;
`;

const Column = styled.div`
  border: 0.2rem solid green;
`;

const Photo = styled.img`
  widht: 20rem;
  height: 20rem;
  border-radius: 0.5rem;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const Contents = styled.div`
  border: 0.2rem solid magenta;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border: 0.2rem solid skyblue;
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  cursor: pointer;
  border: 0;
  border-radius: 5px;
  color: white;
  font-weight: 600;
  font-size: 12px;
  background-color: tomato;
`;
const EditButton = styled.button`
  padding: 5px 10px;
  cursor: pointer;
  border: 0;
  border-radius: 5px;
  color: white;
  font-weight: 600;
  font-size: 12px;
  background-color: #605f5e;
`;

export default function Tweet({
  username,
  photo,
  content,
  challengeTitle,
  userId,
  id,
}: ITweet) {
  const user = auth.currentUser;
  const [editTweet, setEditTweet] = useState(false);
  const [newTweet, setNewTweet] = useState(content);
  const [file, setFile] = useState<File | null>(null);

  const onDelete = async () => {
    const ok = confirm("정말로 이 트윗을 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.error(e);
    } finally {
    }
  };

  const toggleEditing = () => {
    setEditTweet((prevEditing) => !prevEditing);
  };

  const onChangingEdit = (e) => {
    const {
      target: { value },
    } = e;
    setNewTweet(value);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (user?.uid !== userId) return;
    try {
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);

        // Firestore의 해당 문서 업데이트
        await updateDoc(doc(db, "tweets", id), {
          content: newTweet,
          photo: url,
        });
      } else {
        // 이미지 파일이 첨부되지 않은 경우, 트윗 텍스트만 업데이트
        await updateDoc(doc(db, "tweets", id), {
          content: newTweet,
        });
      }
      setEditTweet(false);
    } catch (e) {
      console.error("수정 중 오류 발생: ", e);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    console.log(">> files", files);
    if (files && files.length === 1) {
      setFile(files[0]);
      console.log("👉 file ", file);
    }
  };

  return (
    <Wrapper>
      <ChallengeTitle>
        <h4>{challengeTitle}</h4>
        <h3>[ {ChallengeSample.title} ]</h3>
      </ChallengeTitle>
      <hr />
      {editTweet ? (
        <>
          <form onSubmit={submitEdit}>
            <input
              type="text"
              placeholder="Edit your tweet!"
              value={newTweet}
              onChange={onChangingEdit}
              required
            />
            <input
              type="submit"
              value="수정 내용 저장"
            />
            <input
              type="file"
              id="file"
              onChange={onFileChange}
              accept="image/*"
            />
          </form>
          <button onClick={toggleEditing}>취소</button>
        </>
      ) : (
        <Column>
          <Contents>
            <Username>{username}</Username>
            <Payload>{content}</Payload>
          </Contents>
        </Column>
      )}
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
      <ButtonWrapper>
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>삭제</DeleteButton>
        ) : null}
        {user?.uid === userId ? (
          <EditButton onClick={toggleEditing}>수정</EditButton>
        ) : null}
      </ButtonWrapper>
    </Wrapper>
  );
}

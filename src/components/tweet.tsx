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
import * as React from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  widht: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
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
  background-color: #1d9bf0;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [editTweet, setEditTweet] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet);
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
          tweet: newTweet,
          photo: url,
        });
      } else {
        // 이미지 파일이 첨부되지 않은 경우, 트윗 텍스트만 업데이트
        await updateDoc(doc(db, "tweets", id), {
          tweet: newTweet,
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
          <Username>{username}</Username>
          <Payload>{tweet}</Payload>
          {user?.uid === userId ? (
            <DeleteButton onClick={onDelete}>삭제</DeleteButton>
          ) : null}
          {user?.uid === userId ? (
            <EditButton onClick={toggleEditing}>수정</EditButton>
          ) : null}
        </Column>
      )}

      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}

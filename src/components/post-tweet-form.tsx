import * as React from "react";
import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, updateDoc } from "firebase/firestore";

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

export const ChallengeSample = {
  title: "기본 챌린지",
  contents: [
    "침대 정리하기",
    "옷장 정리하기",
    "안 쓰는 물건 기부하기",
    "유통기한 지난 음식/식재료 버리기",
    "식기구 정리하기",
    "수납함 구매하기",
    "안 쓰는 오래된 애플리케이션 삭제하기",
    "나에게 도움되는 애플리케이션 설치하기",
    "자동차 청소하기",
    "메일함 정리하기",
    "거실 정리하기",
    "악세사리/화장품 정리하기",
    "달력에 일정 정리하기",
    "명상을 통해 마음 정리하기",
    "컴퓨터 저장공간 정리하기",
    "쓰레기 버리기",
    "오래된 신발 버리기",
    "냉장고 정리하기",
    "여기까지 정리한 나에게 칭찬하기",
    "화장실 정리하기",
    "지갑 정리하기",
    "서랍 정리하기",
    "대청소하기",
    "부엌 청소하기",
    "오래된 가구 처분하기",
    "오래된 책 정리하기",
    "현관 청소하기",
    "컴퓨터 폴더 정리하기",
    "신발 세탁하기",
    "정리한 것 유지하기",
  ],
};
const day = new Date().getDate();

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
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
        challengeTitle: ChallengeSample.contents[day % 30],
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
          day {day % 30} - {ChallengeSample.contents[day % 30]}
        </h4>
        <h3>[ {ChallengeSample.title} ]</h3>
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
    </Wrapper>
  );
}

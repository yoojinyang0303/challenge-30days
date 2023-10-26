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
  border: 0.1rem solid #605f5e;
`;

const Form = styled.form``;

const FormColumn = styled.div`
  display: flex;
`;

const FormTitle = styled.div`
  label {
    display: block;
    width: 10rem;
    font-size: 1.6rem;
    font-weight: 600;
  }
`;

const FormContent = styled.div`
  width: 100%;
  input {
    width: inherit;
    margin-bottom: 1rem;
  }
`;

const ButtonArea = styled.div`
  display: flex;
  padding: 5rem 0 2rem 0;
`;

const SubmitBtn = styled.input`
  width: 13rem;
  padding: 0.5rem 0;
  margin: 0 auto;
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

export default function CustomChallengeForm() {
  const [isLoading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState(Array(30).fill(""));

  const onChange = (e) => {
    if (e.target.name === "challenge-title") {
      setTitle(e.target.value);
    } else {
      // 챌린지 내용 입력 시, 배열에 업데이트
      const index = Number(e.target.name);
      const newContents = [...contents];
      if (contents === "") return;
      newContents[index] = e.target.value;
      setContents(newContents);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || title === "" || contents === null) return;

    try {
      setLoading(true);
      // Firestore에 챌린지 양식 데이터 추가
      const challengeData = {
        title: title,
        contents: contents,
        username: user.displayName || "Anonymous",
        userId: user.uid,
      };

      await addDoc(collection(db, "challenges"), challengeData);

      setTitle("");
      setContents(Array(30).fill(""));
      console.log("챌린지 양식 업로드 완료!");
    } catch (e) {
      console.error("챌린지 생성 과정에서 오류 발생! ", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={onSubmit}>
        <FormColumn>
          <FormTitle>
            <label htmlFor="challenge-title">챌린지 제목:</label>
          </FormTitle>
          <FormContent>
            <input
              type="text"
              name="challenge-title"
              id="challenge-title"
              placeholder="챌린지 이름을 적어주세요!"
              onChange={onChange}
              required
            />
          </FormContent>
        </FormColumn>
        <hr />
        <FormColumn>
          <FormTitle>
            <label htmlFor="challenge-title">챌린지 내용:</label>
          </FormTitle>
          <FormContent>
            {contents.map((content, index) => (
              <input
                type="text"
                name={index.toString()}
                key={index}
                placeholder={`챌린지 day ${index + 1}의 내용을 입력해주세요 :)`}
                value={content}
                onChange={onChange}
                required
              />
            ))}
          </FormContent>
        </FormColumn>
        <ButtonArea>
          <SubmitBtn
            type="submit"
            value={isLoading ? "업로딩..." : "챌린지 생성하기"}
          />
        </ButtonArea>
      </Form>
    </Wrapper>
  );
}

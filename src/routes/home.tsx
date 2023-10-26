import PostTweetForm from "../components/post-tweet-form";
import PostCustomChallengeForm from "../components/post-custom-challenge-form";
import Timeline from "../components/timeline";
// import { auth } from "../firebase";
import { styled } from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  padding: 30px 20px;
  overflow-y: scroll;
  background-color: white;
`;

const PageTitle = styled.h2`
  padding: 0;
  margin: 50px 0 30px 0;
  font-size: 2rem;
`;

export default function Home() {
  return (
    <Wrapper>
      {/* 페이지 제목 */}
      <PageTitle>메인</PageTitle>
      <PostTweetForm />
      <PostCustomChallengeForm />
      <Timeline />
    </Wrapper>
  );
}

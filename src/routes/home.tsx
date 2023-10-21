import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";
// import { auth } from "../firebase";
import { styled } from "styled-components";

const PageTitle = styled.h2`
  padding: 0;
  margin: 50px 0 30px 0;
`;

const Wrapper = styled.div`
  padding: 30px 20px;
  overflow-y: scroll;
  background-color: white;
`;

export default function Home() {
  return (
    <Wrapper>
      {/* 페이지 제목 */}
      <PageTitle>메인</PageTitle>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}
